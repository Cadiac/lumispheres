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

  // document.addEventListener(
  //   'keydown',
  //   (e) => {
  //     if (e.key === 'Escape') {
  //       halt = true;
  //       a.close()
  //     }
  //   },
  //   true
  // )

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

  // Camera movements and gravity changes
  D = [
    // Circling around the box
    [
      [-100, 20, 50],
      [(i) => 100 * S(i / 6), 0, (i) => 100 * C(i / 6)]
    ],

    // Flying behind the box, showing the lights on its walls
    [
      [-40, 40, -80],
      [0, (i) => 30 * C(i / 3), 0],
      [0, -1, -1]
    ],

    // Front of the box
    [
      [0, 20, 60],
      [0, 0, 0],
      [0, 1, 0]
    ],

    // Low angle
    [
      [25, 0, 50],
      [0, 0, 0],
      [-1, 1, -1]
    ],

    // Further away
    [
      [100, 50, 100],
      [(i) => 50 * S(i / 1000), () => 0, (i) => 50 * C(i / 1000)],
      [-1, -1, 1]
    ],

    // Front of the box
    [
      [0, 20, 60],
      [0, 0, 0],
      [0, 1, -1]
    ],
    // Flying away
    [
      [0, 20, 60],
      [0, 0, (i) => i ** 3],
      [0, -1, 0]
    ]
  ]

  R = () => {
    o = performance.now() - ooo
    t = (o - oo) / 1000
    oo = o

    // Camera directions
    ;[x, y, z] = D[(o / 9600) | 0]
    P = add(
      x,
      y.map((y) => (y ? y((o % 9600) / 1000) : 0))
    )
    z && (G = z)

    // Slowing and speeding up the time based on beat
    n.getByteFrequencyData(f)
    // offset: 90 // Hihat
    // offset: 6, // bass
    // offset: 22, // generic
    t = 0.5 * t + (t * f[90]) / 32

    // Gravity & fading the illuminated spheres over time
    s.map((sphere) => {
      sphere.i = Math.max(0, sphere.i - 6 * t * (1 - sphere.i))
      sphere.v = add(sphere.v, mul(G, [t, t, t]))
      sphere.p = add(sphere.p, mul(sphere.v, [t, t, t]))
    })

    // Spheres colliding with each other
    for (i = 0; i < 13; i++) for (j = i + 1; j < 13; j++) e(s[i], s[j])

    // Collisions with walls
    s.map((sphere) => {
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

    u('v', o) // Time
    u('d', ...r) // Resolution
    u('m', ...P) // Camera position
    u('k', ...T) // Camera target

    // Spheres
    u(
      'i',
      s.flatMap((s) => [
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
      c.requestFullscreen()
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
        `precision highp float;uniform float v;uniform vec2 d;uniform vec3 m,k;const vec3 c=vec3(.2,.32,.49),f=vec3(.024,.06,.11),y=vec3(1,.92,1);uniform vec4 i[13];struct R{vec2 d;vec3 m;int i;bool h;};vec2 t(vec2 d,vec2 y){return d.y<y.y?d:y;}float t(vec3 v){return dot(v,v);}float t(vec3 v,vec3 m,vec3 d,vec3 z,vec3 y){vec3 x=d-m,f=v-m,i=z-d,w=v-d,c=y-z,a=v-z,n=m-y,h=v-y,k=cross(x,n);return sqrt(sign(dot(cross(x,k),f))+sign(dot(cross(i,k),w))+sign(dot(cross(c,k),a))+sign(dot(cross(n,k),h))<3.?min(min(min(t(x*clamp(dot(x,f)/t(x),0.,1.)-f),t(i*clamp(dot(i,w)/t(i),0.,1.)-w)),t(c*clamp(dot(c,a)/t(c),0.,1.)-a)),t(n*clamp(dot(n,h)/t(n),0.,1.)-h)):dot(k,f)*dot(k,f)/t(k));}float n(vec3 v){vec3 d=abs(v)-vec3(10);return length(max(d,0.))+min(max(d.x,max(d.y,d.z)),0.);}vec4 x;vec2 s(vec3 v){vec2 d=vec2(1,dot(v,vec3(0,1,0)));float c=n(v-vec3(0,20,0));if(c<d.y){vec2 m=vec2(5,t(v,vec3(10,10,-10),vec3(10,30,-10),vec3(-10,30,-10),vec3(-10,10,-10)));m=t(m,vec2(3,t(v,vec3(10),vec3(10,10,-10),vec3(10,30,-10),vec3(10,30,10))));m=t(m,vec2(4,t(v,vec3(-10,10,10),vec3(-10,10,-10),vec3(-10,30,-10),vec3(-10,30,10))));m=t(m,vec2(2,t(v,vec3(10,30,10),vec3(-10,30,10),vec3(-10,30,-10),vec3(10,30,-10))));m=t(m,vec2(1,t(v,vec3(10),vec3(-10,10,10),vec3(-10,10,-10),vec3(10,10,-10))));for(int f=0;f<13;++f){vec2 z=vec2(7.+float(f),length(v-i[f].xyz)-floor(i[f].w));if(z.y<m.y)m=z,x=i[f];}if(m.y<d.y)return m;}return d;}vec3 n(vec3 d,vec3 v){vec3 m=exp2(-abs(v.y<0.?1e8:(2.5e4-d.y)/v.y)*1e-5*y);return(f-.5*v.y)*m+(1.-m)*c;}float n(vec3 m,vec3 v,vec4 d){vec3 f=d.xyz-m;float c=length(f),i=dot(v,f),k=i,y=floor(d.w);if(i<y)k=pow(clamp((i+y)/(2.*y),0.,1.),1.5)*y;return clamp(y*y*k/(c*c*c),0.,1.);}float s(vec3 v,vec3 m){float d=1.;for(int f=0;f<13;f++)d*=1.-n(v,m,i[f]);return d;}float s(vec3 m,vec3 v,vec4 d){vec3 f=d.xyz-m;float y=sqrt(dot(f,f));return max(0.,dot(v,f/y)*(floor(d.w)/y)*fract(d.w));}vec3 p(float y){return vec3(.37,.1,.1)+vec3(.68,.29,.29)*cos(6.283184*(vec3(.04,.04,.8)*sin(10.*y+v/1e3)+vec3(.19)));}vec3 n(vec3 v,vec3 m,vec3 d,float f){vec3 c=p(f-7./float(13));float y=s(v,d);vec3 z=vec3(0);for(int n=0;n<13;n++)z+=s(v,d,i[n])*p(float(n)/float(13));vec3 r=vec3(1)*y*(1.-sqrt((.5+.5*-d.y)/(v.y+.5))*.5)*.4;r+=z+(f>=7.?c*fract(x.w):vec3(0));return r;}R p(vec3 v,vec3 y){float f=1e-4,c=1e-4;R d;for(int m=0;m<500;m++){f=.001*c;d.m=v+c*y;d.d=s(d.m);if(d.d.y<f){d.h=true;d.i=m;break;}c+=d.d.y;if(c>=2e3)break;}d.d.y=c;return d;}float p(vec2 v,vec2 d,vec2 f){vec2 m=max(abs(d),abs(f))+.01,y=v+.5*m,c=v-.5*m,k=(floor(y)+min(fract(y)*60.,1.)-floor(c)-min(fract(c)*60.,1.))/(60.*m);return(1.-k.x)*(1.-k.y);}mat4 r(vec3 v,vec3 d){vec3 m=normalize(d-v),f=normalize(cross(normalize(vec3(0,1,0)),m));return mat4(vec4(f,0),vec4(cross(m,f),0),vec4(-m,0),vec4(0,0,0,1));}vec3 p(vec3 v,vec3 m,vec2 d,float f){vec3 i=vec3(-.0123,.02,-.9997);mat4 k=r(v,m);vec3 z=(k*vec4(normalize(vec3(d,-f)),0)).xyz,a=(k*vec4(normalize(vec3(d+vec2(1,0),-f)),0)).xyz,h=(k*vec4(normalize(vec3(d+vec2(0,1),-f)),0)).xyz,s=vec3(0);float w=1.,l=0.;for(int b=0;b<5;b++){R t=p(v,z);if(!t.h){s=mix(s,n(v,z),w);float C=clamp(dot(i,z),0.,1.);s+=.5*vec3(1,.5,.2)*pow(C,10.);break;}l+=t.d.y;vec3 u;u=t.d.x>=7.?normalize(t.m-x.xyz):t.d.x==1.?vec3(0,1,0):t.d.x==2.?vec3(0,-1,0):t.d.x==3.?vec3(-1,0,0):t.d.x==4.?vec3(1,0,0):t.d.x==5.?vec3(0,0,1):vec3(0,0,-1);vec3 C=n(t.m,z,u,t.d.x);s=mix(s,C,w);vec3 E=exp2(-l*.005*y);if(t.d.x!=1.){s=s*E+(1.-E)*c;break;}w=clamp(1.+dot(z,u),0.,1.);w=.01+.4*pow(w,3.5)+.5;vec3 D=v-a*dot(v-t.m,u)/dot(a,u),B=v-h*dot(v-t.m,u)/dot(h,u);float e=p(.5*t.m.xz,.5*(D.xz-t.m.xz),.5*(B.xz-t.m.xz));w*=.5*e;s*=e;s=s*E+(1.-E)*c;v=t.m;z=reflect(z,u);}return s;}void main(){vec2 f=gl_FragCoord.xy-d/2.;vec3 c=p(m,k,f,d.y/tan(.5));c=pow(c,y);c*=vec3(1.02,.99,.9);c.z=c.z+.1;c=smoothstep(0.,1.,c);if(v<2e3)c=mix(c,vec3(0),(2e3-v)/2e3);gl_FragColor=vec4(c,1);}`
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

      P = G = [0, 0, 0]
      T = [0, 20, 0]
      s = [...Array(13)].map((_, i) => B((i % 3) + 1))

      o = oo = 0
      ooo = performance.now()

      window.requestAnimationFrame(R)
    } else {
      setTimeout(h, 0)
    }
  }

  h()
}
