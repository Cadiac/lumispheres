precision highp float;

const float MAX_DIST = 200.0;
const float EPSILON = .0001;
const float PI = 3.14159;
const int MAX_ITERATIONS = 500;

uniform float u_time;
uniform float u_beat;
uniform float u_fov;
uniform vec2 u_resolution;

uniform vec3 u_camera;
uniform vec3 u_target;

uniform vec3 u_sun;
uniform vec3 u_fog_color;
uniform float u_fog_intensity;
uniform vec3 u_sky_color;
uniform vec3 u_color_shift;

uniform vec3 u_palette_a;
uniform vec3 u_palette_b;
uniform vec3 u_palette_c;
uniform vec3 u_palette_d;
uniform float u_palette_offset;
uniform float u_palette_range;
uniform float u_palette_period;

uniform float u_box_y;

const int SPHERES_COUNT = 13;
uniform vec4 u_spheres[SPHERES_COUNT];

struct Surface {
  int id;
  float dist;
};

struct Ray {
  Surface surface;
  vec3 pos;
  int steps;
  bool is_hit;
};

Surface opUnion(Surface a, Surface b) {
  if (a.dist < b.dist) {
    return a;
  }
  return b;
}

float dot2(vec3 v) { return dot(v, v); }

float udQuad(vec3 p, vec3 a, vec3 b, vec3 c, vec3 d) {
  vec3 ba = b - a;
  vec3 pa = p - a;
  vec3 cb = c - b;
  vec3 pb = p - b;
  vec3 dc = d - c;
  vec3 pc = p - c;
  vec3 ad = a - d;
  vec3 pd = p - d;
  vec3 nor = cross(ba, ad);

  return sqrt(
      (sign(dot(cross(ba, nor), pa)) + sign(dot(cross(cb, nor), pb)) +
           sign(dot(cross(dc, nor), pc)) + sign(dot(cross(ad, nor), pd)) <
       3.0)
          ? min(min(min(dot2(ba * clamp(dot(ba, pa) / dot2(ba), 0.0, 1.0) - pa),
                        dot2(cb * clamp(dot(cb, pb) / dot2(cb), 0.0, 1.0) -
                             pb)),
                    dot2(dc * clamp(dot(dc, pc) / dot2(dc), 0.0, 1.0) - pc)),
                dot2(ad * clamp(dot(ad, pd) / dot2(ad), 0.0, 1.0) - pd))
          : dot(nor, pa) * dot(nor, pa) / dot2(nor));
}

float sdSphere(vec3 p, float s) { return length(p) - s; }

float sdPlane(vec3 p, vec3 n, float h) {
  // n must be normalized
  return dot(p, n) + h;
}

vec4 currentSphere;
const int FLOOR_BOTTOM = 1;
const int FLOOR_TOP = 2;
const int FLOOR_LEFT = 3;
const int FLOOR_RIGHT = 4;
const int FLOOR_BACK = 5;
const int FLOOR_FRONT = 6;
const int SPHERE = 7;

Surface scene(in vec3 p) {
  float y = u_box_y;

  Surface surface = Surface(FLOOR_BOTTOM, sdPlane(p, vec3(0., 1., 0.), 0.));

  surface = opUnion(
      surface, Surface(FLOOR_BACK,
                       udQuad(p, vec3(10., y, -10.), vec3(10., 20. + y, -10.),
                              vec3(-10., 20. + y, -10.), vec3(-10., y, -10.))));

  surface =
      opUnion(surface, Surface(FLOOR_LEFT,
                               udQuad(p, vec3(10., y, 10.), vec3(10., y, -10.),
                                      vec3(10., 20. + y, -10.),
                                      vec3(10., 20. + y, 10.))));

  surface =
      opUnion(surface, Surface(FLOOR_RIGHT, udQuad(p, vec3(-10., y, 10.),
                                                   vec3(-10., y, -10.),
                                                   vec3(-10., 20. + y, -10.),
                                                   vec3(-10., 20. + y, 10.))));

  surface =
      opUnion(surface, Surface(FLOOR_TOP, udQuad(p, vec3(10., 20. + y, 10.),
                                                 vec3(-10., 20. + y, 10.),
                                                 vec3(-10., 20. + y, -10.),
                                                 vec3(10., 20. + y, -10.))));

  surface = opUnion(
      surface,
      Surface(FLOOR_BOTTOM, udQuad(p, vec3(10., y, 10.), vec3(-10., y, 10.),
                                   vec3(-10., y, -10.), vec3(10., y, -10.))));

  surface = opUnion(
      surface, Surface(FLOOR_FRONT,
                       udQuad(p, vec3(10., y, 10.), vec3(10., 20. + y, 10.),
                              vec3(-10., 20. + y, 10.), vec3(-10., y, 10.))));

  // surface = opUnion(surface, Surface(FLOOR_TOP, udQuad(p.xz, vec2(-10, 0),
  //                                                      vec2(10, 20), p.y)));

  // surface =
  //     opUnion(surface, Surface(FLOOR_TOP, sdPlane(p, vec3(0., -1.,
  //     0.), 20.0)));

  // surface = opUnion(surface,
  //                   Surface(FLOOR_LEFT, sdPlane(p, vec3(-1., 0.,
  //                   0.), 10.0)));

  // surface = opUnion(surface,
  //                   Surface(FLOOR_RIGHT, sdPlane(p, vec3(1., 0.,
  //                   0.), 10.0)));

  // surface =
  //     opUnion(surface, Surface(FLOOR_BACK, sdPlane(p, vec3(0.,
  //     0., 1.), 10.0)));

  for (int i = 0; i < SPHERES_COUNT; ++i) {
    Surface sphere = Surface(
        SPHERE + i, sdSphere(p - u_spheres[i].xyz, floor(u_spheres[i].w)));

    if (sphere.dist < surface.dist) {
      surface = sphere;
      currentSphere = u_spheres[i];
    }
  }

  return surface;
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

float sphereOcclusion(vec3 p, vec3 normal, vec4 sphere) {
  vec3 r = sphere.xyz - p;
  float l = length(r);
  float d = dot(normal, r);
  float res = d;

  float radius = floor(sphere.w);

  if (d < radius)
    res = pow(clamp((d + radius) / (2.0 * radius), 0.0, 1.0), 1.5) * radius;

  return clamp(res * (radius * radius) / (l * l * l), 0.0, 1.0);
}

float occlusion(vec3 p, vec3 normal) {
  float intensity = 1.0;

  for (int i = 0; i < SPHERES_COUNT; i++) {
    intensity *= 1.0 - sphereOcclusion(p, normal, u_spheres[i]);
  }

  return intensity;
}

float sphereLight(vec3 p, vec3 normal, vec4 sphere) {
  vec3 occ = sphere.xyz - p;
  float dist = sqrt(dot(occ, occ));
  vec3 dir = occ / dist;

  float c = dot(normal, dir);
  float s = floor(sphere.w) / dist;
  float i = fract(sphere.w);

  return max(0., c * s * i);
}

float sphIntersect(in vec3 p, in vec3 rayDir, in vec4 sphere) {
  vec3 rayOriginToSphereCenter = p - sphere.xyz;
  float radius = floor(sphere.w);
  float b = dot(rayOriginToSphereCenter, rayDir);
  float c =
      dot(rayOriginToSphereCenter, rayOriginToSphereCenter) - radius * radius;
  float h = b * b - c;

  if (h < 0.0) {
    return -1.0;
  }

  return -b - sqrt(h);
}

vec3 palette(in float t) {
  return u_palette_a +
         u_palette_b *
             cos(2. * PI *
                 (u_palette_c * (u_palette_offset +
                                 u_palette_range * sin(u_palette_period * t +
                                                       (u_time / 1000.))) +
                  u_palette_d));
}

vec3 shade(vec3 p, vec3 rayDir, vec3 normal, int id) {
  // vec3 base = id >= SPHERE ? vec3(0.6, 0.5, 0.4) : vec3(1.0);
  vec3 base = vec3(1.0);
  vec3 sphereLightColor = palette(float(id - SPHERE) / float(SPHERES_COUNT));

  float occ = occlusion(p, normal);
  float occFloor = 1. - sqrt((0.5 + 0.5 * -normal.y) / (p.y + 0.5)) * .5;

  vec3 light = vec3(0.0);

  for (int i = 0; i < SPHERES_COUNT; i++) {
    light += sphereLight(p, normal, u_spheres[i]) *
             palette(float(i) / float(SPHERES_COUNT));
  }

  vec3 color = base * occ * occFloor * 0.4;

  color += 1.0 * light + 1.0 * (id >= SPHERE
                                    ? sphereLightColor * fract(currentSphere.w)
                                    : vec3(0.0));

  return color;
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
      result.steps = i;
      break;
    }

    depth += result.surface.dist;

    if (depth >= MAX_DIST) {
      break;
    }
  }

  result.surface.dist = depth;

  return result;
}

float filteredGrid(in vec2 p, in vec2 ddx, in vec2 ddy) {
  // grid ratio
  float N = 60.0;

  // filter kernel
  vec2 w = max(abs(ddx), abs(ddy)) + 0.01;

  // analytic (box) filtering
  vec2 a = p + 0.5 * w;
  vec2 b = p - 0.5 * w;
  vec2 i =
      (floor(a) + min(fract(a) * N, 1.0) - floor(b) - min(fract(b) * N, 1.0)) /
      (N * w);

  // pattern
  return (1.0 - i.x) * (1.0 - i.y);
}

mat4 lookAt(vec3 camera, vec3 target, vec3 up) {
  vec3 f = normalize(target - camera);
  vec3 s = normalize(cross(up, f));
  vec3 u = cross(f, s);

  return mat4(vec4(s, .0), vec4(u, .0), vec4(-f, .0), vec4(.0, .0, .0, 1.));
}

vec3 render(vec3 camera, vec3 target, vec3 sunDir, vec2 xy, float z) {
  mat4 viewToWorld = lookAt(camera, target, normalize(vec3(0., 1., 0.)));

  vec3 viewDir = normalize(vec3(xy, -z));
  vec3 rayDir = (viewToWorld * vec4(viewDir, 0.0)).xyz;

  vec3 ddxDir =
      (viewToWorld * vec4(normalize(vec3(xy + vec2(1.0, 0.0), -z)), 0.0)).xyz;

  vec3 ddyDir =
      (viewToWorld * vec4(normalize(vec3(xy + vec2(0.0, 1.0), -z)), 0.0)).xyz;

  vec3 color = vec3(0.0);
  float fresnel = 1.0;
  float rayDist = 0.0;

  for (int i = 0; i < 5; i++) {
    Ray ray = rayMarch(camera, rayDir);

    if (!ray.is_hit) {
      color = mix(color, sky(camera, rayDir, sunDir), fresnel);
      float glare = clamp(dot(sunDir, rayDir), 0.0, 1.0);
      color += 0.5 * vec3(1., .5, .2) * pow(glare, 32.0);
      break;
    }
    rayDist += ray.surface.dist;

    vec3 normal;
    if (ray.surface.id == FLOOR_BOTTOM) {
      normal = vec3(.0, 1., 0.);
    } else if (ray.surface.id == FLOOR_TOP) {
      normal = vec3(.0, -1., 0.);
    } else if (ray.surface.id == FLOOR_LEFT) {
      normal = vec3(-1., 0., 0.);
    } else if (ray.surface.id == FLOOR_RIGHT) {
      normal = vec3(1., 0., 0.);
    } else if (ray.surface.id == FLOOR_BACK) {
      normal = vec3(0., 0., 1.);
    } else if (ray.surface.id == FLOOR_FRONT) {
      normal = vec3(0., 0., -1.);
    } else if (ray.surface.id >= SPHERE) {
      normal = normalize(ray.pos - currentSphere.xyz);
    }

    vec3 light = shade(ray.pos, rayDir, normal, ray.surface.id);

    color = mix(color, light, fresnel);

    // Fog
    vec3 fog = exp2(-rayDist * u_fog_intensity * u_color_shift);

    if (ray.surface.id >= SPHERE || ray.surface.id == FLOOR_LEFT ||
        ray.surface.id == FLOOR_RIGHT || ray.surface.id == FLOOR_BACK ||
        ray.surface.id == FLOOR_TOP || ray.surface.id == FLOOR_FRONT) {
      color = color * fog + (1. - fog) * u_fog_color;
      break;
    }

    fresnel = clamp(1. + dot(rayDir, normal), 0., 1.);
    fresnel = 0.5 + (0.01 + 0.4 * pow(fresnel, 3.5));

    // Analytically box-filtered grid by Inigo Quilez, MIT License
    // https://iquilezles.org/articles/filterableprocedurals
    vec3 ddx_pos =
        camera - ddxDir * dot(camera - ray.pos, normal) / dot(ddxDir, normal);
    vec3 ddy_pos =
        camera - ddyDir * dot(camera - ray.pos, normal) / dot(ddyDir, normal);
    vec2 ddx_uv = ddx_pos.xz - ray.pos.xz;
    vec2 ddy_uv = ddy_pos.xz - ray.pos.xz;

    float grid = filteredGrid(0.5 * ray.pos.xz, 0.5 * ddx_uv, 0.5 * ddy_uv);

    fresnel *= 0.5 * grid;
    color *= 1.0 * grid;

    color = color * fog + (1. - fog) * u_fog_color;

    camera = ray.pos;
    rayDir = reflect(rayDir, normal);
  }

  return color;
}

void main() {
  vec2 xy = gl_FragCoord.xy - u_resolution / 2.0;
  float z = u_resolution.y / tan(radians(u_fov) / 2.0);

  vec3 sunDir = normalize(u_sun);

  // mat4 viewToWorld =
  //     lookAt(u_camera, u_target,
  //            normalize(vec3(sin(u_time / 10000.), cos(u_time / 10000.),
  //            0.)));

  vec3 color = render(u_camera, u_target, sunDir, xy, z);

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