precision highp float;

const float MAX_DIST = 250.0;
const float EPSILON = .0001;
const float PI = 3.14159265;
const int MAX_ITERATIONS = 100;

uniform float u_time;
uniform float u_fov;
uniform vec2 u_resolution;

uniform vec3 u_camera;
uniform vec3 u_target;

uniform vec3 u_sun;
uniform vec3 u_fog_color;
uniform float u_fog_intensity;
uniform vec3 u_sky_color;
uniform vec3 u_color_shift;

struct Material {
  vec3 diffuse;
  vec3 ambient;
  vec3 specular;
  float hardness;
  float reflectivity;
};

struct Surface {
  int id;
  float dist;
  Material material;
};

struct Ray {
  Surface surface;
  vec3 pos;
  bool is_hit;
};

mat4 lookAt(vec3 camera, vec3 target, vec3 up) {
  vec3 f = normalize(target - camera);
  vec3 s = normalize(cross(up, f));
  vec3 u = cross(f, s);

  return mat4(vec4(s, .0), vec4(u, .0), vec4(-f, .0), vec4(.0, .0, .0, 1.));
}

// Noise functions
float hash1(float n) { return fract(n * 17.0 * fract(n * 0.3183099)); }

float noise(in vec3 x) {
  vec3 p = floor(x);
  vec3 w = fract(x);

  vec3 u = w * w * (3.0 - 2.0 * w);
  float n = p.x + 317.0 * p.y + 157.0 * p.z;

  float a = hash1(n + 0.0);
  float b = hash1(n + 1.0);
  float c = hash1(n + 317.0);
  float d = hash1(n + 318.0);
  float e = hash1(n + 157.0);
  float f = hash1(n + 158.0);
  float g = hash1(n + 474.0);
  float h = hash1(n + 475.0);

  float k0 = a;
  float k1 = b - a;
  float k2 = c - a;
  float k3 = e - a;
  float k4 = a - b - c + d;
  float k5 = a - c - e + g;
  float k6 = a - b - e + f;
  float k7 = -a + b + c - d + e - f - g + h;

  return -1.0 + 2.0 * (k0 + k1 * u.x + k2 * u.y + k3 * u.z + k4 * u.x * u.y +
                       k5 * u.y * u.z + k6 * u.z * u.x + k7 * u.x * u.y * u.z);
}

float fbm(in vec3 x) {
  float f = 2.0;
  float s = 0.5;
  float a = 0.0;
  float b = 0.5;
  for (int i = 0; i < 7; i++) {
    float n = noise(x);
    a += b * n;
    b *= s;
    x = f * mat3(0.00, 0.80, 0.60, -0.80, 0.36, -0.48, -0.60, -0.48, 0.64) * x;
  }
  return a;
}

float dot2(in vec2 v) { return dot(v, v); }
float dot2(in vec3 v) { return dot(v, v); }
float ndot(in vec2 a, in vec2 b) { return a.x * b.x - a.y * b.y; }

float opUnion(float d1, float d2) { return min(d1, d2); }
float opSubtraction(float d1, float d2) { return max(-d1, d2); }
float opIntersection(float d1, float d2) { return max(d1, d2); }
float opXor(float d1, float d2) { return max(min(d1, d2), -max(d1, d2)); }

float opSmoothUnion(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
  return mix(d2, d1, h) - k * h * (1.0 - h);
}

float opSmoothSubtraction(float d1, float d2, float k) {
  float h = clamp(0.5 - 0.5 * (d2 + d1) / k, 0.0, 1.0);
  return mix(d2, -d1, h) + k * h * (1.0 - h);
}

float opSmoothIntersection(float d1, float d2, float k) {
  float h = clamp(0.5 - 0.5 * (d2 - d1) / k, 0.0, 1.0);
  return mix(d2, d1, h) + k * h * (1.0 - h);
}

float sdCircle(vec2 p, float r) { return length(p) - r; }

float sdBox(in vec2 p, in vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

// c is the sin/cos of the angle. r is the radius
float sdPie(in vec2 p, in vec2 c, in float r) {
  p.x = abs(p.x);
  float l = length(p) - r;
  float m = length(p - c * clamp(dot(p, c), 0.0, r));
  return max(l, m * sign(c.y * p.x - c.x * p.y));
}

float sdCutDisk(in vec2 p, in float r, in float h) {
  float w = sqrt(r * r - h * h);
  p.x = abs(p.x);

  float s =
      max((h - r) * p.x * p.x + w * w * (h + r - 2.0 * p.y), h * p.x - w * p.y);
  return (s < 0.0)   ? length(p) - r
         : (p.x < w) ? h - p.y
                     : length(p - vec2(w, h));
}

mat2 rotate(float theta) {
  return mat2(vec2(cos(theta), -sin(theta)), vec2(sin(theta), cos(theta)));
}

float sdSphere(vec3 p, float s) { return length(p) - s; }

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdVesicaSegment(in vec3 p, in vec3 a, in vec3 b, in float w) {
  vec3 c = (a + b) * 0.5;
  float l = length(b - a);
  vec3 v = (b - a) / l;
  float y = dot(p - c, v);
  vec2 q = vec2(length(p - c - y * v), abs(y));

  float r = 0.5 * l;
  float d = 0.5 * (r * r - w * w) / w;
  vec3 h = (r * q.x < d * (q.y - r)) ? vec3(0.0, r, 0.0) : vec3(-d, 0.0, d + w);

  return length(q - h.xy) - h.z;
}

float sdVerticalCapsule(vec3 p, float h, float r) {
  p.y -= clamp(p.y, 0.0, h);
  return length(p) - r;
}

// Translations
// http://en.wikipedia.org/wiki/Rotation_matrix#Basic_rotations
mat3 tRotateX(float theta) {
  float s = sin(theta);
  float c = cos(theta);

  return mat3(vec3(1, 0, 0), vec3(0, c, -s), vec3(0, s, c));
}

mat3 tRotateY(float theta) {
  float s = sin(theta);
  float c = cos(theta);

  return mat3(vec3(c, 0, s), vec3(0, 1, 0), vec3(-s, 0, c));
}

mat3 tRotateZ(float theta) {
  float s = sin(theta);
  float c = cos(theta);

  return mat3(vec3(c, -s, 0), vec3(s, c, 0), vec3(0, 0, 1));
}

float opExtrusion(in vec3 p, in float sdf, in float h) {
  vec2 w = vec2(sdf, abs(p.z) - h);
  return min(max(w.x, w.y), 0.0) + length(max(w, 0.0));
}

float sdWingSegment(in vec2 p) {
  float t = 3.14 * 0.45;

  vec2 q = (p - vec2(0.4, -0.5)) * rotate(2.0 * 3.14 - t);

  float sector = opSubtraction(sdBox(q - vec2(-1.0, 0.5), vec2(1.0, 1.0)),
                               sdCutDisk(q, 1.0, 0.2));

  float hole1 = sdCircle(q - vec2(0.2, 0.2), 0.2);
  float hole2 = sdCircle(q - vec2(0.4, 0.2), 0.2);
  float hole3 = sdCircle(q - vec2(0.6, 0.2), 0.2);
  float hole4 = sdCircle(q - vec2(0.78, 0.2), 0.2);

  float holes = opUnion(opUnion(hole1, hole2), opUnion(hole3, hole4));

  float d = opUnion(holes, sector);

  return d;
}

float sdWing(in vec2 p) {
  float bound = sdCircle(p - vec2(1.0, 0.0), 1.0);
  float dist =
      opUnion(sdWingSegment(vec2(p.x - 0.5, p.y - 0.2)),
              sdWingSegment(1.3 * rotate(5.4) * vec2(p.x - 0.3, p.y + 0.35)));

  return opIntersection(bound, dist);
}

float sdButterfly(in vec3 p) {
  vec3 r = p * tRotateZ(3.1415 / 2.0);

  float t = abs(cos(2.9 * sin(u_time / 600.)));

  vec3 q = r * tRotateY(-3.1415 * t);
  vec3 qq = r * tRotateY(3.1415 * t);

  float wing1 = opExtrusion(q, sdWing(q.xy), 0.0001);
  float wing2 = opExtrusion(qq, sdWing(qq.xy), 0.0001);

  float dist =
      opUnion(opUnion(wing1, wing2),
              sdVerticalCapsule((r - vec3(0., -0.1, 0.0)) * tRotateZ(-0.1),
                                0.35, 0.03));

  return dist;
}

Surface scene(in vec3 p) {
  float dist =
      sdButterfly(p - vec3(2. * sin(u_time / 5000.), 1. * cos(u_time / 200.),
                           2. * cos(u_time / 3000.)));

  vec3 col = vec3(0, 0.83, 1.0);

  Material material = Material(col, 0.2 * col, col, 1., 0.2);

  return Surface(1, dist, material);
}

vec3 sky(in vec3 camera, in vec3 dir, in vec3 sunDir) {
  // Deeper blue when looking up
  vec3 color = u_sky_color - .5 * dir.y;

  // Fade to fog further away
  float dist = (25000. - camera.y) / dir.y;
  vec3 e = exp2(-abs(dist) * .00001 * u_color_shift);
  color = color * e + (1.0 - e) * u_fog_color;

  // Sun
  float dotSun = dot(sunDir, dir);
  if (dotSun > .9999) {
    color = vec3(0.9);
  }

  return color;
}

float softShadows(in vec3 sunDir, in vec3 p, float k) {
  float opacity = 1.;
  float depth = 0.;

  for (int s = 0; s < MAX_ITERATIONS; ++s) {
    if (depth >= MAX_DIST) {
      return opacity;
    }

    Surface surface = scene(p + depth * sunDir);
    if (surface.dist < EPSILON) {
      return 0.;
    }
    opacity = min(opacity, k * surface.dist / depth);
    depth += surface.dist;
  }

  return opacity;
}

vec3 lightning(in vec3 sunDir, in vec3 normal, in vec3 p, in vec3 rayDir,
               in float rayDist, Material material) {
  vec3 ambient = material.ambient;

  float shadow = softShadows(sunDir, p, 10.0);
  float dotLN = clamp(dot(sunDir, normal) * shadow, 0., 1.);
  vec3 diffuse = material.diffuse * dotLN;

  float dotRV = clamp(dot(reflect(sunDir, normal), rayDir), 0., 1.);
  vec3 specular = material.specular * pow(dotRV, material.hardness);

  vec3 color = ambient + diffuse + specular;

  // Fog
  vec3 e = exp2(-rayDist * u_fog_intensity * u_color_shift);
  return color * e + (1. - e) * u_fog_color;
}

Ray rayMarch(in vec3 camera, in vec3 rayDir) {
  float stepDist = EPSILON;
  float dist = EPSILON;
  float depth = EPSILON;

  Ray result;

  for (int i = 0; i < MAX_ITERATIONS; i++) {
    stepDist = 0.001 * depth;

    result.pos = camera + depth * rayDir;
    result.surface = scene(result.pos);

    if (result.surface.dist < stepDist) {
      result.is_hit = true;
      break;
    }

    depth += result.surface.dist * 0.5;

    if (depth >= MAX_DIST) {
      break;
    }
  }

  result.surface.dist = depth;

  return result;
}

vec3 render(vec3 camera, vec3 rayDir, vec3 sunDir) {
  vec3 color = vec3(0.0);
  float reflection = 1.0;
  vec3 dir = rayDir;

  float rayDist = 0.0;
  Ray ray = rayMarch(camera, dir);

  for (int i = 0; i < 5; i++) {
    if (!ray.is_hit) {
      color = mix(color, sky(camera, dir, sunDir), reflection);
      break;
    }

    rayDist += ray.surface.dist;

    // Tetrahedron technique, https://iquilezles.org/articles/normalsSDF/
    const vec2 k = vec2(1, -1);
    vec3 normal = normalize(k.xyy * scene(ray.pos + k.xyy * EPSILON).dist +
                            k.yyx * scene(ray.pos + k.yyx * EPSILON).dist +
                            k.yxy * scene(ray.pos + k.yxy * EPSILON).dist +
                            k.xxx * scene(ray.pos + k.xxx * EPSILON).dist);

    vec3 newColor =
        lightning(sunDir, normal, ray.pos, dir, rayDist, ray.surface.material);

    color = mix(color, newColor, reflection);

    reflection *= ray.surface.material.reflectivity;
    if (reflection < EPSILON) {
      break;
    }

    dir = reflect(dir, normal);
    ray = rayMarch(ray.pos, dir);
  }

  // Add sun glare to sky (TODO: and the ground plane ?)
  if (!ray.is_hit) {
    float glare = clamp(dot(sunDir, dir), 0.0, 1.0);
    color += 0.5 * vec3(1., .5, .2) * pow(glare, 32.0);
  }
  return color;
}

void main() {
  vec2 xy = gl_FragCoord.xy - u_resolution / 2.0;
  float z = u_resolution.y / tan(radians(u_fov) / 2.0);
  vec3 viewDir = normalize(vec3(xy, -z));

  vec3 sunDir = normalize(u_sun);
  mat4 viewToWorld = lookAt(u_camera, u_target, normalize(vec3(0., 1., 0.)));
  vec3 worldDir = (viewToWorld * vec4(viewDir, 0.0)).xyz;

  vec3 color = render(u_camera, worldDir, sunDir);

  color = pow(color, u_color_shift);
  color *= vec3(1.02, 0.99, 0.9);
  color.z = color.z + 0.1;

  color = smoothstep(0.0, 1.0, color);

  // Fade in
  if (u_time < 1000.) {
    color = mix(color, vec3(0.), (1000. - u_time) / 1000.);
  }

  gl_FragColor = vec4(color, 1.0);
}