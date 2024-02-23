S = 13

function CPlayer(s) {
  let r = s,
    n = s.endPattern,
    i = 0,
    t = s.rowLen * s.patternLen * (n + 1) * 2,
    e = new Int32Array(t),
    a = (r) => Math.sin(6.283184 * r),
    f = (r) => (r % 1) * 2 - 1,
    o = (r) => (r % 1 < 0.5 ? 1 : -1),
    u = (r) => {
      let n = (r % 1) * 4
      return n < 2 ? n - 1 : 3 - n
    },
    c = (r) => 0.003959503758 * 2 ** ((r - 128) / 12),
    v = (r, n, i) => {
      let t,
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
        P = 0
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
          (m[t] = (80 * f * a) | 0)
      return m
    },
    h = [a, o, f, u]
  ;(this.init = (a) => {}),
    (this.generate = () => {
      let f,
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
        U = []
      for (u = 0; u <= n; ++u)
        for (g = D.p[u], c = 0; c < m; ++c) {
          let W = g ? D.c[g - 1].f[c] : 0
          W && ((D.i[W - 1] = D.c[g - 1].f[c + m] || 0), W < 17 && (U = []))
          let b = h[D.i[16]],
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
            O = (D.i[28] * I) & -2
          for (M = (u * m + c) * I, s = 0; s < 4; ++s)
            if (((w = g ? D.c[g - 1].n[c + s * m] : 0), w)) {
              U[w] || (U[w] = v(D, w, I))
              let Q = U[w]
              for (o = 0, f = 2 * M; o < Q.length; o++, f += 2) C[f] += Q[o]
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
              (e[l + 1] += 0 | A)
        }
      return i++, i / r.numChannels
    }),
    (this.createWave = () => {
      var r = 44,
        n = r + 2 * t - 8,
        i = n - 36,
        a = new Uint8Array(r + 2 * t)
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
        (i >> 24) & 255
      ])
      for (var f = 0, o = r; f < t; ++f) {
        var u = e[f]
        ;(u = u < -32767 ? -32767 : u > 32767 ? 32767 : u),
          (a[o++] = 255 & u),
          (a[o++] = (u >> 8) & 255)
      }
      return a
    })
}

add = (a, b) => a.map((v, i) => v + b[i])
sub = (a, b) => a.map((v, i) => v - b[i])
mul = (a, b) => a.map((v, i) => v * b[i])
div = (a, s) => a.map((v) => v / s)
sum = (a) => a.reduce((v, i) => v + i)

const Sphere = (x, y, z, radius) => ({
  position: [x, y, z],
  velocity: [-0.5 + Math.random(), -0.5 + Math.random(), -0.5 + Math.random()],
  illumination: 0,
  radius,
  mass: (4 / 3) * Math.PI * Math.pow(radius, 3)
})

r = 0

const run = async () => {
  if (r) {
    return
  }

  r = 1

  // prettier-ignore
  m = new CPlayer({songData:[{i:[0,28,128,0,0,28,128,12,0,0,12,0,72,0,0,0,0,0,0,0,2,255,0,0,32,83,3,130,4],p:[3,3,3,3,1,2,1,2,1,2,1,2,1,2,1,2,1,2],c:[{n:[131,,143,,,,143,,,,,,,143,131,,130,,142,,,,142,,,,,,,142,130,,138,138,,150,,138,,150,,,,,150,,,,137,137,,137,,137,,137,,,,,149,,,,142,,142,,154,,142,,154,,,154,,,,,140,,140,,152,,140,,152,,,152,,,,,145,,,145,,,,145,,157,157,,,,,,147,,,147,,,,147,,159,159],f:[]},{n:[135,,147,,,,147,,,,,,,147,135,,133,,145,,,,145,,137,,137,,,,,,137,137,,149,,137,,149,,,,,149,,,,138,138,,150,,138,,150,140,140,,140,,140,,140,140,,140,,152,,140,,152,,,152,,,,,140,,140,,152,,140,,147,,147,,147,,147,,,,,,,,,,,144,142,,,,,,142,,,,,154,,,133,,,145,,133],f:[]},{n:[131,,,,,,,,,,,,,,,,130,,142,,,,142,,,,,,,142,130],f:[]}]},{i:[0,91,128,0,0,95,128,12,0,0,12,0,72,0,0,0,0,0,0,0,2,255,0,0,32,83,3,130,4],p:[,,,,1,2,1,2,1,2,1,2,1,2,1,2,1,2],c:[{n:[116,,,,,,,,,,,,,,,,118],f:[]},{n:[121,,,,,,,,,,,,,,,,114,,,,,,,,121,,,,,,,,,,,,,,,,,,,,,,,,131],f:[]}]},{i:[0,255,116,79,0,255,116,0,83,0,4,6,69,52,0,0,0,0,0,0,2,14,0,0,32,0,0,0,0],p:[,1,,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2],c:[{n:[135,,,,,,,,135,,135],f:[]},{n:[,,,,,,,,135,,,,135,,,,135,,135,,135,,,,135,,,,135],f:[]}]},{i:[0,0,140,0,0,0,140,0,0,81,4,10,47,55,0,0,0,187,5,0,1,239,135,0,32,108,5,16,4],p:[,,,,,,1,2,1,2,1,2,1,2,1,2,1,2],c:[{n:[135,135,135,135,135,135,135,135,,,,,,,135,,,,135,,,,,,135,,,,,,135],f:[]},{n:[135,,,,135,,,,135,,,,135,,,,135,,,,135,,,,135,,,,135],f:[]}]},{i:[0,0,128,0,0,0,128,0,0,125,0,1,59,0,0,0,0,0,0,0,1,193,171,0,29,39,3,88,3],p:[,,,,,,1,,1,,1,,1,,1,,1],c:[{n:[135],f:[]}]},{i:[0,127,104,64,0,130,104,0,64,229,4,40,43,51,0,0,0,231,6,1,3,183,15,0,32,128,4,0,0],p:[,,,,,,,,1,,1,,1,,1,,1],c:[{n:[,,,,135],f:[]}]},{i:[3,255,128,0,0,255,140,0,0,127,2,2,47,61,0,0,0,96,3,1,3,94,79,0,95,84,2,12,4],p:[,,,,,,,,1,,1,,1,,1,,1],c:[{n:[,,,,,,135],f:[]}]},{i:[0,0,140,0,0,0,140,0,0,255,158,158,158,0,0,0,0,51,2,1,2,58,239,0,32,88,1,157,2],p:[1,,1],c:[{n:[111],f:[]}]}],rowLen:6615,patternLen:32,endPattern:17,numChannels:8})
  a = new AudioContext()

  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape') {
        state.halt = !state.halt
        a.close()
      }
    },
    true
  )

  const vertexShader = `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`
  const fragmentShader = await fetch('4k/fragment.glsl').then((res) =>
    res.text()
  )

  function init() {
    if (m.generate() >= 1) {
      d = document.createElement('audio')
      c = document.createElement('canvas')
      document.body.appendChild(c)

      c.style.position = 'fixed'
      c.style.left = c.style.top = 0

      g = c.getContext('webgl')
      p = g.createProgram()

      d.src = URL.createObjectURL(
        new Blob([m.createWave()], { type: 'audio/wav' })
      )
      d.onplay = () => a.resume()

      n = a.createAnalyser()
      a.createMediaElementSource(d).connect(n)
      n.connect(a.destination)
      n.fftSize = 256
      f = new Uint8Array(n.frequencyBinCount)

      d.play()

      try {
        s = g.createShader(0x8b31) // g.VERTEX_SHADER
        g.shaderSource(s, vertexShader)
        g.compileShader(s)
        if (!g.getShaderParameter(s, g.COMPILE_STATUS)) {
          alert('Vertex shader: ' + g.getShaderInfoLog(s))
        }
        g.attachShader(p, s)

        s = g.createShader(0x8b30) // g.FRAGMENT_SHADER
        g.shaderSource(s, fragmentShader)
        g.compileShader(s)
        if (!g.getShaderParameter(s, g.COMPILE_STATUS)) {
          alert('Fragment shader: ' + g.getShaderInfoLog(s))
        }
        g.attachShader(p, s)

        g.linkProgram(p)
        if (!g.getProgramParameter(p, g.LINK_STATUS)) {
          alert('Link program: ' + g.getProgramInfoLog(p))
        }

        g.bindBuffer(0x8892, g.createBuffer()) // g.ARRAY_BUFFER
        g.bufferData(
          0x8892, // g.ARRAY_BUFFER
          new Float32Array([1, 1, 1, -1, -1, 1, -1, -1]),
          0x88e4 // g.STATIC_DRAW
        )

        g.enableVertexAttribArray(0)
        g.vertexAttribPointer(0, 2, 0x1406, false, 0, 0) // g.FLOAT

        state = {
          halt: false,
          epoch: performance.now(),
          now: 0,
          dt: 0,
          lastRenderTime: 0,
          resolution: {
            x: 0,
            y: 0
          },
          gravity: [0, 0, 0],
          camera: {
            fov: 60,
            position: {
              x: 0,
              y: 20,
              z: 60
            },
            target: {
              x: 0,
              y: 20,
              z: 0
            }
          },
          sun: {
            x: -1.23,
            y: 2,
            z: -100
          },
          fog: {
            color: [230, 97, 205],
            intensity: 0.005
          },
          sky: {
            color: [61, 245, 245]
          },
          colorShift: {
            colorShift: [255, 235, 255]
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
            period: 10
          },
          spheres: {
            objects: [...Array(S)].map((_, i) =>
              Sphere(
                -5 + 5 * Math.random(),
                15 + 5 * Math.random(),
                -5 + 5 * Math.random(),
                (i % 3) + 1
              )
            )
          },
          box: {
            y: 10,
            size: 10
          },
          audio: {
            offset: 90, // Hihat
            // offset: 6, // bass
            // offset: 22, // generic
            beat: 0
          }
        }

        setupDebugUI()

        window.requestAnimationFrame(render)
      } catch (err) {
        console.error(err)
        alert('Error: ' + err.message)
      }
    } else {
      setTimeout(init, 50)
    }
  }

  function collisions(sphere1, sphere2) {
    ;[dx, dy, dz] = dxyz = sub(sphere2.position, sphere1.position)
    d = Math.sqrt(dx * dx + dy * dy + dz * dz)
    o = sphere1.radius + sphere2.radius - d

    if (o > 0) {
      ;[nx, ny, nz] = nxyz = div(dxyz, d)

      v1i = sum(mul(sphere1.velocity, nxyz))
      v2i = sum(mul(sphere2.velocity, nxyz))

      dv1 =
        (v1i * (sphere1.mass - sphere2.mass) + 2 * sphere2.mass * v2i) /
          (sphere1.mass + sphere2.mass) -
        v1i
      dv2 =
        (v2i * (sphere2.mass - sphere1.mass) + 2 * sphere1.mass * v1i) /
          (sphere1.mass + sphere2.mass) -
        v2i

      sphere1.velocity = add(sphere1.velocity, mul([dv1, dv1, dv1], nxyz))
      sphere2.velocity = add(sphere2.velocity, mul([dv2, dv2, dv2], nxyz))

      tm = sphere1.mass + sphere2.mass
      m1 = (o * sphere2.mass) / tm
      m2 = (o * sphere1.mass) / tm

      sphere1.position = sub(sphere1.position, mul([m1, m1, m1], nxyz))
      sphere2.position = add(sphere2.position, mul([m2, m2, m2], nxyz))

      sphere1.illumination = sphere2.illumination = 0.999
    }
  }

  function update(dt) {
    // Slowing and speeding up the time based on beat
    n.getByteFrequencyData(f)
    dt = 0.5 * dt + (dt * f[state.audio.offset]) / 32

    // Gravity & fading the illuminated spheres over time
    state.spheres.objects.map((sphere) => {
      sphere.illumination = Math.max(
        0,
        sphere.illumination - 6 * dt * (1 - sphere.illumination)
      )
      sphere.velocity = add(sphere.velocity, mul(state.gravity, [dt, dt, dt]))
      sphere.position = add(sphere.position, mul(sphere.velocity, [dt, dt, dt]))
    })

    // Spheres colliding with each other
    for (i = 0; i < S; i++)
      for (j = i + 1; j < S; j++)
        collisions(state.spheres.objects[i], state.spheres.objects[j])

    // Collisions with walls
    state.spheres.objects.forEach((sphere) => {
      for (i = 0; i < 3; i++) {
        let min = i == 1 ? state.box.y : -state.box.size,
          max = i == 1 ? state.box.size * 2 + state.box.y : state.box.size
        if (sphere.position[i] - sphere.radius < min) {
          sphere.velocity[i] = -sphere.velocity[i] * 0.8
          sphere.position[i] = min + sphere.radius
          sphere.illumination = 0.99
        }
        if (sphere.position[i] + sphere.radius > max) {
          sphere.velocity[i] = -sphere.velocity[i] * 0.8
          sphere.position[i] = max - sphere.radius
          sphere.illumination = 0.99
        }
      }
    })
  }

  u = (loc, ...v) => {
    i = v.length
    l = g.getUniformLocation(p, loc)
    i == 2
      ? g.uniform2f(l, ...v)
      : i == 3
      ? g.uniform3f(l, ...v)
      : !!v[0].length
      ? g.uniform4fv(l, v[0])
      : g.uniform1f(l, v[0])
  }

  function render() {
    state.now = performance.now() - state.epoch
    const dt = (state.now - state.lastRenderTime) / 1000
    state.lastRenderTime = state.now

    if (state.halt) {
      return
    }

    update(dt)

    try {
      if (
        window.innerWidth != state.resolution.x ||
        window.innerHeight != state.resolution.y
      ) {
        state.resolution.x = window.innerWidth
        state.resolution.y = window.innerHeight
        c.width = window.innerWidth
        c.height = window.innerHeight
      }

      g.viewport(0, 0, state.resolution.x, state.resolution.y)
      g.clearColor(0, 0, 0, 1)
      g.clear(0x4000)

      g.useProgram(p)

      u('u_time', state.now)
      u('u_beat', f[state.audio.offset])
      u('u_resolution', state.resolution.x, state.resolution.y)
      u('u_fov', state.camera.fov)
      u(
        'u_camera',
        state.camera.position.x,
        state.camera.position.y,
        state.camera.position.z
      )
      u(
        'u_target',
        state.camera.target.x,
        state.camera.target.y,
        state.camera.target.z
      )
      u('u_sun', state.sun.x, state.sun.y, state.sun.z)
      u('u_fog_color', ...div(state.fog.color, 255))
      u('u_fog_intensity', state.fog.intensity)
      u('u_sky_color', ...div(state.sky.color, 255))
      u('u_color_shift', ...div(state.colorShift.colorShift, 255))

      u(
        'u_spheres',
        state.spheres.objects.flatMap((s) => [
          ...s.position,
          // w component of vec4 carries radius in its integer part,
          // illumination in the fraction part
          s.radius + s.illumination
        ])
      )

      u('u_box_y', state.box.y)
      u('u_box_size', state.box.size)

      u('u_palette_a', ...div(state.palette.a, 255))
      u('u_palette_b', ...div(state.palette.b, 255))
      u('u_palette_c', ...div(state.palette.c, 255))
      u('u_palette_d', ...div(state.palette.d, 255))
      u('u_palette_offset', state.palette.offset)
      u('u_palette_range', state.palette.range)
      u('u_palette_period', state.palette.period)

      g.drawArrays(5, 0, 4)

      window.requestAnimationFrame(render)
    } catch (err) {
      console.log(err)
      alert('Error: ' + err.message)
    }
  }

  init()
}

const setupDebugUI = () => {
  gui = new dat.GUI()

  const generalFolder = gui.addFolder('General')
  generalFolder.add(state, 'halt').listen()
  generalFolder.add(state, 'now', 0, 100000, 1).listen()
  generalFolder.add(state.box, 'y', -30, 100, 0.01).listen()
  generalFolder.add(state.box, 'size', 0, 100, 0.01).listen()
  generalFolder.addColor(state.colorShift, 'colorShift')

  const gravityFolder = gui.addFolder('Gravity')
  gravityFolder.add(state.gravity, '0', -10, 10, 0.01).listen()
  gravityFolder.add(state.gravity, '1', -10, 10, 0.01).listen()
  gravityFolder.add(state.gravity, '2', -10, 10, 0.01).listen()

  const cameraFolder = gui.addFolder('Camera')
  cameraFolder.add(state.camera, 'fov', -180, 180, 0.1)
  const cameraPositionFolder = cameraFolder.addFolder('Position')
  cameraPositionFolder.add(state.camera.position, 'x', -100, 100, 0.01).listen()
  cameraPositionFolder.add(state.camera.position, 'y', 0.5, 100, 0.01).listen()
  cameraPositionFolder.add(state.camera.position, 'z', -100, 100, 0.01).listen()
  const cameraTargetFolder = cameraFolder.addFolder('Target')
  cameraTargetFolder.add(state.camera.target, 'x', -100, 100, 0.01).listen()
  cameraTargetFolder.add(state.camera.target, 'y', -100, 100, 0.01).listen()
  cameraTargetFolder.add(state.camera.target, 'z', -100, 100, 0.01).listen()

  const paletteFolder = gui.addFolder('Palette')
  paletteFolder.addColor(state.palette, 'a')
  paletteFolder.addColor(state.palette, 'b')
  paletteFolder.addColor(state.palette, 'c')
  paletteFolder.addColor(state.palette, 'd')
  paletteFolder.add(state.palette, 'offset', 0.0, 1.0, 0.05)
  paletteFolder.add(state.palette, 'range', 0.0, 1.0, 0.05)
  paletteFolder.add(state.palette, 'period', 0.0, 100, 0.1)

  const skyFolder = gui.addFolder('Sky')
  skyFolder.addColor(state.sky, 'color')

  const fogFolder = skyFolder.addFolder('Fog')
  fogFolder.add(state.fog, 'intensity', 0, 0.2, 0.001)
  fogFolder.addColor(state.fog, 'color')

  const sunFolder = skyFolder.addFolder('Sun')
  sunFolder.add(state.sun, 'x', -100, 100, 0.01).listen()
  sunFolder.add(state.sun, 'y', -100, 100, 0.01).listen()
  sunFolder.add(state.sun, 'z', -100, 100, 0.01).listen()

  const beatFolder = gui.addFolder('Audio')
  beatFolder.add(state.audio, 'offset', 0, 127, 1).listen()
}
