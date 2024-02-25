import * as dat from "dat.gui";

class Sphere {
  constructor(x, y, z, radius) {
    this.position = { x, y, z };
    this.velocity = {
      x: -0.5 + Math.random(),
      y: -0.5 + Math.random(),
      z: -0.5 + Math.random(),
    };
    this.illumination = 0;
    this.radius = radius;
    this.mass = (4 / 3) * Math.PI * Math.pow(radius, 3);
  }

  asVec4f() {
    return [
      this.position.x,
      this.position.y,
      this.position.z,
      // w component carries radius in integer part, illumination in fraction part
      this.radius + this.illumination,
    ];
  }

  updatePosition(dt, gravity) {
    this.velocity.x += gravity.x * dt;
    this.velocity.y += gravity.y * dt;
    this.velocity.z += gravity.z * dt;
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
    this.position.z += this.velocity.z * dt;
  }

  checkWallCollision(boxWidth, boxHeight, y) {
    const dampening = 0.8;

    if (this.position.x - this.radius < -boxWidth) {
      this.velocity.x = -this.velocity.x * dampening;
      this.position.x = -boxWidth + this.radius;
      this.illumination = 0.99;
    }

    if (this.position.x + this.radius > boxWidth) {
      this.velocity.x = -this.velocity.x * dampening;
      this.position.x = boxWidth - this.radius;
      this.illumination = 0.99;
    }

    if (this.position.y - this.radius < y) {
      this.velocity.y = -this.velocity.y * dampening;
      this.position.y = this.radius + y;
      this.illumination = 0.99;
    }

    if (this.position.y + this.radius > boxHeight + y) {
      this.velocity.y = -this.velocity.y * dampening;
      this.position.y = boxHeight - this.radius + y;
      this.illumination = 0.99;
    }

    if (this.position.z - this.radius < -boxWidth) {
      this.velocity.z = -this.velocity.z * dampening;
      this.position.z = -boxWidth + this.radius;
      this.illumination = 0.99;
    }

    if (this.position.z + this.radius > boxWidth) {
      this.velocity.z = -this.velocity.z * dampening;
      this.position.z = boxWidth - this.radius;
      this.illumination = 0.99;
    }
  }
}

export const run = async (audioCtx, analyser) => {
  let state = {
    halt: false,
    epoch: performance.now(),
    frame: 0,
    now: 0,
    dt: 0,
    lastRenderTime: 0,
    resolution: {
      x: 0,
      y: 0,
    },
    gravity: {
      x: 0.0,
      y: 0.0,
      z: 0.0,
    },
    camera: {
      stop: false,
      fov: 60,
      position: {
        x: 0,
        y: 20,
        z: 60,
      },
      target: {
        x: 0,
        y: 20,
        z: 0,
      },
    },
    sun: {
      x: -1.23,
      y: 2,
      z: -100,
    },
    fog: {
      // color: [23, 67, 59],
      color: [52, 82, 125],
      intensity: 0.005,
    },
    sky: {
      color: [6, 16, 29],
      // color: [230, 230, 230],
    },
    colorShift: {
      colorShift: [255, 235, 255],
    },
    palette: {
      a: [95, 28, 28],
      b: [174, 74, 74],
      c: [9, 9, 203],
      d: [48, 40, 40],

      // Pinkish
      // a: [155, 155, 155],
      // b: [174, 74, 74],
      // c: [9, 9, 203],
      // d: [173, 102, 102],

      offset: 0.0,
      range: 1.0,
      period: 10,
    },
    spheres: {
      objects: [
        ...[...Array(5)].map(
          (o) =>
            new Sphere(
              -5 + 5 * Math.random(),
              20 + 5 * Math.random(),
              5 + 5 * Math.random(),
              1
            )
        ),
        ...[...Array(3)].map(
          (o) =>
            new Sphere(
              -5 + 5 * Math.random(),
              20 + 5 * Math.random(),
              5 + 5 * Math.random(),
              2
            )
        ),
        ...[...Array(5)].map(
          (o) =>
            new Sphere(
              -5 + 5 * Math.random(),
              20 + 5 * Math.random(),
              5 + 5 * Math.random(),
              3
            )
        ),
      ],
    },
    box: {
      y: 10,
      size: 10,
    },
    audio: {
      offset: 22,
      beat: 0,
    },
  };

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") {
        state.halt = !state.halt;
      }
      if (e.key === " ") {
        state.camera.stop = !state.camera.stop;
      }
    },
    true
  );

  analyser.fftSize = 256;
  const fftDataArray = new Uint8Array(analyser.frequencyBinCount);

  const vertexShader = `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`;
  const fragmentShader = await fetch("/fragment.glsl").then((res) =>
    res.text()
  );

  const programs = [];

  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.style.position = "fixed";
  canvas.style.left = canvas.style.top = 0;

  const gl = canvas.getContext("webgl");
  const gui = new dat.GUI();
  const fpsCounter = document.querySelector("#fps");

  const frameTimes = [];
  let frameCursor = 0;
  let numFrames = 0;
  const maxFrames = 20;
  let totalFPS = 0;

  function handleCollisions(sphere1, sphere2) {
    const dx = sphere2.position.x - sphere1.position.x;
    const dy = sphere2.position.y - sphere1.position.y;
    const dz = sphere2.position.z - sphere1.position.z;

    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const overlap = sphere1.radius + sphere2.radius - distance;

    const isCollision = overlap > 0;

    if (isCollision) {
      // Normalized direction vector components
      const nx = dx / distance;
      const ny = dy / distance;
      const nz = dz / distance;

      // Calculate the velocity components along the normalized direction vector
      const v1i =
        sphere1.velocity.x * nx +
        sphere1.velocity.y * ny +
        sphere1.velocity.z * nz;
      const v2i =
        sphere2.velocity.x * nx +
        sphere2.velocity.y * ny +
        sphere2.velocity.z * nz;

      // Calculate the final velocities along the collision line using the conservation of momentum and kinetic energy
      const v1f =
        (v1i * (sphere1.mass - sphere2.mass) + 2 * sphere2.mass * v2i) /
        (sphere1.mass + sphere2.mass);
      const v2f =
        (v2i * (sphere2.mass - sphere1.mass) + 2 * sphere1.mass * v1i) /
        (sphere1.mass + sphere2.mass);

      // Update the velocities of the spheres
      sphere1.velocity.x += (v1f - v1i) * nx;
      sphere1.velocity.y += (v1f - v1i) * ny;
      sphere1.velocity.z += (v1f - v1i) * nz;

      sphere2.velocity.x += (v2f - v2i) * nx;
      sphere2.velocity.y += (v2f - v2i) * ny;
      sphere2.velocity.z += (v2f - v2i) * nz;

      // Move spheres apart along the line of collision based on their mass
      const totalMass = sphere1.mass + sphere2.mass;
      const moveSphere1 = overlap * (sphere2.mass / totalMass);
      const moveSphere2 = overlap * (sphere1.mass / totalMass);

      sphere1.position.x -= moveSphere1 * nx;
      sphere1.position.y -= moveSphere1 * ny;
      sphere1.position.z -= moveSphere1 * nz;

      sphere2.position.x += moveSphere2 * nx;
      sphere2.position.y += moveSphere2 * ny;
      sphere2.position.z += moveSphere2 * nz;

      sphere1.illumination = 0.999;
      sphere2.illumination = 0.999;
    }
  }

  function update(dt) {
    updateFps(dt);

    analyser.getByteFrequencyData(fftDataArray);
    state.audio.beat = fftDataArray[state.audio.offset];
    // state.box.size = 10 + state.audio.beat / 64;

    // state.gravity.y = Math.sin(state.now / 1000) - 0.5;
    // state.gravity.x = -Math.sin(state.now / 10000);
    // state.gravity.y = -Math.cos(state.now / 10000);

    state.spheres.objects.forEach((sphere, i) => {
      // sphere.illumination = Math.cos((i * 1000 + state.now) / 1000) / 2 + 0.5;

      sphere.illumination = Math.max(
        0,
        sphere.illumination - 3 * dt * (1 - sphere.illumination)
      );

      sphere.updatePosition(dt, state.gravity);
    });

    for (let i = 0; i < state.spheres.objects.length; i++) {
      for (let j = i + 1; j < state.spheres.objects.length; j++) {
        handleCollisions(state.spheres.objects[i], state.spheres.objects[j]);
      }
    }

    state.spheres.objects.forEach((sphere) => {
      sphere.checkWallCollision(
        state.box.size,
        state.box.size * 2,
        state.box.y
      );
    });
  }

  function updateFps(dt) {
    const fps = 1 / dt;
    totalFPS += fps - (frameTimes[frameCursor] || 0);
    frameTimes[frameCursor++] = fps;
    numFrames = Math.max(numFrames, frameCursor);
    frameCursor %= maxFrames;
    const averageFPS = totalFPS / numFrames;
    fpsCounter.textContent = `FPS: ${averageFPS.toFixed(1)}`;
  }

  function render() {
    state.now = performance.now() - state.epoch;
    const dt = (state.now - state.lastRenderTime) / 1000;
    state.lastRenderTime = state.now;

    if (state.halt) {
      return;
    }

    update(dt);

    try {
      if (
        window.innerWidth != state.resolution.x ||
        window.innerHeight != state.resolution.y
      ) {
        state.resolution.x = window.innerWidth;
        state.resolution.y = window.innerHeight;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      gl.viewport(0, 0, state.resolution.x, state.resolution.y);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const program = programs[0];
      gl.useProgram(program);

      gl.uniform1f(gl.getUniformLocation(program, "u_time"), state.now);
      gl.uniform1f(gl.getUniformLocation(program, "u_beat"), state.audio.beat);
      gl.uniform2f(
        gl.getUniformLocation(program, "u_resolution"),
        state.resolution.x,
        state.resolution.y
      );
      gl.uniform1f(gl.getUniformLocation(program, "u_fov"), state.camera.fov);
      gl.uniform3f(
        gl.getUniformLocation(program, "u_camera"),
        state.camera.position.x,
        state.camera.position.y,
        state.camera.position.z
      );
      gl.uniform3f(
        gl.getUniformLocation(program, "u_target"),
        state.camera.target.x,
        state.camera.target.y,
        state.camera.target.z
      );
      gl.uniform3f(
        gl.getUniformLocation(program, "u_sun"),
        state.sun.x,
        state.sun.y,
        state.sun.z
      );
      gl.uniform3f(
        gl.getUniformLocation(program, "u_fog_color"),
        state.fog.color[0] / 255,
        state.fog.color[1] / 255,
        state.fog.color[2] / 255
      );
      gl.uniform1f(
        gl.getUniformLocation(program, "u_fog_intensity"),
        state.fog.intensity
      );
      gl.uniform3f(
        gl.getUniformLocation(program, "u_sky_color"),
        state.sky.color[0] / 255,
        state.sky.color[1] / 255,
        state.sky.color[2] / 255
      );
      gl.uniform3f(
        gl.getUniformLocation(program, "u_color_shift"),
        state.colorShift.colorShift[0] / 255,
        state.colorShift.colorShift[1] / 255,
        state.colorShift.colorShift[2] / 255
      );

      gl.uniform4fv(
        gl.getUniformLocation(program, "u_spheres"),
        state.spheres.objects.flatMap((sphere) => sphere.asVec4f())
      );

      gl.uniform1f(gl.getUniformLocation(program, "u_box_y"), state.box.y);
      gl.uniform1f(
        gl.getUniformLocation(program, "u_box_size"),
        state.box.size
      );

      gl.uniform3f(
        gl.getUniformLocation(program, "u_palette_a"),
        state.palette.a[0] / 255,
        state.palette.a[1] / 255,
        state.palette.a[2] / 255
      );
      gl.uniform3f(
        gl.getUniformLocation(program, "u_palette_b"),
        state.palette.b[0] / 255,
        state.palette.b[1] / 255,
        state.palette.b[2] / 255
      );
      gl.uniform3f(
        gl.getUniformLocation(program, "u_palette_c"),
        state.palette.c[0] / 255,
        state.palette.c[1] / 255,
        state.palette.c[2] / 255
      );
      gl.uniform3f(
        gl.getUniformLocation(program, "u_palette_d"),
        state.palette.d[0] / 255,
        state.palette.d[1] / 255,
        state.palette.d[2] / 255
      );
      gl.uniform1f(
        gl.getUniformLocation(program, "u_palette_offset"),
        state.palette.offset
      );
      gl.uniform1f(
        gl.getUniformLocation(program, "u_palette_range"),
        state.palette.range
      );
      gl.uniform1f(
        gl.getUniformLocation(program, "u_palette_period"),
        state.palette.period
      );

      // Draw to frame buffer texture
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.viewport(0, 0, state.resolution.x, state.resolution.y);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      state.frame += 1;
      window.requestAnimationFrame(render);
    } catch (err) {
      console.log(err);
      alert("Error: " + err.message);
    }
  }

  (function setup() {
    try {
      if (!gl) {
        alert("WebGL canvas is required");
        return;
      }

      const program = gl.createProgram();
      programs[0] = program;

      let shader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(shader, vertexShader);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Vertex shader: " + gl.getShaderInfoLog(shader));
      }
      gl.attachShader(program, shader);

      shader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(shader, fragmentShader);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Fragment shader: " + gl.getShaderInfoLog(shader));
      }
      gl.attachShader(program, shader);

      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("Link program: " + gl.getProgramInfoLog(program));
      }

      const vertices = [1, 1, 1, -1, -1, 1, -1, -1];

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
      );

      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      const generalFolder = gui.addFolder("General");
      generalFolder.add(state, "halt").listen();
      generalFolder.add(state, "now", 0, 100000, 1).listen();
      generalFolder.add(state.box, "y", -30, 100, 0.01).listen();
      generalFolder.add(state.box, "size", 0, 100, 0.01).listen();
      generalFolder.addColor(state.colorShift, "colorShift");

      const gravityFolder = gui.addFolder("Gravity");
      gravityFolder.add(state.gravity, "x", -10, 10, 0.01).listen();
      gravityFolder.add(state.gravity, "y", -10, 10, 0.01).listen();
      gravityFolder.add(state.gravity, "z", -10, 10, 0.01).listen();

      const cameraFolder = gui.addFolder("Camera");
      cameraFolder.add(state.camera, "fov", -180, 180, 0.1);
      const cameraPositionFolder = cameraFolder.addFolder("Position");
      cameraPositionFolder
        .add(state.camera.position, "x", -100, 100, 0.01)
        .listen();
      cameraPositionFolder
        .add(state.camera.position, "y", 0.5, 100, 0.01)
        .listen();
      cameraPositionFolder
        .add(state.camera.position, "z", -100, 100, 0.01)
        .listen();
      const cameraTargetFolder = cameraFolder.addFolder("Target");
      cameraTargetFolder
        .add(state.camera.target, "x", -100, 100, 0.01)
        .listen();
      cameraTargetFolder
        .add(state.camera.target, "y", -100, 100, 0.01)
        .listen();
      cameraTargetFolder
        .add(state.camera.target, "z", -100, 100, 0.01)
        .listen();

      const paletteFolder = gui.addFolder("Palette");
      paletteFolder.addColor(state.palette, "a");
      paletteFolder.addColor(state.palette, "b");
      paletteFolder.addColor(state.palette, "c");
      paletteFolder.addColor(state.palette, "d");
      paletteFolder.add(state.palette, "offset", 0.0, 1.0, 0.05);
      paletteFolder.add(state.palette, "range", 0.0, 1.0, 0.05);
      paletteFolder.add(state.palette, "period", 0.0, 100, 0.1);

      const skyFolder = gui.addFolder("Sky");
      skyFolder.addColor(state.sky, "color");

      const fogFolder = skyFolder.addFolder("Fog");
      fogFolder.add(state.fog, "intensity", 0, 0.2, 0.001);
      fogFolder.addColor(state.fog, "color");

      const sunFolder = skyFolder.addFolder("Sun");
      sunFolder.add(state.sun, "x", -100, 100, 0.01).listen();
      sunFolder.add(state.sun, "y", -100, 100, 0.01).listen();
      sunFolder.add(state.sun, "z", -100, 100, 0.01).listen();

      const beatFolder = gui.addFolder("Audio");
      beatFolder.add(state.audio, "beat", 0.0, 255, 1).listen();
      beatFolder.add(state.audio, "offset", 0, 127, 1).listen();

      window.requestAnimationFrame(render);
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  })();
};
