S = Math.sin
C = Math.cos

function M(s) {
  let r = s,
    n = s.e,
    i = 0,
    t = s.r * s.p * (n + 1) * 2,
    e = new Int32Array(t),
    a = (r) => S(6.283184 * r),
    f = (r) => (r % 1) * 2 - 1,
    o = (r) => (r % 1 < 0.5 ? 1 : -1),
    u = (r) => {
      let n = (r % 1) * 4
      return n < 2 ? n - 1 : 3 - n
    },
    c = (r) => 0.00396 * 2 ** ((r - 128) / 12),
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
  ;(this.g = () => {
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
      D = r.s[i],
      I = r.r,
      m = r.p,
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
                (p = 1.5 * S(p)),
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
                (y = S(K * l) * J + 0.5),
                (d = A * (1 - y)),
                (A *= y))
              : (d = 0),
            l >= O && ((d += C[l - O + 1] * N), (A += C[l - O] * N)),
            (C[l] = 0 | d),
            (C[l + 1] = 0 | A),
            (e[l] += 0 | d),
            (e[l + 1] += 0 | A)
      }
    return i++, i / r.n
  }),
    (this.c = () => {
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

// Sphere initializer
B = (r) => ({
  p: [0, 10, 0],
  v: div([r, r, r], 3),
  i: 0,
  r,
  m: 4 * r ** 3
})

// Collisions handler
e = (sphere1, sphere2) => {
  x = sub(sphere2.p, sphere1.p)
  y = Math.hypot(...x)
  w = sphere1.r + sphere2.r - y

  if (w > 0) {
    z = div(x, y)

    x = sum(mul(sphere1.v, z))
    y = sum(mul(sphere2.v, z))

    v =
      (x * (sphere1.m - sphere2.m) + 2 * sphere2.m * y) /
        (sphere1.m + sphere2.m) -
      x
    sphere1.v = add(sphere1.v, mul([v, v, v], z))

    v =
      (y * (sphere2.m - sphere1.m) + 2 * sphere1.m * x) /
        (sphere1.m + sphere2.m) -
      y
    sphere2.v = add(sphere2.v, mul([v, v, v], z))

    v = sphere1.m + sphere2.m
    x = (w * sphere2.m) / v
    y = (w * sphere1.m) / v

    sphere1.p = sub(sphere1.p, mul([x, x, x], z))
    sphere2.p = add(sphere2.p, mul([y, y, y], z))

    sphere1.i = sphere2.i = 0.999
  }
}

onclick = () => {
  // longer: https://sb.bitsnbites.eu/?data=U0JveA4C7d09axRBGADgd_cuQST4UQoK1ylYpIggKEIawS5ILAKCsUwhCBIEC8lxR1gSjosSIiIk-QH-AAsrf4W_QCzzE879unycHBamSC7PM_MOM7Ozu7PDdW9xP29EXI_WpbjZjjxmImbiSVTSQURrsdFpNnJJerx0YytfsFWt2-pGJ_p5p1-N-53Y3IxPUUSuaDY2oiq5nXJlP76UUdSIXl4-l1HUiI9lzWN3t3zkdlnz2N-P05DVj6sensV6_bp6i8V-d2Kj3GrZDL-n1yu32hvd73C8XZdDH6ozKdv8S9eLl6z___67I-PR8z_rhuc8zvCcx13_65xHnNY5AwAAAAAAF8jzdsTymHRZMTiZLlsdufvtOfvadyPjN2Pmh7p-IAAAAAAAAJNtsLqQRyxGc_rxvWoqvRLRKntJpCfTZVl9VxbZuf7q7DCyY30AAAAAAAAunl4VT5uXZ-_n3e9TkRxk0Xo1da1ZLTiRLqtVV46STMfbsyz7RwAAAAAAAHDRtKt4H8nDeib58TVu3W4sNerhsSKlBAAAAAAAwERZW5mPzkrM_2reuTuXj39PJ41vV6PVbh6tOUqXFaTMAAAAAAAAmBSNQTti0ItYS9PZR_nEy0bSeLEQy8_SmcOE2cl0mYQZAAAAAAAAk6P-77LB3t5eMZxLk_TBQbSWkt30KEE29Np5AQAAAAAAMEH-AA
  // shorter: https://sb.bitsnbites.eu/?data=U0JveA4C7d3NahNRFADgMzOpiBR1Kyhkp-CiiwqCInQjuCtSFwXBuuxCEKQILqQhoQwtoVVKRYS2D-ADuHDlU_gE4rKPEOcvaYkEF3bRpt9351zuufOTO5fsDiE_b0TMRvty3OxEEbNl9iRq6SCivZR1W1khSesWvdgpzu3Ul-z0ohvbxWC7zre7sbUVn6KMQtltbkbdCnvVldvxpYryiOgX7XMV5RHxsTqK2N-vHrlbHUUcHsZpyJvH1Q_PY6P5uGaJ5Xr3YrNaatUN36ffr5baH1_vMN9t2siHek-qvnjTjfJDNv5__b2xfHz_z7rhPk8y3OdJ5__a5zGntc8AAAAAAMAF8rwTsTKhUlYmo0rZ2tiNb8_Zi74by99MmB_q-W4AAAAAAABMt8HaYhGxFK1Lj-_VU-nViHY1SiIdVcry5oZ8NDqf8lHkJ8YAAAAAAABcPP06nrauzN0vht9nIjnKo_1q5nqrLJUNf1UWeaO-67i-dLI_y_J_BAAAAAAAABdNp473kTxsZpIfX-PW7Ww5KwtlSdNUkwAAAAAAAJgu66sL0V2NhV-tO3fni_z3pST7di3andbxNVWlrKRaBgAAAAAAwLTIBp2IQT9iPU3nHhUTL7Mke7EYK8_S2VGtbFQpUysDAAAAAABgejT_UzY4ODgo0_k0SR8cRXs52U9PVMgieW2rAAAAAAAAmCJ_AA
  // prettier-ignore
  m = new M({s:[{i:[0,28,128,0,0,28,128,12,0,0,12,0,72,0,0,0,0,0,0,0,2,255,0,0,32,83,3,130,4],p:[3,3,3,3,1,2,1,2,1,2,1,2],c:[{n:[131,,143,,,,143,,,,,,,143,131,,130,,142,,,,142,,,,,,,142,130,,138,138,,150,,138,,150,,,,,150,,,,137,137,,137,,137,,137,,,,,149,,,,142,,142,,154,,142,,154,,,154,,,,,140,,140,,152,,140,,152,,,152,,,,,145,,,145,,,,145,,157,157,,,,,,147,,,147,,,,147,,159,159],f:[]},{n:[135,,147,,,,147,,,,,,,147,135,,133,,145,,,,145,,137,,137,,,,,,137,137,,149,,137,,149,,,,,149,,,,138,138,,150,,138,,150,140,140,,140,,140,,140,140,,140,,152,,140,,152,,,152,,,,,140,,140,,152,,140,,147,,147,,147,,147,,,,,,,,,,,144,142,,,,,,142,,,,,154,,,133,,,145,,133],f:[]},{n:[131,,,,,,,,,,,,,,,,130,,142,,,,142,,,,,,,142,130],f:[]}]},{i:[0,91,128,0,0,95,128,12,0,0,12,0,72,0,0,0,0,0,0,0,2,255,0,0,32,83,3,130,4],p:[,,,,1,2,1,2,1,2,1,2],c:[{n:[116,,,,,,,,,,,,,,,,118],f:[]},{n:[121,,,,,,,,,,,,,,,,114,,,,,,,,121,,,,,,,,,,,,,,,,,,,,,,,,131],f:[]}]},{i:[0,255,116,79,0,255,116,0,83,0,4,6,69,52,0,0,0,0,0,0,2,14,0,0,32,0,0,0,0],p:[,1,,2,1,2,1,2,1,2,1,2],c:[{n:[135,,,,,,,,135,,135],f:[]},{n:[,,,,,,,,135,,,,135,,,,135,,135,,135,,,,135,,,,135],f:[]}]},{i:[0,0,140,0,0,0,140,0,0,81,4,10,47,55,0,0,0,187,5,0,1,239,135,0,32,108,5,16,4],p:[,,1,,,,1,2,1,2,1,2],c:[{n:[135,135,135,135,135,135,135,135,,,,,,,135,,,,135,,,,,,135,,,,,,135],f:[]},{n:[135,,,,135,,,,135,,,,135,,,,135,,,,135,,,,135,,,,135],f:[]}]},{i:[0,0,128,0,0,0,128,0,0,125,0,1,59,0,0,0,0,0,0,0,1,193,171,0,29,39,3,88,3],p:[,1,,,1,,1,,1,,1],c:[{n:[135],f:[]}]},{i:[0,127,104,64,0,130,104,0,64,229,4,40,43,51,0,0,0,231,6,1,3,183,15,0,32,128,4,0,0],p:[,,,,,,,,1,,1],c:[{n:[,,,,135],f:[]}]},{i:[3,255,128,0,0,255,140,0,0,127,2,2,47,61,0,0,0,96,3,1,3,94,79,0,95,84,2,12,4],p:[,,,,,,,,1,,1],c:[{n:[,,,,,,135],f:[]}]},{i:[0,0,140,0,0,0,140,0,0,255,158,158,158,0,0,0,0,51,2,1,2,58,239,0,32,88,1,157,2],p:[1,,1,,,,,,,,,,1],c:[{n:[111],f:[]}]}],r:6615,p:32,e:12,n:8})
  a = new AudioContext()

  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape') {
        s.h = 1
        a.close()
      }
    },
    true
  )

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

  D = [
    [
      [0, 50, -250],
      [() => 0, (i) => 0.01, (i) => 0.05 * i]
    ],
    [
      [0, 50, 0],
      [(i) => 50 * S(i / 10000), () => 0, (i) => 50 * C(i / 5000)]
    ],
    [
      [-30, 20, 50],
      [() => 0, () => 0, (i) => 0.01 * i - 100]
    ],
    [
      [30, 5, 50],
      [(i) => 10 * S(i / 1000), () => 0, (i) => 5 * C(i / 1000)]
    ],
    [
      [100, 50, 100],
      [(i) => 50 * S(i / 1000), () => 0, (i) => 50 * C(i / 1000)]
    ],
    [
      [0, 20, 60],
      [() => 0, () => 0, () => 0]
    ],
    [
      [0, 20, 60],
      [() => 0, () => 0, () => 0]
    ],
    [
      [0, 20, 60],
      [() => 0, () => 0, () => 0]
    ]
  ]

  R = () => {
    s.n = performance.now() - s.e
    t = (s.n - s.l) / 1000
    s.l = s.n

    if (s.h) {
      return
    }

    // Camera directions
    ;[i, j] = D[(s.n / 10000) | 0]
    P = add(
      i,
      j.map((j) => j(s.n))
    )

    // Slowing and speeding up the time based on beat
    n.getByteFrequencyData(f)
    // offset: 90 // Hihat
    // offset: 6, // bass
    // offset: 22, // generic
    t = 0.5 * t + (t * f[90]) / 32

    // Gravity & fading the illuminated spheres over time
    s.s.map((sphere) => {
      sphere.i = Math.max(0, sphere.i - 6 * t * (1 - sphere.i))
      sphere.v = add(sphere.v, mul(s.g, [t, t, t]))
      sphere.p = add(sphere.p, mul(sphere.v, [t, t, t]))
    })

    // Spheres colliding with each other
    for (i = 0; i < 13; i++) for (j = i + 1; j < 13; j++) e(s.s[i], s.s[j])

    // Collisions with walls
    s.s.map((sphere) => {
      for (i = 0; i < 3; i++) {
        let min = i == 1 ? 10 : -10,
          max = i == 1 ? 30 : 10
        if (sphere.p[i] - sphere.r < min) {
          sphere.v[i] = -sphere.v[i] * 0.8
          sphere.p[i] = min + sphere.r
          sphere.i = 0.99
        }
        if (sphere.p[i] + sphere.r > max) {
          sphere.v[i] = -sphere.v[i] * 0.8
          sphere.p[i] = max - sphere.r
          sphere.i = 0.99
        }
      }
    })

    r = [c.width, c.height] = [window.innerWidth, window.innerHeight]

    g.viewport(0, 0, ...r)
    g.clearColor(0, 0, 0, 1)
    g.clear(0x4000)

    g.useProgram(p)

    u('v', s.n) // Time
    u('d', ...r) // Resolution
    u('m', ...P) // Camera position
    u('z', ...T) // Camera target

    u('f', ...div([95, 28, 28], 255)) // Palette A
    u('s', ...div([174, 74, 74], 255)) // Palette B
    u('c', ...div([9, 9, 203], 255)) // Palette C
    u('y', ...div([48, 40, 40], 255)) // Palette D

    // Spheres
    u(
      'n',
      s.s.flatMap((s) => [
        ...s.p,
        // w component of vec4 carries radius in its integer part,
        // illumination in the fraction part
        s.r + s.i
      ])
    )

    g.drawArrays(5, 0, 4)

    window.requestAnimationFrame(R)
  }

  h = () => {
    if (m.g() >= 1) {
      d = document.createElement('audio')
      document.body.appendChild(c)

      c.style.position = 'fixed'
      c.style.left = c.style.top = 0
      // c.requestFullscreen()
      g = c.getContext('webgl')
      p = g.createProgram()

      d.src = URL.createObjectURL(new Blob([m.c()], { type: 'audio/wav' }))
      d.onplay = () => a.resume()

      n = a.createAnalyser()
      a.createMediaElementSource(d).connect(n)
      n.connect(a.destination)
      n.fftSize = 256
      f = new Uint8Array(n.frequencyBinCount)

      d.play()

      b = g.createShader(0x8b31) // g.VERTEX_SHADER
      g.shaderSource(
        b,
        `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`
      )
      g.compileShader(b)
      g.attachShader(p, b)

      b = g.createShader(0x8b30) // g.FRAGMENT_SHADER
      g.shaderSource(
        b,
        `precision highp float;uniform float v;uniform vec2 d;uniform vec3 m,z,f,s,c,y;const vec3 x=vec3(.2,.32,.49),i=vec3(.024,.06,.11),w=vec3(1,.92,1);uniform vec4 n[13];struct R{vec2 d;vec3 m;int i;bool h;};vec2 t(vec2 d,vec2 y){return d.y<y.y?d:y;}float t(vec3 v){return dot(v,v);}float t(vec3 v,vec3 m,vec3 z,vec3 d,vec3 y){vec3 c=z-m,w=v-m,f=d-z,x=v-z,i=y-d,h=v-d,n=m-y,a=v-y,s=cross(c,n);return sqrt(sign(dot(cross(c,s),w))+sign(dot(cross(f,s),x))+sign(dot(cross(i,s),h))+sign(dot(cross(n,s),a))<3.?min(min(min(t(c*clamp(dot(c,w)/t(c),0.,1.)-w),t(f*clamp(dot(f,x)/t(f),0.,1.)-x)),t(i*clamp(dot(i,h)/t(i),0.,1.)-h)),t(n*clamp(dot(n,a)/t(n),0.,1.)-a)):dot(s,w)*dot(s,w)/t(s));}float p(vec3 v){vec3 d=abs(v)-vec3(10);return length(max(d,0.))+min(max(d.x,max(d.y,d.z)),0.);}vec4 h;vec2 r(vec3 v){vec2 d=vec2(1,dot(v,vec3(0,1,0)));float c=p(v-vec3(0,20,0));if(c<d.y){vec2 f=vec2(5,t(v,vec3(10,10,-10),vec3(10,30,-10),vec3(-10,30,-10),vec3(-10,10,-10)));f=t(f,vec2(3,t(v,vec3(10),vec3(10,10,-10),vec3(10,30,-10),vec3(10,30,10))));f=t(f,vec2(4,t(v,vec3(-10,10,10),vec3(-10,10,-10),vec3(-10,30,-10),vec3(-10,30,10))));f=t(f,vec2(2,t(v,vec3(10,30,10),vec3(-10,30,10),vec3(-10,30,-10),vec3(10,30,-10))));f=t(f,vec2(1,t(v,vec3(10),vec3(-10,10,10),vec3(-10,10,-10),vec3(10,10,-10))));for(int i=0;i<13;++i){vec2 m=vec2(7.+float(i),length(v-n[i].xyz)-floor(n[i].w));if(m.y<f.y)f=m,h=n[i];}if(f.y<d.y)return f;}return d;}vec3 p(vec3 d,vec3 v){vec3 f=exp2(-abs(v.y<0.?1e8:(2.5e4-d.y)/v.y)*1e-5*w);return(i-.5*v.y)*f+(1.-f)*x;}float p(vec3 d,vec3 v,vec4 f){vec3 i=f.xyz-d;float c=length(i),m=dot(v,i),x=m,w=floor(f.w);if(m<w)x=pow(clamp((m+w)/(2.*w),0.,1.),1.5)*w;return clamp(w*w*x/(c*c*c),0.,1.);}float r(vec3 v,vec3 w){float d=1.;for(int f=0;f<13;f++)d*=1.-p(v,w,n[f]);return d;}float r(vec3 d,vec3 v,vec4 f){vec3 w=f.xyz-d;float x=sqrt(dot(w,w));return max(0.,dot(v,w/x)*(floor(f.w)/x)*fract(f.w));}vec3 e(float w){return f+s*cos(6.283184*(c*sin(10.*w+v/1e3)+y));}vec3 e(vec3 v,vec3 d,vec3 w,float f){vec3 x=e(f-7./float(13));float c=r(v,w);vec3 m=vec3(0);for(int i=0;i<13;i++)m+=r(v,w,n[i])*e(float(i)/float(13));vec3 i=vec3(1)*c*(1.-sqrt((.5+.5*-w.y)/(v.y+.5))*.5)*.4;i+=m+(f>=7.?x*fract(h.w):vec3(0));return i;}R e(vec3 v,vec3 w){float f=1e-4,c=1e-4;R d;for(int i=0;i<500;i++){f=.001*c;d.m=v+c*w;d.d=r(d.m);if(d.d.y<f){d.h=true;d.i=i;break;}c+=d.d.y;if(c>=2e3)break;}d.d.y=c;return d;}float e(vec2 v,vec2 f,vec2 d){vec2 w=max(abs(f),abs(d))+.01,i=v+.5*w,c=v-.5*w,x=(floor(i)+min(fract(i)*60.,1.)-floor(c)-min(fract(c)*60.,1.))/(60.*w);return(1.-x.x)*(1.-x.y);}mat4 l(vec3 v,vec3 f){vec3 d=normalize(f-v),w=normalize(cross(normalize(vec3(0,1,0)),d));return mat4(vec4(w,0),vec4(cross(d,w),0),vec4(-d,0),vec4(0,0,0,1));}vec3 l(vec3 v,vec3 d,vec2 f,float i){vec3 c=vec3(-.0123,.02,-.9997);mat4 m=l(v,d);vec3 s=(m*vec4(normalize(vec3(f,-i)),0)).xyz,n=(m*vec4(normalize(vec3(f+vec2(1,0),-i)),0)).xyz,z=(m*vec4(normalize(vec3(f+vec2(0,1),-i)),0)).xyz,r=vec3(0);float y=1.,a=0.;for(int b=0;b<5;b++){R t=e(v,s);if(!t.h){r=mix(r,p(v,s),y);float C=clamp(dot(c,s),0.,1.);r+=.5*vec3(1,.5,.2)*pow(C,10.);break;}a+=t.d.y;vec3 k;k=t.d.x>=7.?normalize(t.m-h.xyz):t.d.x==1.?vec3(0,1,0):t.d.x==2.?vec3(0,-1,0):t.d.x==3.?vec3(-1,0,0):t.d.x==4.?vec3(1,0,0):t.d.x==5.?vec3(0,0,1):vec3(0,0,-1);vec3 C=e(t.m,s,k,t.d.x);r=mix(r,C,y);vec3 E=exp2(-a*.005*w);if(t.d.x!=1.){r=r*E+(1.-E)*x;break;}y=clamp(1.+dot(s,k),0.,1.);y=.01+.4*pow(y,3.5)+.5;vec3 D=v-n*dot(v-t.m,k)/dot(n,k),B=v-z*dot(v-t.m,k)/dot(z,k);float g=e(.5*t.m.xz,.5*(D.xz-t.m.xz),.5*(B.xz-t.m.xz));y*=.5*g;r*=g;r=r*E+(1.-E)*x;v=t.m;s=reflect(s,k);}return r;}void main(){vec2 f=gl_FragCoord.xy-d/2.;vec3 i=l(m,z,f,d.y/tan(.5));i=pow(i,w);i*=vec3(1.02,.99,.9);i.z=i.z+.1;i=smoothstep(0.,1.,i);if(v<2e3)i=mix(i,vec3(0),(2e3-v)/2e3);gl_FragColor=vec4(i,1);}`
      )
      g.compileShader(b)
      g.attachShader(p, b)
      g.linkProgram(p)

      g.bindBuffer(0x8892, g.createBuffer()) // g.ARRAY_BUFFER
      g.bufferData(
        0x8892, // g.ARRAY_BUFFER
        new Float32Array([1, 1, 1, -1, -1, 1, -1, -1]),
        0x88e4 // g.STATIC_DRAW
      )

      g.enableVertexAttribArray(0)
      g.vertexAttribPointer(0, 2, 0x1406, false, 0, 0) // g.FLOAT

      P = [0, 20, 60]
      T = [0, 20, 0]

      s = {
        h: 0,
        e: performance.now(),
        n: 0,
        t: 0,
        l: 0,
        r: [0, 0],
        g: [0, 0, 0],
        s: [...Array(13)].map((_, i) => B((i % 3) + 1))
      }

      window.requestAnimationFrame(R)
    } else {
      setTimeout(h, 0)
    }
  }

  h()
}
