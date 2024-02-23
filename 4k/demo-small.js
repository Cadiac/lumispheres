SPHERES = 13
DAMPENING = 0.8

// prettier-ignore
song = {songData:[{i:[0,28,128,0,0,28,128,12,0,0,12,0,72,0,0,0,0,0,0,0,2,255,0,0,32,83,3,130,4],p:[3,3,3,3,1,2,1,2,1,2,1,2,1,2,1,2,1,2],c:[{n:[131,,143,,,,143,,,,,,,143,131,,130,,142,,,,142,,,,,,,142,130,,138,138,,150,,138,,150,,,,,150,,,,137,137,,137,,137,,137,,,,,149,,,,142,,142,,154,,142,,154,,,154,,,,,140,,140,,152,,140,,152,,,152,,,,,145,,,145,,,,145,,157,157,,,,,,147,,,147,,,,147,,159,159],f:[]},{n:[135,,147,,,,147,,,,,,,147,135,,133,,145,,,,145,,137,,137,,,,,,137,137,,149,,137,,149,,,,,149,,,,138,138,,150,,138,,150,140,140,,140,,140,,140,140,,140,,152,,140,,152,,,152,,,,,140,,140,,152,,140,,147,,147,,147,,147,,,,,,,,,,,144,142,,,,,,142,,,,,154,,,133,,,145,,133],f:[]},{n:[131,,,,,,,,,,,,,,,,130,,142,,,,142,,,,,,,142,130],f:[]}]},{i:[0,91,128,0,0,95,128,12,0,0,12,0,72,0,0,0,0,0,0,0,2,255,0,0,32,83,3,130,4],p:[,,,,1,2,1,2,1,2,1,2,1,2,1,2,1,2],c:[{n:[116,,,,,,,,,,,,,,,,118],f:[]},{n:[121,,,,,,,,,,,,,,,,114,,,,,,,,121,,,,,,,,,,,,,,,,,,,,,,,,131],f:[]}]},{i:[0,255,116,79,0,255,116,0,83,0,4,6,69,52,0,0,0,0,0,0,2,14,0,0,32,0,0,0,0],p:[,1,,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2],c:[{n:[135,,,,,,,,135,,135],f:[]},{n:[,,,,,,,,135,,,,135,,,,135,,135,,135,,,,135,,,,135],f:[]}]},{i:[0,0,140,0,0,0,140,0,0,81,4,10,47,55,0,0,0,187,5,0,1,239,135,0,32,108,5,16,4],p:[,,,,,,1,2,1,2,1,2,1,2,1,2,1,2],c:[{n:[135,135,135,135,135,135,135,135,,,,,,,135,,,,135,,,,,,135,,,,,,135],f:[]},{n:[135,,,,135,,,,135,,,,135,,,,135,,,,135,,,,135,,,,135],f:[]}]},{i:[0,0,128,0,0,0,128,0,0,125,0,1,59,0,0,0,0,0,0,0,1,193,171,0,29,39,3,88,3],p:[,,,,,,1,,1,,1,,1,,1,,1],c:[{n:[135],f:[]}]},{i:[0,127,104,64,0,130,104,0,64,229,4,40,43,51,0,0,0,231,6,1,3,183,15,0,32,128,4,0,0],p:[,,,,,,,,1,,1,,1,,1,,1],c:[{n:[,,,,135],f:[]}]},{i:[3,255,128,0,0,255,140,0,0,127,2,2,47,61,0,0,0,96,3,1,3,94,79,0,95,84,2,12,4],p:[,,,,,,,,1,,1,,1,,1,,1],c:[{n:[,,,,,,135],f:[]}]},{i:[0,0,140,0,0,0,140,0,0,255,158,158,158,0,0,0,0,51,2,1,2,58,239,0,32,88,1,157,2],p:[1,,1],c:[{n:[111],f:[]}]}],rowLen:6615,patternLen:32,endPattern:17,numChannels:8};
function CPlayer() {
  let r,
    n,
    i,
    t,
    e,
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
  ;(this.init = (a) => {
    ;(r = a),
      (n = a.endPattern),
      (i = 0),
      (t = a.rowLen * a.patternLen * (n + 1) * 2),
      (e = new Int32Array(t))
  }),
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
      let r = 44,
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
      for (let f = 0, o = r; f < t; ++f) {
        let u = e[f]
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

running = false

run = async () => {
  if (running) {
    return
  }

  running = true

  player = new CPlayer()
  audioCtx = new AudioContext()
  player.init(song)

  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape') {
        state.halt = !state.halt
        audioCtx.close()
      }
    },
    true
  )

  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  canvas.style.position = 'fixed'
  canvas.style.left = canvas.style.top = 0

  gl = canvas.getContext('webgl')
  program = gl.createProgram()

  function init() {
    if (player.generate() >= 1) {
      const wave = player.createWave()
      const audio = document.createElement('audio')
      audio.src = URL.createObjectURL(new Blob([wave], { type: 'audio/wav' }))
      audio.onplay = () => audioCtx.resume()

      analyser = audioCtx.createAnalyser()
      const source = audioCtx.createMediaElementSource(audio)

      source.connect(analyser)
      analyser.connect(audioCtx.destination)
      analyser.fftSize = 256
      fftDataArray = new Uint8Array(analyser.frequencyBinCount)

      audio.play()

      shader = gl.createShader(0x8b31)
      gl.shaderSource(
        shader,
        `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`
      )
      gl.compileShader(shader)
      gl.attachShader(program, shader)

      shader = gl.createShader(0x8b30)
      gl.shaderSource(
        shader,
        `precision highp float;uniform float v,z,d;uniform vec2 m;uniform vec3 f,a,c,k;uniform float h;uniform vec3 i,y,l,s,n,w;uniform float r,C,F,e,p;uniform vec4 g[13];struct R{vec2 d;vec3 m;int i;bool h;};vec2 t(vec2 p,vec2 d){return p.y<d.y?p:d;}float t(vec3 v){return dot(v,v);}float t(vec3 p,vec3 v,vec3 m,vec3 f,vec3 z){vec3 d=m-v,y=p-v,c=f-m,x=p-m,n=z-f,w=p-f,i=v-z,a=p-z,r=cross(d,i);return sqrt(sign(dot(cross(d,r),y))+sign(dot(cross(c,r),x))+sign(dot(cross(n,r),w))+sign(dot(cross(i,r),a))<3.?min(min(min(t(d*clamp(dot(d,y)/t(d),0.,1.)-y),t(c*clamp(dot(c,x)/t(c),0.,1.)-x)),t(n*clamp(dot(n,w)/t(n),0.,1.)-w)),t(i*clamp(dot(i,a)/t(i),0.,1.)-a)):dot(r,y)*dot(r,y)/t(r));}vec4 x;vec2 D(vec3 v){float m=e;vec2 d=vec2(1,dot(v,vec3(0,1,0)));d=t(d,vec2(5,t(v,vec3(p,m,-p),vec3(p,2.*p+m,-p),vec3(-p,2.*p+m,-p),vec3(-p,m,-p))));d=t(d,vec2(3,t(v,vec3(p,m,p),vec3(p,m,-p),vec3(p,2.*p+m,-p),vec3(p,2.*p+m,p))));d=t(d,vec2(4,t(v,vec3(-p,m,p),vec3(-p,m,-p),vec3(-p,2.*p+m,-p),vec3(-p,2.*p+m,p))));d=t(d,vec2(2,t(v,vec3(p,2.*p+m,p),vec3(-p,2.*p+m,p),vec3(-p,2.*p+m,-p),vec3(p,2.*p+m,-p))));d=t(d,vec2(1,t(v,vec3(p,m,p),vec3(-p,m,p),vec3(-p,m,-p),vec3(p,m,-p))));for(int f=0;f<13;++f){vec2 c=vec2(7.+float(f),length(v-g[f].xyz)-floor(g[f].w));if(c.y<d.y)d=c,x=g[f];}return d;}vec3 D(vec3 p,vec3 d){vec3 v=exp2(-abs((2.5e4-p.y)/d.y)*1e-5*y);return(i-.5*d.y)*v+(1.-v)*k;}float D(vec3 p,vec3 v,vec4 d){vec3 m=d.xyz-p;float c=length(m),f=dot(v,m),y=f,i=floor(d.w);if(f<i)y=pow(clamp((f+i)/(2.*i),0.,1.),1.5)*i;return clamp(i*i*y/(c*c*c),0.,1.);}float B(vec3 v,vec3 p){float d=1.;for(int f=0;f<13;f++)d*=1.-D(v,p,g[f]);return d;}float B(vec3 p,vec3 v,vec4 d){vec3 m=d.xyz-p;float y=sqrt(dot(m,m));return max(0.,dot(v,m/y)*(floor(d.w)/y)*fract(d.w));}vec3 B(float p){return l+s*cos(6.28318*(n*(r+C*sin(F*p+v/1e3))+w));}vec3 B(vec3 d,vec3 m,vec3 p,float v){vec3 f=B(v-7./float(13));float c=B(d,p);vec3 y=vec3(0);for(int i=0;i<13;i++)y+=B(d,p,g[i])*B(float(i)/float(13));vec3 i=vec3(1)*c*(1.-sqrt((.5+.5*-p.y)/(d.y+.5))*.5)*.4;i+=y+(v>=7.?f*fract(x.w):vec3(0));return i;}R A(vec3 p,vec3 d){float v=1e-4,m=1e-4;R f;for(int i=0;i<500;i++){v=.001*m;f.m=p+m*d;f.d=D(f.m);if(f.d.y<v){f.h=true;f.i=i;break;}m+=f.d.y;if(m>=2e2)break;}f.d.y=m;return f;}float A(vec2 p,vec2 v,vec2 d){vec2 m=max(abs(v),abs(d))+.01,y=p+.5*m,i=p-.5*m,f=(floor(y)+min(fract(y)*60.,1.)-floor(i)-min(fract(i)*60.,1.))/(60.*m);return(1.-f.x)*(1.-f.y);}mat4 E(vec3 p,vec3 v){vec3 m=normalize(v-p),d=normalize(cross(normalize(vec3(0,1,0)),m));return mat4(vec4(d,0),vec4(cross(m,d),0),vec4(-m,0),vec4(0,0,0,1));}vec3 A(vec3 v,vec3 p,vec3 d,vec2 m,float f){mat4 i=E(v,p);vec3 c=(i*vec4(normalize(vec3(m,-f)),0)).xyz,n=(i*vec4(normalize(vec3(m+vec2(1,0),-f)),0)).xyz,r=(i*vec4(normalize(vec3(m+vec2(0,1),-f)),0)).xyz,z=vec3(0);float w=1.,a=0.;for(int u=0;u<5;u++){R g=A(v,c);if(!g.h){z=mix(z,D(v,c),w);float s=clamp(dot(d,c),0.,1.);z+=.5*vec3(1,.5,.2)*pow(s,32.);break;}a+=g.d.y;vec3 s;s=g.d.x>=7.?normalize(g.m-x.xyz):g.d.x==1.?vec3(0,1,0):g.d.x==2.?vec3(0,-1,0):g.d.x==3.?vec3(-1,0,0):g.d.x==4.?vec3(1,0,0):g.d.x==5.?vec3(0,0,1):vec3(0,0,-1);vec3 l=B(g.m,c,s,g.d.x);z=mix(z,l,w);vec3 t=exp2(-a*h*y);if(g.d.x!=1.){z=z*t+(1.-t)*k;break;}w=clamp(1.+dot(c,s),0.,1.);w=.01+.4*pow(w,3.5)+.5;vec3 F=v-n*dot(v-g.m,s)/dot(n,s),C=v-r*dot(v-g.m,s)/dot(r,s);float e=A(.5*g.m.xz,.5*(F.xz-g.m.xz),.5*(C.xz-g.m.xz));w*=.5*e;z*=e;z=z*t+(1.-t)*k;v=g.m;c=reflect(c,s);}return z;}void main(){vec2 p=gl_FragCoord.xy-m/2.;vec3 i=A(f,a,normalize(c),p,m.y/tan(radians(d)/2.));i=pow(i,y);i*=vec3(1.02,.99,.9);i.z=i.z+.1;i=smoothstep(0.,1.,i);if(v<2e3)i=mix(i,vec3(0),(2e3-v)/2e3);gl_FragColor=vec4(i,1);}`
      )
      gl.compileShader(shader)
      gl.attachShader(program, shader)

      gl.linkProgram(program)

      gl.bindBuffer(0x8892, gl.createBuffer()) // gl.ARRAY_BUFFER
      gl.bufferData(
        0x8892, // gl.ARRAY_BUFFER
        new Float32Array([1, 1, 1, -1, -1, 1, -1, -1]),
        0x88e4 // gl.STATIC_DRAW
      )

      gl.enableVertexAttribArray(0)
      gl.vertexAttribPointer(0, 2, 0x1406, false, 0, 0) // gl.FLOAT

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
          objects: [...Array(SPHERES)].map((_, i) =>
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

      window.requestAnimationFrame(render)
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
    analyser.getByteFrequencyData(fftDataArray)
    state.audio.beat = fftDataArray[state.audio.offset]
    dt = 0.5 * dt + (dt * state.audio.beat) / 32

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
    for (i = 0; i < SPHERES; i++)
      for (j = i + 1; j < SPHERES; j++)
        collisions(state.spheres.objects[i], state.spheres.objects[j])

    // Collisions with walls
    state.spheres.objects.forEach((sphere) => {
      for (i = 0; i < 3; i++) {
        let min = i == 1 ? state.box.y : -state.box.size,
          max = i == 1 ? state.box.size * 2 + state.box.y : state.box.size
        if (sphere.position[i] - sphere.radius < min) {
          sphere.velocity[i] = -sphere.velocity[i] * DAMPENING
          sphere.position[i] = min + sphere.radius
          sphere.illumination = 0.99
        }
        if (sphere.position[i] + sphere.radius > max) {
          sphere.velocity[i] = -sphere.velocity[i] * DAMPENING
          sphere.position[i] = max - sphere.radius
          sphere.illumination = 0.99
        }
      }
    })
  }

  function render() {
    state.now = performance.now() - state.epoch
    const dt = (state.now - state.lastRenderTime) / 1000
    state.lastRenderTime = state.now

    if (state.halt) {
      return
    }

    update(dt)

    if (
      window.innerWidth != state.resolution.x ||
      window.innerHeight != state.resolution.y
    ) {
      state.resolution.x = window.innerWidth
      state.resolution.y = window.innerHeight
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    gl.viewport(0, 0, state.resolution.x, state.resolution.y)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(0x4000)

    gl.useProgram(program)

    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), state.now)
    gl.uniform1f(gl.getUniformLocation(program, 'u_beat'), state.audio.beat)
    gl.uniform2f(
      gl.getUniformLocation(program, 'u_resolution'),
      state.resolution.x,
      state.resolution.y
    )
    gl.uniform1f(gl.getUniformLocation(program, 'u_fov'), state.camera.fov)
    gl.uniform3f(
      gl.getUniformLocation(program, 'u_camera'),
      state.camera.position.x,
      state.camera.position.y,
      state.camera.position.z
    )
    gl.uniform3f(
      gl.getUniformLocation(program, 'u_target'),
      state.camera.target.x,
      state.camera.target.y,
      state.camera.target.z
    )
    gl.uniform3f(
      gl.getUniformLocation(program, 'u_sun'),
      state.sun.x,
      state.sun.y,
      state.sun.z
    )
    gl.uniform3f(
      gl.getUniformLocation(program, 'u_fog_color'),
      ...div(state.fog.color, 255)
    )
    gl.uniform1f(
      gl.getUniformLocation(program, 'u_fog_intensity'),
      state.fog.intensity
    )
    gl.uniform3f(
      gl.getUniformLocation(program, 'u_sky_color'),
      ...div(state.sky.color, 255)
    )
    gl.uniform3f(
      gl.getUniformLocation(program, 'u_color_shift'),
      ...div(state.colorShift.colorShift, 255)
    )

    gl.uniform4fv(
      gl.getUniformLocation(program, 'u_spheres'),
      state.spheres.objects.flatMap((s) => [
        ...s.position,
        // w component of vec4 carries radius in its integer part,
        // illumination in the fraction part
        s.radius + s.illumination
      ])
    )

    gl.uniform1f(gl.getUniformLocation(program, 'u_box_y'), state.box.y)
    gl.uniform1f(gl.getUniformLocation(program, 'u_box_size'), state.box.size)

    gl.uniform3f(
      gl.getUniformLocation(program, 'u_palette_a'),
      ...div(state.palette.a, 255)
    )
    gl.uniform3f(
      gl.getUniformLocation(program, 'u_palette_b'),
      ...div(state.palette.b, 255)
    )
    gl.uniform3f(
      gl.getUniformLocation(program, 'u_palette_c'),
      ...div(state.palette.c, 255)
    )
    gl.uniform3f(
      gl.getUniformLocation(program, 'u_palette_d'),
      ...div(state.palette.d, 255)
    )
    gl.uniform1f(
      gl.getUniformLocation(program, 'u_palette_offset'),
      state.palette.offset
    )
    gl.uniform1f(
      gl.getUniformLocation(program, 'u_palette_range'),
      state.palette.range
    )
    gl.uniform1f(
      gl.getUniformLocation(program, 'u_palette_period'),
      state.palette.period
    )

    gl.drawArrays(5, 0, 4) // gl.TRIANGLE_STRIP

    window.requestAnimationFrame(render)
  }

  init()
}
