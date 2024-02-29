precision highp float;

uniform float u_time;
uniform vec3 u_resolution;
uniform vec3 u_camera;
uniform vec3 u_target;

const float MAX_DIST = 2000.0;
const float EPSILON = .0001;
const int MAX_ITERATIONS = 500;

const vec3 FOG_COLOR = vec3(0.5, 0.3, 0.2);
const vec3 SKY_COLOR = vec3(0.9, 0.96, 0.91);

const float BOX_SIZE = 10.;
const float BOX_Y = 10.;

const int SPHERES_COUNT = 13;
uniform vec4 u_spheres[SPHERES_COUNT];

struct R {
  vec2 d;
  vec3 m;
  int i;
  bool h;
};

vec2 opUnion(vec2 a, vec2 b) {
  if (a.y < b.y) {
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

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

vec4 currentSphere;
const float FLOOR_BOTTOM = 1.;
const float FLOOR_TOP = 2.;
const float FLOOR_LEFT = 3.;
const float FLOOR_RIGHT = 4.;
const float FLOOR_BACK = 5.;
const float FLOOR_FRONT = 6.;
const float SPHERE = 7.;

vec2 scene(in vec3 p) {
  vec2 terrain = vec2(FLOOR_BOTTOM, sdPlane(p, vec3(0., 1., 0.), 0.));

  float box_bounds = sdBox(p - vec3(0., 2. * BOX_Y, 0.), vec3(BOX_SIZE));
  if (box_bounds < terrain.y) {
    vec2 box = vec2(FLOOR_BACK,
                    udQuad(p, vec3(BOX_SIZE, BOX_Y, -BOX_SIZE),
                           vec3(BOX_SIZE, 2. * BOX_SIZE + BOX_Y, -BOX_SIZE),
                           vec3(-BOX_SIZE, 2. * BOX_SIZE + BOX_Y, -BOX_SIZE),
                           vec3(-BOX_SIZE, BOX_Y, -BOX_SIZE)));

    box = opUnion(
        box, vec2(FLOOR_LEFT,
                  udQuad(p, vec3(BOX_SIZE, BOX_Y, BOX_SIZE),
                         vec3(BOX_SIZE, BOX_Y, -BOX_SIZE),
                         vec3(BOX_SIZE, 2. * BOX_SIZE + BOX_Y, -BOX_SIZE),
                         vec3(BOX_SIZE, 2. * BOX_SIZE + BOX_Y, BOX_SIZE))));

    box = opUnion(
        box, vec2(FLOOR_RIGHT,
                  udQuad(p, vec3(-BOX_SIZE, BOX_Y, BOX_SIZE),
                         vec3(-BOX_SIZE, BOX_Y, -BOX_SIZE),
                         vec3(-BOX_SIZE, 2. * BOX_SIZE + BOX_Y, -BOX_SIZE),
                         vec3(-BOX_SIZE, 2. * BOX_SIZE + BOX_Y, BOX_SIZE))));

    box = opUnion(
        box, vec2(FLOOR_TOP,
                  udQuad(p, vec3(BOX_SIZE, 2. * BOX_SIZE + BOX_Y, BOX_SIZE),
                         vec3(-BOX_SIZE, 2. * BOX_SIZE + BOX_Y, BOX_SIZE),
                         vec3(-BOX_SIZE, 2. * BOX_SIZE + BOX_Y, -BOX_SIZE),
                         vec3(BOX_SIZE, 2. * BOX_SIZE + BOX_Y, -BOX_SIZE))));

    box = opUnion(box,
                  vec2(FLOOR_BOTTOM, udQuad(p, vec3(BOX_SIZE, BOX_Y, BOX_SIZE),
                                            vec3(-BOX_SIZE, BOX_Y, BOX_SIZE),
                                            vec3(-BOX_SIZE, BOX_Y, -BOX_SIZE),
                                            vec3(BOX_SIZE, BOX_Y, -BOX_SIZE))));

    for (int i = 0; i < SPHERES_COUNT; ++i) {
      vec2 sphere = vec2(SPHERE + float(i),
                         sdSphere(p - u_spheres[i].xyz, floor(u_spheres[i].w)));

      if (sphere.y < box.y) {
        box = sphere;
        currentSphere = u_spheres[i];
      }
    }

    if (box.y < terrain.y)
      return box;
  }

  return terrain;
}

vec3 sky(in vec3 camera, in vec3 dir) {
  // Deeper blue when looking up
  vec3 color = SKY_COLOR - .5 * dir.y;

  // Fade to fog further away
  float dist = dir.y < 0. ? 100000000. : (250. - camera.y) / dir.y;
  vec3 e = exp2(-abs(dist) * .001 * vec3(1.0));
  color = color * e + (1.0 - e) * FOG_COLOR;

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
  float i = fract(sphere.w) * 1.2;

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
  return vec3(0.37, 0.1, 0.1) +
         vec3(0.68, 0.29, 0.29) *
             cos(6.283184 * (vec3(0.04, 0.04, 0.8) *
                                 (0. + 1. * sin(10. * t + (u_time / 1000.))) +
                             vec3(0.19)));
}

vec3 shade(vec3 p, vec3 rayDir, vec3 normal, float id) {
  // vec3 base = id >= SPHERE ? vec3(0.6, 0.5, 0.4) : vec3(1.0);
  vec3 base = vec3(1.0);
  vec3 sphereLightColor = palette(id - SPHERE / float(SPHERES_COUNT));

  float occ = occlusion(p, normal);
  float occFloor = 1. - sqrt((0.5 + 0.5 * -normal.y) / (p.y + 0.5)) * .5;

  vec3 light = vec3(0.0);

  for (int i = 0; i < SPHERES_COUNT; i++) {
    light += sphereLight(p, normal, u_spheres[i]) *
             palette(float(i) / float(SPHERES_COUNT));
  }

  vec3 color = base * occ * occFloor * 0.4;

  color += 1.0 * light +
           1.0 * (id >= SPHERE ? sphereLightColor * fract(currentSphere.w) * 2.
                               : vec3(0.0));

  return color;
}

R rayMarch(in vec3 camera, in vec3 rayDir) {
  float stepDist = EPSILON;
  float dist = EPSILON;
  float depth = EPSILON;

  R result;

  for (int i = 0; i < MAX_ITERATIONS; i++) {
    stepDist = 0.001 * depth;

    result.m = camera + depth * rayDir;
    result.d = scene(result.m);

    if (result.d.y < stepDist) {
      result.h = true;
      result.i = i;
      break;
    }

    depth += result.d.y;

    if (depth >= MAX_DIST) {
      break;
    }
  }

  result.d.y = depth;

  return result;
}

float filteredGrid(in vec2 p, in vec2 ddx, in vec2 ddy) {
  // grid ratio
  float N = 60.0;

  // filter kernel
  vec2 w = max(abs(ddx), abs(ddy)) + 0.01;

  // analytic box filtering
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
  // mat4 viewToWorld =
  //     lookAt(u_camera, u_target,
  //            normalize(vec3(sin(u_time / 10000.), cos(u_time / 10000.),
  //            0.)));
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
    R ray = rayMarch(camera, rayDir);

    if (!ray.h) {
      color = mix(color, sky(camera, rayDir), fresnel);
      float glare = clamp(dot(sunDir, rayDir), 0.0, 1.0);
      color += 0.5 * vec3(1., .5, .2) * pow(glare, 10.0);
      break;
    }
    rayDist += ray.d.y;

    vec3 normal;
    if (ray.d.x >= SPHERE) {
      normal = normalize(ray.m - currentSphere.xyz);
    } else {
      normal = ray.d.x == FLOOR_BOTTOM  ? vec3(0., 1., 0.)
               : ray.d.x == FLOOR_TOP   ? vec3(0., -1., 0.)
               : ray.d.x == FLOOR_LEFT  ? vec3(-1., 0., 0.)
               : ray.d.x == FLOOR_RIGHT ? vec3(1., 0., 0.)
               : ray.d.x == FLOOR_BACK
                   ? vec3(0., 0., 1.)
                   : vec3(0., 0., -1.); // FLOOR_FRONT as default
    }

    vec3 light = shade(ray.m, rayDir, normal, ray.d.x);

    color = mix(color, light, fresnel);

    // Fog
    vec3 fog = exp2(-rayDist * 0.002 * vec3(1.0));

    if (ray.d.x != FLOOR_BOTTOM) {
      color = color * fog + (1. - fog) * FOG_COLOR;
      break;
    }

    fresnel = clamp(1. + dot(rayDir, normal), 0., 1.);
    fresnel = 0.5 + (0.01 + 0.4 * pow(fresnel, 3.5));

    // Analytically box-filtered grid by Inigo Quilez, MIT License
    // https://iquilezles.org/articles/filterableprocedurals
    vec3 ddx_pos =
        camera - ddxDir * dot(camera - ray.m, normal) / dot(ddxDir, normal);
    vec3 ddy_pos =
        camera - ddyDir * dot(camera - ray.m, normal) / dot(ddyDir, normal);
    vec2 ddx_uv = ddx_pos.xz - ray.m.xz;
    vec2 ddy_uv = ddy_pos.xz - ray.m.xz;

    float grid = filteredGrid(0.5 * ray.m.xz, 0.5 * ddx_uv, 0.5 * ddy_uv);

    fresnel *= 0.5 * grid;
    color *= 1.0 * grid;

    color = color * fog + (1. - fog) * FOG_COLOR;

    camera = ray.m;
    rayDir = reflect(rayDir, normal);
  }

  return color;
}

void main() {
  vec2 xy = gl_FragCoord.xy - u_resolution.xy / 2.0;
  float z = u_resolution.y / tan(0.5);

  vec3 sunDir = vec3(-0.0123, 0.02, -0.9997);

  vec3 color = render(u_camera, u_target, sunDir, xy, z);

  // Color shift taken from some IQ production in outdoor lightning
  // - do I actually want these?
  // color = pow(color, COLOR_SHIFT);
  // color *= vec3(1.02, 0.99, 0.9);
  // color.z = color.z + 0.1;

  // Fade in
  if (u_time < 2000.) {
    color = mix(color, vec3(0.), (2000. - u_time) / 2000.);
  }

  color = smoothstep(0.0, 1.0, color);

  gl_FragColor = vec4(color, 1.0);
}