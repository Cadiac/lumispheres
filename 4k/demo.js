// prettier-ignore
song = {songData:[{i:[0,28,128,0,0,28,128,12,0,0,12,0,72,0,0,0,0,0,0,0,2,255,0,0,32,83,3,130,4],p:[3,3,3,3,1,2,1,2,1,2,1,2,1,2,1,2,1,2],c:[{n:[131,,143,,,,143,,,,,,,143,131,,130,,142,,,,142,,,,,,,142,130,,138,138,,150,,138,,150,,,,,150,,,,137,137,,137,,137,,137,,,,,149,,,,142,,142,,154,,142,,154,,,154,,,,,140,,140,,152,,140,,152,,,152,,,,,145,,,145,,,,145,,157,157,,,,,,147,,,147,,,,147,,159,159],f:[]},{n:[135,,147,,,,147,,,,,,,147,135,,133,,145,,,,145,,137,,137,,,,,,137,137,,149,,137,,149,,,,,149,,,,138,138,,150,,138,,150,140,140,,140,,140,,140,140,,140,,152,,140,,152,,,152,,,,,140,,140,,152,,140,,147,,147,,147,,147,,,,,,,,,,,144,142,,,,,,142,,,,,154,,,133,,,145,,133],f:[]},{n:[131,,,,,,,,,,,,,,,,130,,142,,,,142,,,,,,,142,130],f:[]}]},{i:[0,91,128,0,0,95,128,12,0,0,12,0,72,0,0,0,0,0,0,0,2,255,0,0,32,83,3,130,4],p:[,,,,1,2,1,2,1,2,1,2,1,2,1,2,1,2],c:[{n:[116,,,,,,,,,,,,,,,,118],f:[]},{n:[121,,,,,,,,,,,,,,,,114,,,,,,,,121,,,,,,,,,,,,,,,,,,,,,,,,131],f:[]}]},{i:[0,255,116,79,0,255,116,0,83,0,4,6,69,52,0,0,0,0,0,0,2,14,0,0,32,0,0,0,0],p:[,1,,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2],c:[{n:[135,,,,,,,,135,,135],f:[]},{n:[,,,,,,,,135,,,,135,,,,135,,135,,135,,,,135,,,,135],f:[]}]},{i:[0,0,140,0,0,0,140,0,0,81,4,10,47,55,0,0,0,187,5,0,1,239,135,0,32,108,5,16,4],p:[,,,,,,1,2,1,2,1,2,1,2,1,2,1,2],c:[{n:[135,135,135,135,135,135,135,135,,,,,,,135,,,,135,,,,,,135,,,,,,135],f:[]},{n:[135,,,,135,,,,135,,,,135,,,,135,,,,135,,,,135,,,,135],f:[]}]},{i:[0,0,128,0,0,0,128,0,0,125,0,1,59,0,0,0,0,0,0,0,1,193,171,0,29,39,3,88,3],p:[,,,,,,1,,1,,1,,1,,1,,1],c:[{n:[135],f:[]}]},{i:[0,127,104,64,0,130,104,0,64,229,4,40,43,51,0,0,0,231,6,1,3,183,15,0,32,128,4,0,0],p:[,,,,,,,,1,,1,,1,,1,,1],c:[{n:[,,,,135],f:[]}]},{i:[3,255,128,0,0,255,140,0,0,127,2,2,47,61,0,0,0,96,3,1,3,94,79,0,95,84,2,12,4],p:[,,,,,,,,1,,1,,1,,1,,1],c:[{n:[,,,,,,135],f:[]}]},{i:[0,0,140,0,0,0,140,0,0,255,158,158,158,0,0,0,0,51,2,1,2,58,239,0,32,88,1,157,2],p:[1,,1],c:[{n:[111],f:[]}]}],rowLen:6615,patternLen:32,endPattern:17,numChannels:8};
function CPlayer() {
  var r,
    n,
    i,
    t,
    e,
    a = function (r) {
      return Math.sin(6.283184 * r);
    },
    f = function (r) {
      return (r % 1) * 2 - 1;
    },
    o = function (r) {
      return r % 1 < 0.5 ? 1 : -1;
    },
    u = function (r) {
      var n = (r % 1) * 4;
      return n < 2 ? n - 1 : 3 - n;
    },
    c = function (r) {
      return 0.003959503758 * 2 ** ((r - 128) / 12);
    },
    v = function (r, n, i) {
      var t,
        e,
        a,
        f,
        o,
        u,
        v = h[r.i[0]],
        s = r.i[1],
        w = r.i[3] / 32,
        g = h[r.i[4]],
        l = r.i[5],
        y = r.i[8] / 32,
        A = r.i[9],
        M = r.i[10] * r.i[10] * 4,
        p = r.i[11] * r.i[11] * 4,
        L = r.i[12] * r.i[12] * 4,
        d = 1 / L,
        C = -r.i[13] / 16,
        D = r.i[14],
        I = i * 2 ** (2 - r.i[15]),
        m = new Int32Array(M + p + L),
        B = 0,
        P = 0;
      for (t = 0, e = 0; t < M + p + L; t++, e++)
        e >= 0 &&
          ((D = (D >> 8) | ((255 & D) << 4)),
          (e -= I),
          (o = c(n + (15 & D) + r.i[2] - 128)),
          (u = c(n + (15 & D) + r.i[6] - 128) * (1 + 8e-4 * r.i[7]))),
          (a = 1),
          t < M
            ? (a = t / M)
            : t >= M + p &&
              ((a = (t - M - p) * d), (a = (1 - a) * 3 ** (C * a))),
          (B += o * a ** w),
          (f = v(B) * s),
          (P += u * a ** y),
          (f += g(P) * l),
          A && (f += (2 * Math.random() - 1) * A),
          (m[t] = (80 * f * a) | 0);
      return m;
    },
    h = [a, o, f, u];
  (this.init = function (a) {
    (r = a),
      (n = a.endPattern),
      (i = 0),
      (t = a.rowLen * a.patternLen * (n + 1) * 2),
      (e = new Int32Array(t));
  }),
    (this.generate = function () {
      var f,
        o,
        u,
        c,
        s,
        w,
        g,
        l,
        y,
        A,
        M,
        p,
        L,
        d,
        C = new Int32Array(t),
        D = r.songData[i],
        I = r.rowLen,
        m = r.patternLen,
        B = 0,
        P = 0,
        x = !1,
        U = [];
      for (u = 0; u <= n; ++u)
        for (g = D.p[u], c = 0; c < m; ++c) {
          var W = g ? D.c[g - 1].f[c] : 0;
          W && ((D.i[W - 1] = D.c[g - 1].f[c + m] || 0), W < 17 && (U = []));
          var b = h[D.i[16]],
            j = D.i[17] / 512,
            k = 2 ** (D.i[18] - 9) / I,
            q = D.i[19],
            z = D.i[20],
            E = (43.23529 * D.i[21] * 3.141592) / 44100,
            F = 1 - D.i[22] / 255,
            G = 1e-5 * D.i[23],
            H = D.i[24] / 32,
            J = D.i[25] / 512,
            K = (6.283184 * 2 ** (D.i[26] - 9)) / I,
            N = D.i[27] / 255,
            O = (D.i[28] * I) & -2;
          for (M = (u * m + c) * I, s = 0; s < 4; ++s)
            if (((w = g ? D.c[g - 1].n[c + s * m] : 0), w)) {
              U[w] || (U[w] = v(D, w, I));
              var Q = U[w];
              for (o = 0, f = 2 * M; o < Q.length; o++, f += 2) C[f] += Q[o];
            }
          for (o = 0; o < I; o++)
            (l = 2 * (M + o)),
              (A = C[l]),
              A || x
                ? ((p = E),
                  q && (p *= b(k * l) * j + 0.5),
                  (p = 1.5 * Math.sin(p)),
                  (B += p * P),
                  (L = F * (A - P) - B),
                  (P += p * L),
                  (A = 3 == z ? P : 1 == z ? L : B),
                  G &&
                    ((A *= G),
                    (A = A < 1 ? (A > -1 ? a(0.25 * A) : -1) : 1),
                    (A /= G)),
                  (A *= H),
                  (x = A * A > 1e-5),
                  (y = Math.sin(K * l) * J + 0.5),
                  (d = A * (1 - y)),
                  (A *= y))
                : (d = 0),
              l >= O && ((d += C[l - O + 1] * N), (A += C[l - O] * N)),
              (C[l] = 0 | d),
              (C[l + 1] = 0 | A),
              (e[l] += 0 | d),
              (e[l + 1] += 0 | A);
        }
      return i++, i / r.numChannels;
    }),
    (this.createAudioBuffer = function (r) {
      for (var n = r.createBuffer(2, t / 2, 44100), i = 0; i < 2; i++)
        for (var a = n.getChannelData(i), f = i; f < t; f += 2)
          a[f >> 1] = e[f] / 65536;
      return n;
    }),
    (this.createWave = function () {
      var r = 44,
        n = r + 2 * t - 8,
        i = n - 36,
        a = new Uint8Array(r + 2 * t);
      a.set([
        82,
        73,
        70,
        70,
        255 & n,
        (n >> 8) & 255,
        (n >> 16) & 255,
        (n >> 24) & 255,
        87,
        65,
        86,
        69,
        102,
        109,
        116,
        32,
        16,
        0,
        0,
        0,
        1,
        0,
        2,
        0,
        68,
        172,
        0,
        0,
        16,
        177,
        2,
        0,
        4,
        0,
        16,
        0,
        100,
        97,
        116,
        97,
        255 & i,
        (i >> 8) & 255,
        (i >> 16) & 255,
        (i >> 24) & 255,
      ]);
      for (var f = 0, o = r; f < t; ++f) {
        var u = e[f];
        (u = u < -32767 ? -32767 : u > 32767 ? 32767 : u),
          (a[o++] = 255 & u),
          (a[o++] = (u >> 8) & 255);
      }
      return a;
    }),
    (this.getData = function (r, n) {
      for (
        var i = 2 * Math.floor(44100 * r), t = new Array(n), a = 0;
        a < 2 * n;
        a += 1
      ) {
        var f = i + a;
        t[a] = r > 0 && f < e.length ? e[f] / 32768 : 0;
      }
      return t;
    });
}

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

running = false;

const run = async (audioCtx, analyser) => {
  if (running) {
    return;
  }

  running = true;

  player = new CPlayer();
  audioCtx = new AudioContext();
  player.init(song);

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") {
        state.halt = !state.halt;
        audioCtx.close();
      }
    },
    true
  );

  const vertexShader = `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`;
  const fragmentShader = await fetch("4k/fragment.glsl").then((res) =>
    res.text()
  );


  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.style.position = "fixed";
  canvas.style.left = canvas.style.top = 0;

  const gl = canvas.getContext("webgl");

  function init() {
    if (player.generate() >= 1) {
      const wave = player.createWave();
      const audio = document.createElement("audio");
      audio.src = URL.createObjectURL(new Blob([wave], { type: "audio/wav" }));
      audio.onplay = () => audioCtx.resume();

      analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaElementSource(audio);

      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.fftSize = 256;
      fftDataArray = new Uint8Array(analyser.frequencyBinCount);

      audio.play();

      try {
        if (!gl) {
          alert("WebGL canvas is required");
          return;
        }

        program = gl.createProgram();

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

        state = {
          halt: false,
          epoch: performance.now(),
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
            color: [230, 97, 205],
            intensity: 0.005,
          },
          sky: {
            color: [61, 245, 245],
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
            offset: 90, // Hihat
            // offset: 6, // bass
            // offset: 22, // generic
            beat: 0,
          },
        };

        setupDebugUI();

        window.requestAnimationFrame(render);
      } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
      }
    } else {
      setTimeout(init, 50);
    }
  }

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
    analyser.getByteFrequencyData(fftDataArray);
    state.audio.beat = fftDataArray[state.audio.offset];

    dt = 0.5 * dt + dt * state.audio.beat / 32;

    state.spheres.objects.forEach((sphere, i) => {
      sphere.illumination = Math.max(
        0,
        sphere.illumination - 6 * dt * (1 - sphere.illumination)
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

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.viewport(0, 0, state.resolution.x, state.resolution.y);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      window.requestAnimationFrame(render);
    } catch (err) {
      console.log(err);
      alert("Error: " + err.message);
    }
  }

  init();
};

const setupDebugUI = () => {
  gui = new dat.GUI();

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
  cameraPositionFolder.add(state.camera.position, "y", 0.5, 100, 0.01).listen();
  cameraPositionFolder
    .add(state.camera.position, "z", -100, 100, 0.01)
    .listen();
  const cameraTargetFolder = cameraFolder.addFolder("Target");
  cameraTargetFolder.add(state.camera.target, "x", -100, 100, 0.01).listen();
  cameraTargetFolder.add(state.camera.target, "y", -100, 100, 0.01).listen();
  cameraTargetFolder.add(state.camera.target, "z", -100, 100, 0.01).listen();

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
};
