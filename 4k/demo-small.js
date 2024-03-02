S = Math.sin
C = Math.cos
Y = Math.random

addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Stop the demo by crashing it
    E = 1e9
    a.close()
  }
})

// Music player, based on the "player-small.js".
// Modified to contain only partial functionality to save some space.
// https://gitlab.com/mbitsnbites/soundbox
/* Original copyright below:
 * Copyright (c) 2011-2013 Marcus Geelnard
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 * 2. Altered source versions must be plainly marked as such, and must not be
 *    misrepresented as being the original software.
 *
 * 3. This notice may not be removed or altered from any source
 *    distribution.
 */
M = function (i) {
  let t = i.e,
    n = 0,
    r = i.r * i.p * (t + 1) * 2,
    a = new Int32Array(r),
    l = (e) => S(6.283184 * e),
    o = (e) => 0.00396 * 2 ** ((e - 128) / 12)
  ;(this.g = () => {
    let e,
      f,
      h,
      s,
      w,
      c,
      y,
      p,
      u,
      A,
      L,
      M,
      g,
      I,
      d = new Int32Array(r),
      m = i.s[n],
      C = i.r,
      P = i.p,
      v = 0,
      x = 0,
      D = !1,
      U = []
    for (h = 0; h <= t; ++h)
      for (y = m.p[h], s = 0; s < P; ++s) {
        let i = y ? m.c[y - 1].f[s] : 0
        i && ((m.i[i - 1] = m.c[y - 1].f[s + P] || 0), i < 17 && (U = []))
        let t = l,
          n = m.i[17] / 512,
          r = 2 ** (m.i[18] - 9) / C,
          W = m.i[19],
          b = m.i[20],
          j = (135.82764 * m.i[21]) / 44100,
          k = 1 - m.i[22] / 255,
          q = 1e-5 * m.i[23],
          z = m.i[24] / 32,
          B = m.i[25] / 512,
          E = (6.283184 * 2 ** (m.i[26] - 9)) / C,
          F = m.i[27] / 255,
          G = (m.i[28] * C) & -2
        for (L = (h * P + s) * C, w = 0; w < 4; ++w)
          if (((c = y ? m.c[y - 1].n[s + w * P] : 0), c)) {
            if (!U[c]) {
              let e,
                i,
                t,
                n,
                r,
                a = m.i[1],
                f = m.i[3] / 32,
                h = m.i[5],
                s = m.i[8] / 32,
                w = m.i[9],
                y = m.i[10] * m.i[10] * 4,
                p = m.i[11] * m.i[11] * 4,
                u = m.i[12] * m.i[12] * 4,
                A = 1 / u,
                L = -m.i[13] / 16,
                M = new Int32Array(y + p + u),
                g = 0,
                I = 0
              for (e = 0; e < y + p + u; e++)
                (n = o(c + m.i[2] - 128)),
                  (r = o(c + m.i[6] - 128) * (1 + 8e-4 * m.i[7])),
                  (i = 1),
                  e < y
                    ? (i = e / y)
                    : e >= y + p &&
                      ((i = (e - y - p) * A), (i = (1 - i) * 3 ** (L * i))),
                  (g += n * i ** f),
                  (t = l(g) * a),
                  (I += r * i ** s),
                  (t += l(I) * h),
                  w && (t += (2 * Y() - 1) * w),
                  (M[e] = (80 * t * i) | 0)
              U[c] = M
            }
            let i = U[c]
            for (f = 0, e = 2 * L; f < i.length; f++, e += 2) d[e] += i[f]
          }
        for (f = 0; f < C; f++)
          (p = 2 * (L + f)),
            (A = d[p]),
            A || D
              ? ((M = j),
                W && (M *= t(r * p) * n + 0.5),
                (M = 1.5 * S(M)),
                (v += M * x),
                (g = k * (A - x) - v),
                (x += M * g),
                (A = 3 == b ? x : 1 == b ? g : v),
                q &&
                  ((A *= q),
                  (A = A < 1 ? (A > -1 ? l(0.25 * A) : -1) : 1),
                  (A /= q)),
                (A *= z),
                (D = A * A > 1e-5),
                (u = S(E * p) * B + 0.5),
                (I = A * (1 - u)),
                (A *= u))
              : (I = 0),
            p >= G && ((I += d[p - G + 1] * F), (A += d[p - G] * F)),
            (d[p] = 0 | I),
            (d[p + 1] = 0 | A),
            (a[p] += 0 | I),
            (a[p + 1] += 0 | A)
      }
    return n++, n / i.n
  }),
    (this.c = () => {
      let e = 44,
        i = e + 2 * r - 8,
        t = i - 36,
        n = new Uint8Array(e + 2 * r)
      n.set([
        82,
        73,
        70,
        70,
        255 & i,
        (i >> 8) & 255,
        (i >> 16) & 255,
        (i >> 24) & 255,
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
        255 & t,
        (t >> 8) & 255,
        (t >> 16) & 255,
        (t >> 24) & 255
      ])
      for (let i = 0, t = e; i < r; ++i) {
        let e = a[i]
        ;(e = e < -32767 ? -32767 : e > 32767 ? 32767 : e),
          (n[t++] = 255 & e),
          (n[t++] = (e >> 8) & 255)
      }
      return n
    })
}

H = (a, b) => a.map((v, i) => v + b[i]) // add
I = (a, b) => a.map((v, i) => v - b[i]) // sub
J = (a, b) => a.map((v, i) => v * b[i]) // mul
K = (a, s) => a.map((v) => v / s) // div
L = (a) => a.reduce((v, i) => v + i) // sum

// Collisions handler
e = (sphere1, sphere2) => {
  x = I(sphere2.p, sphere1.p)
  y = Math.hypot(...x)
  w = sphere1.r + sphere2.r - y

  if (w > 0) {
    z = K(x, y)

    x = L(J(sphere1.v, z))
    y = L(J(sphere2.v, z))

    v =
      (x * (sphere1.m - sphere2.m) + 2 * sphere2.m * y) /
        (sphere1.m + sphere2.m) -
      x
    sphere1.v = H(sphere1.v, J([v, v, v], z))

    v =
      (y * (sphere2.m - sphere1.m) + 2 * sphere1.m * x) /
        (sphere1.m + sphere2.m) -
      y
    sphere2.v = H(sphere2.v, J([v, v, v], z))

    v = sphere1.m + sphere2.m
    x = (w * sphere2.m) / v
    y = (w * sphere1.m) / v

    sphere1.p = I(sphere1.p, J([x, x, x], z))
    sphere2.p = H(sphere2.p, J([y, y, y], z))

    sphere1.i = sphere2.i = 0.999
  }
}

// While developing and loading the fragment shader by fetch this needs to be turned async
// onclick = async () => {
onclick = () => {
  // Note that the long keys in the song output json have been renamed with their first characters.
  // Simple song created on Soundbox online editor
  // Song: https://sb.bitsnbites.eu/?data=U0JveA4C7d3NahNRFADgMzOpiBR1Kyhkp-CiiwqCInQjuCtSFwXBuuxCEKQILqQhoQwtoVVKRYS2D-ADuHDlU_gE4rKPEOcvaYkEF3bRpt9351zuufOTO5fsDiE_b0TMRvty3OxEEbNl9iRq6SCivZR1W1khSesWvdgpzu3Ul-z0ohvbxWC7zre7sbUVn6KMQtltbkbdCnvVldvxpYryiOgX7XMV5RHxsTqK2N-vHrlbHUUcHsZpyJvH1Q_PY6P5uGaJ5Xr3YrNaatUN36ffr5baH1_vMN9t2siHek-qvnjTjfJDNv5__b2xfHz_z7rhPk8y3OdJ5__a5zGntc8AAAAAAMAF8rwTsTKhUlYmo0rZ2tiNb8_Zi74by99MmB_q-W4AAAAAAABMt8HaYhGxFK1Lj-_VU-nViHY1SiIdVcry5oZ8NDqf8lHkJ8YAAAAAAABcPP06nrauzN0vht9nIjnKo_1q5nqrLJUNf1UWeaO-67i-dLI_y_J_BAAAAAAAABdNp473kTxsZpIfX-PW7Ww5KwtlSdNUkwAAAAAAAJgu66sL0V2NhV-tO3fni_z3pST7di3andbxNVWlrKRaBgAAAAAAwLTIBp2IQT9iPU3nHhUTL7Mke7EYK8_S2VGtbFQpUysDAAAAAABgejT_UzY4ODgo0_k0SR8cRXs52U9PVMgieW2rAAAAAAAAmCJ_AA
  // prettier-ignore
  m = new M({
    s:[
      {
        i:[0,28,128,0,0,28,128,12,0,0,12,0,72,0,0,0,0,0,0,0,2,255,0,0,32,83,3,130,4],
        p:[3,3,3,3,1,2,1,2,1,2,1,2],
        c:[
          {n:[131,,143,,,,143,,,,,,,143,131,,130,,142,,,,142,,,,,,,142,130,,138,138,,150,,138,,150,,,,,150,,,,137,137,,137,,137,,137,,,,,149,,,,142,,142,,154,,142,,154,,,154,,,,,140,,140,,152,,140,,152,,,152,,,,,145,,,145,,,,145,,157,157,,,,,,147,,,147,,,,147,,159,159],f:[]},
          {n:[135,,147,,,,147,,,,,,,147,135,,133,,145,,,,145,,137,,137,,,,,,137,137,,149,,137,,149,,,,,149,,,,138,138,,150,,138,,150,140,140,,140,,140,,140,140,,140,,152,,140,,152,,,152,,,,,140,,140,,152,,140,,147,,147,,147,,147,,,,,,,,,,,144,142,,,,,,142,,,,,154,,,133,,,145,,133],f:[]},
          {n:[131,,,,,,,,,,,,,,,,130,,142,,,,142,,,,,,,142,130],f:[]}
        ]
      },
      {
        i:[0,91,128,0,0,95,128,12,0,0,12,0,72,0,0,0,0,0,0,0,2,255,0,0,32,83,3,130,4],
        p:[,,,,1,2,1,2,1,2,1,2],
        c:[
          {n:[116,,,,,,,,,,,,,,,,118],f:[]},
          {n:[121,,,,,,,,,,,,,,,,114,,,,,,,,121,,,,,,,,,,,,,,,,,,,,,,,,131],f:[]}
        ]
      },
      {
        i:[0,255,116,79,0,255,116,0,83,0,4,6,69,52,0,0,0,0,0,0,2,14,0,0,32,0,0,0,0],
        p:[,1,,2,1,2,1,2,1,2,1,2],
        c:[
          {n:[135,,,,,,,,135,,135],f:[]},
          {n:[,,,,,,,,135,,,,135,,,,135,,135,,135,,,,135,,,,135],f:[]}
        ]
      },
      {
        i:[0,0,140,0,0,0,140,0,0,81,4,10,47,55,0,0,0,187,5,0,1,239,135,0,32,108,5,16,4],
        p:[,,1,,,,1,2,1,2,1,2],
        c:[
          {n:[135,135,135,135,135,135,135,135,,,,,,,135,,,,135,,,,,,135,,,,,,135],f:[]},
          {n:[135,,,,135,,,,135,,,,135,,,,135,,,,135,,,,135,,,,135],f:[]}
        ]
      },
      {
        i:[0,0,128,0,0,0,128,0,0,125,0,1,59,0,0,0,0,0,0,0,1,193,171,0,29,39,3,88,3],
        p:[,1,,,1,,1,,1,,1],
        c:[{n:[135],f:[]}]},
      {
        i:[0,127,104,64,0,130,104,0,64,229,4,40,43,51,0,0,0,231,6,1,3,183,15,0,32,128,4,0,0],
        p:[,,,,,,,,1,,1],
        c:[{n:[,,,,135],f:[]}]},
      {
        i:[3,255,128,0,0,255,140,0,0,127,2,2,47,61,0,0,0,100,3,1,3,94,79,0,95,84,2,12,4],
        p:[,,,,,,,,1,,1],c:[{n:[,,,,,,135],f:[]}]},
      {
        i:[0,0,140,0,0,0,140,0,0,255,158,158,158,0,0,0,0,51,2,1,2,58,239,0,32,88,1,157,2],
        p:[1,,1,,,,,,,,,,1],
        c:[{n:[111],f:[]}]
      }
    ],
    r:7000,
    p:32,
    e:12,
    n:8
  })
  a = new AudioContext()

  // Initialize the epoch early to make the first tick have some dt
  // to move the overlapping spheres and not divide by zero
  E = performance.now()

  // Generate all song channels
  while (m.g() < 1);

  // Camera movements and gravity changes.
  // 0 = Starting position of the camera
  // 1 = Movement function to apply. Variable starts from 0 at each cut
  // 2 = Gravity
  D = [
    // Circling around the box
    [
      [-100, 20, 50],
      [(i) => 100 * S(i / 6), 0, (i) => 100 * C(i / 6)],
      [0, 0, 0]
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
      [25, 1, 50],
      [(i) => -10 * S(i / 6), (i) => 10 * S(i / 6), (i) => 20 * S(i / 6)],
      [-1, 2, -1]
    ],

    // Further away
    [
      [80, 50, 80],
      [(i) => 100 * C(i / 3), () => 0, (i) => 50 * S(i / 6)],
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

  // Render loop
  R = () => {
    o = performance.now() - E
    t = (o - q) / 1000
    q = o

    // Apply camera movements. Macig number 9600 is calculated from the BPM 100
    // This also stops the demo by crashing it once index goes out of bounds.
    // Not elegant, but reliable and takes zero space so yay?
    ;[x, y, z] = D[(o / 10000) | 0]
    P = H(
      x,
      y.map((y) => (y ? y((o % 10000) / 1000) : 0))
    )

    // Also apply new gravity if it is defined
    G = z

    // Slowing and speeding up the simulation time based on FFT from the beat
    n.getByteFrequencyData(f)
    t = 0.5 * t + (t * f[90]) / 32 // 90: Hihat, 6: Bass, 22: Overall mood

    // Gravity & fading the illuminated spheres back to dark over time
    s.map((sphere) => {
      sphere.i = Math.max(0, sphere.i - 6 * t * (1 - sphere.i))
      sphere.v = H(sphere.v, J(G, [t, t, t]))
      sphere.p = H(sphere.p, J(sphere.v, [t, t, t]))
    })

    // Spheres collisions with each other
    for (i = 0; i < 13; i++) for (j = i + 1; j < 13; j++) e(s[i], s[j])

    // Collisions with walls
    s.map((sphere) => {
      for (i = 0; i < 3; i++) {
        x = i == 1 ? 10 : -10
        y = i == 1 ? 30 : 10
        if (sphere.p[i] - sphere.r < x) {
          sphere.v[i] = -sphere.v[i] * 0.8
          sphere.p[i] = x + sphere.r
          sphere.i = 0.99 // After colliding set the brightness to max
        }
        if (sphere.p[i] + sphere.r > y) {
          sphere.v[i] = -sphere.v[i] * 0.8
          sphere.p[i] = y - sphere.r
          sphere.i = 0.99
        }
      }
    })

    r = [c.width, c.height, x] = [window.innerWidth, window.innerHeight, 0]

    g.viewport(0, 0, ...r)
    // g.clearColor(0, 0, 0, 1)
    g.clear(0x4000)

    g.useProgram(p)

    // g.uniform1f(u('u_time'), o) // Time
    // g.uniform3f(u('u_resolution'), ...r) // Resolution
    // g.uniform3f(u('u_camera'), ...P) // Camera position
    // g.uniform3f(u('u_target'), ...T) // Camera target

    // Make sure these match what the shader minifier produces!
    g.uniform1f(u('v'), o) // Time
    g.uniform3f(u('d'), ...r) // Resolution
    g.uniform3f(u('m'), ...P) // Camera position
    // g.uniform3f(u('m'), ...T) // Camera target - constant

    // Spheres
    g.uniform4fv(
      u('n'),
      // u('u_spheres'),
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

  d = document.createElement('audio')
  document.body.appendChild(c)

  c.style.position = 'fixed'
  c.style.left = c.style.top = 0

  g = c.getContext('webgl')
  u = (loc) => g.getUniformLocation(p, loc)

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
  g.shaderSource(b, `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`)
  g.compileShader(b)
  g.attachShader(p, b)

  b = g.createShader(0x8b30) // g.FRAGMENT_SHADER

  // fs = await fetch('4k/fragment.glsl').then((r) => r.text())
  g.shaderSource(
    b,
    `precision highp float;uniform float v;uniform vec3 d,m;const vec3 c=vec3(.5,.3,.2),f=vec3(.9,.96,.91),i=vec3(0,20,0);uniform vec4 n[13];struct R{vec2 d;vec3 m;int i;bool h;};vec2 t(vec2 d,vec2 m){return d.y<m.y?d:m;}float t(vec3 v){return dot(v,v);}float t(vec3 v,vec3 m,vec3 d,vec3 z,vec3 y){vec3 f=d-m,x=v-m,i=z-d,w=v-d,c=y-z,n=v-z,a=m-y,h=v-y,l=cross(f,a);return sqrt(sign(dot(cross(f,l),x))+sign(dot(cross(i,l),w))+sign(dot(cross(c,l),n))+sign(dot(cross(a,l),h))<3.?min(min(min(t(f*clamp(dot(f,x)/t(f),0.,1.)-x),t(i*clamp(dot(i,w)/t(i),0.,1.)-w)),t(c*clamp(dot(c,n)/t(c),0.,1.)-n)),t(a*clamp(dot(a,h)/t(a),0.,1.)-h)):dot(l,x)*dot(l,x)/t(l));}float s(vec3 v){vec3 d=abs(v)-vec3(10);return length(max(d,0.))+min(max(d.x,max(d.y,d.z)),0.);}vec4 x;vec2 r(vec3 v){vec2 d=vec2(1,dot(v,vec3(0,1,0)));float f=s(v-vec3(0,20,0));if(f<d.y){vec2 m=vec2(5,t(v,vec3(10,10,-10),vec3(10,30,-10),vec3(-10,30,-10),vec3(-10,10,-10)));m=t(m,vec2(3,t(v,vec3(10),vec3(10,10,-10),vec3(10,30,-10),vec3(10,30,10))));m=t(m,vec2(4,t(v,vec3(-10,10,10),vec3(-10,10,-10),vec3(-10,30,-10),vec3(-10,30,10))));m=t(m,vec2(2,t(v,vec3(10,30,10),vec3(-10,30,10),vec3(-10,30,-10),vec3(10,30,-10))));m=t(m,vec2(1,t(v,vec3(10),vec3(-10,10,10),vec3(-10,10,-10),vec3(10,10,-10))));for(int i=0;i<13;++i){vec2 c=vec2(7.+float(i),length(v-n[i].xyz)-floor(n[i].w));if(c.y<m.y)m=c,x=n[i];}if(m.y<d.y)return m;}return d;}vec3 r(vec3 d,vec3 v){vec3 m=exp2(-abs(v.y<0.?1e8:(250.-d.y)/v.y)*.001*vec3(1));return(f-.5*v.y)*m+(1.-m)*c;}float r(vec3 m,vec3 v,vec4 d){vec3 f=d.xyz-m;float c=length(f),i=dot(v,f),x=i,l=floor(d.w);if(i<l)x=pow(clamp((i+l)/(2.*l),0.,1.),1.5)*l;return clamp(l*l*x/(c*c*c),0.,1.);}float s(vec3 v,vec3 m){float d=1.;for(int i=0;i<13;i++)d*=1.-r(v,m,n[i]);return d;}float s(vec3 m,vec3 v,vec4 d){vec3 f=d.xyz-m;float x=sqrt(dot(f,f));return max(0.,dot(v,f/x)*(floor(d.w)/x)*(fract(d.w)*1.2));}vec3 p(float d){return vec3(.37,.1,.1)+vec3(.68,.29,.29)*cos(6.283184*(vec3(.04,.04,.8)*sin(10.*d+v/1e3)+vec3(.19)));}vec3 p(vec3 d,vec3 v,vec3 m,float f){vec3 c=p(f-7./float(13));float i=s(d,m);vec3 t=vec3(0);for(int y=0;y<13;y++)t+=s(d,m,n[y])*p(float(y)/float(13));vec3 r=vec3(1)*i*(1.-sqrt((.5+.5*-m.y)/(d.y+.5))*.5)*.4;r+=t+(f>=7.?c*fract(x.w)*2.:vec3(0));return r;}R p(vec3 v,vec3 d){float m=1e-4,f=1e-4;R i;for(int c=0;c<500;c++){m=.001*f;i.m=v+f*d;i.d=r(i.m);if(i.d.y<m){i.h=true;i.i=c;break;}f+=i.d.y;if(f>=2e3)break;}i.d.y=f;return i;}float p(vec2 v,vec2 d,vec2 f){vec2 m=max(abs(d),abs(f))+.01,i=v+.5*m,x=v-.5*m,l=(floor(i)+min(fract(i)*60.,1.)-floor(x)-min(fract(x)*60.,1.))/(60.*m);return(1.-l.x)*(1.-l.y);}vec3 t(vec3 v,vec2 d,float m){vec3 f=vec3(0,0,-1),l=normalize(i-v),y=normalize(cross(vec3(0,1,0),l));mat4 a=mat4(vec4(y,0),vec4(cross(l,y),0),vec4(-l,0),vec4(0,0,0,1));vec3 n=(a*vec4(normalize(vec3(d,-m)),0)).xyz,z=(a*vec4(normalize(vec3(d+vec2(1,0),-m)),0)).xyz,h=(a*vec4(normalize(vec3(d+vec2(0,1),-m)),0)).xyz,t=vec3(0);float w=1.,s=0.;for(int b=0;b<5;b++){R e=p(v,n);if(!e.h){t=mix(t,r(v,n),w);float C=clamp(dot(f,n),0.,1.);t+=.5*vec3(1,.5,.2)*pow(C,10.);break;}s+=e.d.y;vec3 k;k=e.d.x>=7.?normalize(e.m-x.xyz):e.d.x==1.?vec3(0,1,0):e.d.x==2.?vec3(0,-1,0):e.d.x==3.?vec3(-1,0,0):e.d.x==4.?vec3(1,0,0):e.d.x==5.?vec3(0,0,1):vec3(0,0,-1);vec3 C=p(e.m,n,k,e.d.x);t=mix(t,C,w);vec3 E=exp2(-s*.002*vec3(1));if(e.d.x!=1.){t=t*E+(1.-E)*c;break;}w=clamp(1.+dot(n,k),0.,1.);w=.01+.4*pow(w,3.5)+.5;vec3 D=v-z*dot(v-e.m,k)/dot(z,k),B=v-h*dot(v-e.m,k)/dot(h,k);float g=p(.5*e.m.xz,.5*(D.xz-e.m.xz),.5*(B.xz-e.m.xz));w*=.5*g;t*=g;t=t*E+(1.-E)*c;v=e.m;n=reflect(n,k);}return t;}void main(){vec2 f=gl_FragCoord.xy-d.xy/2.;vec3 i=t(m,f,d.y/tan(.5));if(v<2e3)i=mix(i,vec3(0),(2e3-v)/2e3);i=smoothstep(0.,1.,i);gl_FragColor=vec4(i,1);}`
  )
  g.compileShader(b)
  // if (!g.getShaderParameter(b, g.COMPILE_STATUS)) {
  //   alert('Fragment shader: ' + g.getShaderInfoLog(b))
  // }

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

  // Spheres
  s = [...Array(13)].map((_, i) =>
    // Sphere struct
    ((r) => ({
      p: [0, 20, 0], // position
      v: [-0.5 + Y(), -0.5 + Y(), -0.5 + Y()], // velocity
      i: 0, // illumination
      r, // radius
      m: 4 * r ** 3 // mass
    }))((i % 3) + 1)
  )

  // Time and last frame time
  o = q = 0

  c.requestFullscreen().then(R)
  // R()
}
