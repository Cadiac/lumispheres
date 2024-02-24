function C(s) {
  let r = s,
    n = s.e,
    i = 0,
    t = s.r * s.p * (n + 1) * 2,
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
      return i++, i / r.n
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

S = (r) => ({
  p: [0, 10, 0],
  v: div([r, r, r], 3),
  i: 0,
  r,
  m: 4 * r ** 3
})

e = () => {
  // longer: https://sb.bitsnbites.eu/?data=U0JveA4C7d09axRBGADgd_cuQST4UQoK1ylYpIggKEIawS5ILAKCsUwhCBIEC8lxR1gSjosSIiIk-QH-AAsrf4W_QCzzE879unycHBamSC7PM_MOM7Ozu7PDdW9xP29EXI_WpbjZjjxmImbiSVTSQURrsdFpNnJJerx0YytfsFWt2-pGJ_p5p1-N-53Y3IxPUUSuaDY2oiq5nXJlP76UUdSIXl4-l1HUiI9lzWN3t3zkdlnz2N-P05DVj6sensV6_bp6i8V-d2Kj3GrZDL-n1yu32hvd73C8XZdDH6ozKdv8S9eLl6z___67I-PR8z_rhuc8zvCcx13_65xHnNY5AwAAAAAAF8jzdsTymHRZMTiZLlsdufvtOfvadyPjN2Pmh7p-IAAAAAAAAJNtsLqQRyxGc_rxvWoqvRLRKntJpCfTZVl9VxbZuf7q7DCyY30AAAAAAAAunl4VT5uXZ-_n3e9TkRxk0Xo1da1ZLTiRLqtVV46STMfbsyz7RwAAAAAAAHDRtKt4H8nDeib58TVu3W4sNerhsSKlBAAAAAAAwERZW5mPzkrM_2reuTuXj39PJ41vV6PVbh6tOUqXFaTMAAAAAAAAmBSNQTti0ItYS9PZR_nEy0bSeLEQy8_SmcOE2cl0mYQZAAAAAAAAk6P-77LB3t5eMZxLk_TBQbSWkt30KEE29Np5AQAAAAAAMEH-AA
  // shorter: https://sb.bitsnbites.eu/?data=U0JveA4C7d3NahNRFADgMzOpiBR1Kyhkp-CiiwqCInQjuCtSFwXBuuxCEKQILqQhoQwtoVVKRYS2D-ADuHDlU_gE4rKPEOcvaYkEF3bRpt9351zuufOTO5fsDiE_b0TMRvty3OxEEbNl9iRq6SCivZR1W1khSesWvdgpzu3Ul-z0ohvbxWC7zre7sbUVn6KMQtltbkbdCnvVldvxpYryiOgX7XMV5RHxsTqK2N-vHrlbHUUcHsZpyJvH1Q_PY6P5uGaJ5Xr3YrNaatUN36ffr5baH1_vMN9t2siHek-qvnjTjfJDNv5__b2xfHz_z7rhPk8y3OdJ5__a5zGntc8AAAAAAMAF8rwTsTKhUlYmo0rZ2tiNb8_Zi74by99MmB_q-W4AAAAAAABMt8HaYhGxFK1Lj-_VU-nViHY1SiIdVcry5oZ8NDqf8lHkJ8YAAAAAAABcPP06nrauzN0vht9nIjnKo_1q5nqrLJUNf1UWeaO-67i-dLI_y_J_BAAAAAAAABdNp473kTxsZpIfX-PW7Ww5KwtlSdNUkwAAAAAAAJgu66sL0V2NhV-tO3fni_z3pST7di3andbxNVWlrKRaBgAAAAAAwLTIBp2IQT9iPU3nHhUTL7Mke7EYK8_S2VGtbFQpUysDAAAAAABgejT_UzY4ODgo0_k0SR8cRXs52U9PVMgieW2rAAAAAAAAmCJ_AA
  // prettier-ignore
  m = new C({s:[{i:[0,28,128,0,0,28,128,12,0,0,12,0,72,0,0,0,0,0,0,0,2,255,0,0,32,83,3,130,4],p:[3,3,3,3,1,2,1,2,1,2,1,2],c:[{n:[131,,143,,,,143,,,,,,,143,131,,130,,142,,,,142,,,,,,,142,130,,138,138,,150,,138,,150,,,,,150,,,,137,137,,137,,137,,137,,,,,149,,,,142,,142,,154,,142,,154,,,154,,,,,140,,140,,152,,140,,152,,,152,,,,,145,,,145,,,,145,,157,157,,,,,,147,,,147,,,,147,,159,159],f:[]},{n:[135,,147,,,,147,,,,,,,147,135,,133,,145,,,,145,,137,,137,,,,,,137,137,,149,,137,,149,,,,,149,,,,138,138,,150,,138,,150,140,140,,140,,140,,140,140,,140,,152,,140,,152,,,152,,,,,140,,140,,152,,140,,147,,147,,147,,147,,,,,,,,,,,144,142,,,,,,142,,,,,154,,,133,,,145,,133],f:[]},{n:[131,,,,,,,,,,,,,,,,130,,142,,,,142,,,,,,,142,130],f:[]}]},{i:[0,91,128,0,0,95,128,12,0,0,12,0,72,0,0,0,0,0,0,0,2,255,0,0,32,83,3,130,4],p:[,,,,1,2,1,2,1,2,1,2],c:[{n:[116,,,,,,,,,,,,,,,,118],f:[]},{n:[121,,,,,,,,,,,,,,,,114,,,,,,,,121,,,,,,,,,,,,,,,,,,,,,,,,131],f:[]}]},{i:[0,255,116,79,0,255,116,0,83,0,4,6,69,52,0,0,0,0,0,0,2,14,0,0,32,0,0,0,0],p:[,1,,2,1,2,1,2,1,2,1,2],c:[{n:[135,,,,,,,,135,,135],f:[]},{n:[,,,,,,,,135,,,,135,,,,135,,135,,135,,,,135,,,,135],f:[]}]},{i:[0,0,140,0,0,0,140,0,0,81,4,10,47,55,0,0,0,187,5,0,1,239,135,0,32,108,5,16,4],p:[,,1,,,,1,2,1,2,1,2],c:[{n:[135,135,135,135,135,135,135,135,,,,,,,135,,,,135,,,,,,135,,,,,,135],f:[]},{n:[135,,,,135,,,,135,,,,135,,,,135,,,,135,,,,135,,,,135],f:[]}]},{i:[0,0,128,0,0,0,128,0,0,125,0,1,59,0,0,0,0,0,0,0,1,193,171,0,29,39,3,88,3],p:[,1,,,1,,1,,1,,1],c:[{n:[135],f:[]}]},{i:[0,127,104,64,0,130,104,0,64,229,4,40,43,51,0,0,0,231,6,1,3,183,15,0,32,128,4,0,0],p:[,,,,,,,,1,,1],c:[{n:[,,,,135],f:[]}]},{i:[3,255,128,0,0,255,140,0,0,127,2,2,47,61,0,0,0,96,3,1,3,94,79,0,95,84,2,12,4],p:[,,,,,,,,1,,1],c:[{n:[,,,,,,135],f:[]}]},{i:[0,0,140,0,0,0,140,0,0,255,158,158,158,0,0,0,0,51,2,1,2,58,239,0,32,88,1,157,2],p:[1,,1,,,,,,,,,,1],c:[{n:[111],f:[]}]}],r:6615,p:32,e:12,n:8})
  a = new AudioContext()

  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape') {
        s.halt = !s.halt
        a.close()
      }
    },
    true
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
        `precision highp float;uniform float v,z,d;uniform vec2 m;uniform vec3 f,a,c,k;uniform float h;uniform vec3 i,y,l,s,n,w;uniform float r,C,F,e,p;uniform vec4 g[13];struct R{vec2 d;vec3 m;int i;bool h;};vec2 t(vec2 p,vec2 d){return p.y<d.y?p:d;}float t(vec3 v){return dot(v,v);}float t(vec3 p,vec3 v,vec3 m,vec3 f,vec3 z){vec3 d=m-v,y=p-v,c=f-m,x=p-m,n=z-f,w=p-f,i=v-z,a=p-z,r=cross(d,i);return sqrt(sign(dot(cross(d,r),y))+sign(dot(cross(c,r),x))+sign(dot(cross(n,r),w))+sign(dot(cross(i,r),a))<3.?min(min(min(t(d*clamp(dot(d,y)/t(d),0.,1.)-y),t(c*clamp(dot(c,x)/t(c),0.,1.)-x)),t(n*clamp(dot(n,w)/t(n),0.,1.)-w)),t(i*clamp(dot(i,a)/t(i),0.,1.)-a)):dot(r,y)*dot(r,y)/t(r));}vec4 x;vec2 D(vec3 v){float m=e;vec2 d=vec2(1,dot(v,vec3(0,1,0)));d=t(d,vec2(5,t(v,vec3(p,m,-p),vec3(p,2.*p+m,-p),vec3(-p,2.*p+m,-p),vec3(-p,m,-p))));d=t(d,vec2(3,t(v,vec3(p,m,p),vec3(p,m,-p),vec3(p,2.*p+m,-p),vec3(p,2.*p+m,p))));d=t(d,vec2(4,t(v,vec3(-p,m,p),vec3(-p,m,-p),vec3(-p,2.*p+m,-p),vec3(-p,2.*p+m,p))));d=t(d,vec2(2,t(v,vec3(p,2.*p+m,p),vec3(-p,2.*p+m,p),vec3(-p,2.*p+m,-p),vec3(p,2.*p+m,-p))));d=t(d,vec2(1,t(v,vec3(p,m,p),vec3(-p,m,p),vec3(-p,m,-p),vec3(p,m,-p))));for(int f=0;f<13;++f){vec2 c=vec2(7.+float(f),length(v-g[f].xyz)-floor(g[f].w));if(c.y<d.y)d=c,x=g[f];}return d;}vec3 D(vec3 p,vec3 d){vec3 v=exp2(-abs((2.5e4-p.y)/d.y)*1e-5*y);return(i-.5*d.y)*v+(1.-v)*k;}float D(vec3 p,vec3 v,vec4 d){vec3 m=d.xyz-p;float c=length(m),f=dot(v,m),y=f,i=floor(d.w);if(f<i)y=pow(clamp((f+i)/(2.*i),0.,1.),1.5)*i;return clamp(i*i*y/(c*c*c),0.,1.);}float B(vec3 v,vec3 p){float d=1.;for(int f=0;f<13;f++)d*=1.-D(v,p,g[f]);return d;}float B(vec3 p,vec3 v,vec4 d){vec3 m=d.xyz-p;float y=sqrt(dot(m,m));return max(0.,dot(v,m/y)*(floor(d.w)/y)*fract(d.w));}vec3 B(float p){return l+s*cos(6.283184*(n*(r+C*sin(F*p+v/1e3))+w));}vec3 B(vec3 d,vec3 m,vec3 p,float v){vec3 f=B(v-7./float(13));float c=B(d,p);vec3 y=vec3(0);for(int i=0;i<13;i++)y+=B(d,p,g[i])*B(float(i)/float(13));vec3 i=vec3(1)*c*(1.-sqrt((.5+.5*-p.y)/(d.y+.5))*.5)*.4;i+=y+(v>=7.?f*fract(x.w):vec3(0));return i;}R A(vec3 p,vec3 d){float v=1e-4,m=1e-4;R f;for(int i=0;i<500;i++){v=.001*m;f.m=p+m*d;f.d=D(f.m);if(f.d.y<v){f.h=true;f.i=i;break;}m+=f.d.y;if(m>=2e2)break;}f.d.y=m;return f;}float A(vec2 p,vec2 v,vec2 d){vec2 m=max(abs(v),abs(d))+.01,y=p+.5*m,i=p-.5*m,f=(floor(y)+min(fract(y)*60.,1.)-floor(i)-min(fract(i)*60.,1.))/(60.*m);return(1.-f.x)*(1.-f.y);}mat4 E(vec3 p,vec3 v){vec3 m=normalize(v-p),d=normalize(cross(normalize(vec3(0,1,0)),m));return mat4(vec4(d,0),vec4(cross(m,d),0),vec4(-m,0),vec4(0,0,0,1));}vec3 A(vec3 v,vec3 p,vec3 d,vec2 m,float f){mat4 i=E(v,p);vec3 c=(i*vec4(normalize(vec3(m,-f)),0)).xyz,n=(i*vec4(normalize(vec3(m+vec2(1,0),-f)),0)).xyz,r=(i*vec4(normalize(vec3(m+vec2(0,1),-f)),0)).xyz,z=vec3(0);float w=1.,a=0.;for(int u=0;u<5;u++){R g=A(v,c);if(!g.h){z=mix(z,D(v,c),w);float s=clamp(dot(d,c),0.,1.);z+=.5*vec3(1,.5,.2)*pow(s,32.);break;}a+=g.d.y;vec3 s;s=g.d.x>=7.?normalize(g.m-x.xyz):g.d.x==1.?vec3(0,1,0):g.d.x==2.?vec3(0,-1,0):g.d.x==3.?vec3(-1,0,0):g.d.x==4.?vec3(1,0,0):g.d.x==5.?vec3(0,0,1):vec3(0,0,-1);vec3 l=B(g.m,c,s,g.d.x);z=mix(z,l,w);vec3 t=exp2(-a*h*y);if(g.d.x!=1.){z=z*t+(1.-t)*k;break;}w=clamp(1.+dot(c,s),0.,1.);w=.01+.4*pow(w,3.5)+.5;vec3 F=v-n*dot(v-g.m,s)/dot(n,s),C=v-r*dot(v-g.m,s)/dot(r,s);float e=A(.5*g.m.xz,.5*(F.xz-g.m.xz),.5*(C.xz-g.m.xz));w*=.5*e;z*=e;z=z*t+(1.-t)*k;v=g.m;c=reflect(c,s);}return z;}void main(){vec2 p=gl_FragCoord.xy-m/2.;vec3 i=A(f,a,normalize(c),p,m.y/tan(radians(d)/2.));i=pow(i,y);i*=vec3(1.02,.99,.9);i.z=i.z+.1;i=smoothstep(0.,1.,i);if(v<2e3)i=mix(i,vec3(0),(2e3-v)/2e3);gl_FragColor=vec4(i,1);}`
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

      s = {
        halt: false,
        epoch: performance.now(),
        now: 0,
        dt: 0,
        lastRenderTime: 0,
        r: [0, 0],
        g: [0, 0, 0],
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
        p: {
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
        s: [...Array(13)].map((_, i) => S((i % 3) + 1)),
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

  function update(dt) {
    // Slowing and speeding up the time based on beat
    n.getByteFrequencyData(f)
    dt = 0.5 * dt + (dt * f[s.audio.offset]) / 32

    // Gravity & fading the illuminated spheres over time
    s.s.map((sphere) => {
      sphere.i = Math.max(0, sphere.i - 6 * dt * (1 - sphere.i))
      sphere.v = add(sphere.v, mul(s.g, [dt, dt, dt]))
      sphere.p = add(sphere.p, mul(sphere.v, [dt, dt, dt]))
    })

    // Spheres colliding with each other
    for (i = 0; i < 13; i++)
      for (j = i + 1; j < 13; j++) collisions(s.s[i], s.s[j])

    // Collisions with walls
    s.s.map((sphere) => {
      for (i = 0; i < 3; i++) {
        let min = i == 1 ? s.box.y : -s.box.size,
          max = i == 1 ? s.box.size * 2 + s.box.y : s.box.size
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
    s.now = performance.now() - s.epoch
    const dt = (s.now - s.lastRenderTime) / 1000
    s.lastRenderTime = s.now

    if (s.halt) {
      return
    }

    update(dt)

    if (window.innerWidth != s.r[0] || window.innerHeight != s.r[1]) {
      s.r = [window.innerWidth, window.innerHeight]
      c.width = window.innerWidth
      c.height = window.innerHeight
    }

    g.viewport(0, 0, ...s.r)
    g.clearColor(0, 0, 0, 1)
    g.clear(0x4000)

    g.useProgram(p)

    u('v', s.now)
    u('z', f[s.audio.offset])
    u('d', s.camera.fov)
    u('m', ...s.r)
    u('f', s.camera.position.x, s.camera.position.y, s.camera.position.z)
    u('a', s.camera.target.x, s.camera.target.y, s.camera.target.z)
    u('c', s.sun.x, s.sun.y, s.sun.z)
    u('k', ...div(s.fog.color, 255))
    u('h', s.fog.intensity)
    u('i', ...div(s.sky.color, 255))
    u('y', ...div(s.colorShift.colorShift, 255))

    u('l', ...div(s.p.a, 255))
    u('s', ...div(s.p.b, 255))
    u('n', ...div(s.p.c, 255))
    u('w', ...div(s.p.d, 255))
    u('r', s.p.offset)
    u('C', s.p.range)
    u('F', s.p.period)

    u('e', s.box.y)
    u('p', s.box.size)

    u(
      'g',
      s.s.flatMap((s) => [
        ...s.p,
        // w component of vec4 carries radius in its integer part,
        // illumination in the fraction part
        s.r + s.i
      ])
    )

    g.drawArrays(5, 0, 4)

    window.requestAnimationFrame(render)
  }

  init()
}
