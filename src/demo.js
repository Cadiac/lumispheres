import * as dat from "dat.gui";

export const run = async () => {
  let state = {
    halt: false,
    epoch: performance.now(),
    frame: 0,
    now: 0,
    lastRenderTime: 0,
    resolution: {
      x: 0,
      y: 0,
    },
    camera: {
      stop: false,
      fov: 60,
      position: {
        x: 10,
        y: 10,
        z: 30,
      },
      target: {
        x: 0,
        y: 1,
        z: 0,
      },
    },
    sun: {
      x: 1,
      y: 5.5,
      z: 0.5,
    },
    fog: {
      color: [0, 84, 192],
      intensity: 0.005,
    },
    sky: {
      color: [0, 84, 192],
    },
    colorShift: {
      colorShift: [255, 235, 255],
    },
    dragon: {
      target: {
        x: 5,
        y: 0.0,
        z: 0.0,
      },
      tail: [...Array(40).keys()].flatMap((i) => [
        i / 3,
        0.0,
        0.0,
        Math.sqrt(0.5 + i / 80),
      ]),
    },
  };

  console.log(state.dragon);

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

  function update() {
    if (!state.camera.stop) {
      const speed = 5000;
      state.camera.position.x = 2 + Math.sin(state.now / speed) * 20;
      state.camera.position.y = 2 + (1 + Math.cos(state.now / speed)) * 2;
      state.camera.position.z = 2 + Math.cos(state.now / speed) * 20;
    }

    for (let index = 0; index < state.dragon.tail.length / 4; index++) {
      state.dragon.tail[index * 4 + 2] =
        2.0 * Math.sin(index / 3 + state.now / 2000) +
        4.0 * Math.cos(index / 4 + state.now / 3000);
      state.dragon.tail[index * 4 + 1] =
        2.0 * Math.cos(index / 2 + state.now / 3000) +
        4.0 * Math.sin(index / 4 + state.now / 2000);
    }
  }

  function render() {
    state.now = performance.now() - state.epoch;
    state.lastRenderTime = state.now;

    if (state.halt) {
      return;
    }

    // const dt = state.now - state.lastRenderTime;
    update();

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
        gl.getUniformLocation(program, "u_tail"),
        state.dragon.tail
      );
      gl.uniform3f(
        gl.getUniformLocation(program, "u_tail_target"),
        state.dragon.target.x,
        state.dragon.target.y,
        state.dragon.target.z
      );

      // set_uniform4_f32v

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
      generalFolder.addColor(state.colorShift, "colorShift");

      const cameraFolder = gui.addFolder("Camera");
      cameraFolder.add(state.camera, "fov", -180, 180, 0.1);
      const cameraPositionFolder = cameraFolder.addFolder("Position");
      cameraPositionFolder
        .add(state.camera.position, "x", -100, 100, 0.01)
        .listen();
      cameraPositionFolder
        .add(state.camera.position, "y", -100, 100, 0.01)
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

      const skyFolder = gui.addFolder("Sky");
      skyFolder.addColor(state.sky, "color");

      const fogFolder = skyFolder.addFolder("Fog");
      fogFolder.add(state.fog, "intensity", 0, 0.2, 0.001);
      fogFolder.addColor(state.fog, "color");

      const sunFolder = skyFolder.addFolder("Sun");
      sunFolder.add(state.sun, "x", -100, 100, 0.01).listen();
      sunFolder.add(state.sun, "y", -100, 100, 0.01).listen();
      sunFolder.add(state.sun, "z", -100, 100, 0.01).listen();

      const dragonFolder = gui.addFolder("Dragon");
      dragonFolder.add(state.dragon.target, "x", -100, 100, 0.01).listen();
      dragonFolder.add(state.dragon.target, "y", -100, 100, 0.01).listen();
      dragonFolder.add(state.dragon.target, "z", -100, 100, 0.01).listen();

      window.requestAnimationFrame(render);
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  })();
};
