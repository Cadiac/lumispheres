precision highp float;

const float MAX_DIST = 200.0;
const float EPSILON = .0001;
const float PI = 3.14159;
const int MAX_ITERATIONS = 250;

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

uniform vec3 u_palette_a;
uniform vec3 u_palette_b;
uniform vec3 u_palette_c;
uniform vec3 u_palette_d;
uniform float u_palette_offset;
uniform float u_palette_range;
uniform float u_palette_period;

const int SPHERES_COUNT = 20;
uniform vec4 u_spheres[SPHERES_COUNT];

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
const int SPHERE = 6;

Surface scene(in vec3 p) {
  Surface surface = Surface(FLOOR_BOTTOM, sdPlane(p, vec3(0., 1., 0.), 0.0));

  surface =
      opUnion(surface, Surface(FLOOR_TOP, sdPlane(p, vec3(0., -1., 0.), 20.0)));

  surface = opUnion(surface,
                    Surface(FLOOR_LEFT, sdPlane(p, vec3(-1., 0., 0.), 10.0)));

  surface = opUnion(surface,
                    Surface(FLOOR_RIGHT, sdPlane(p, vec3(1., 0., 0.), 10.0)));

  surface =
      opUnion(surface, Surface(FLOOR_BACK, sdPlane(p, vec3(0., 0., 1.), 10.0)));

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
  // return vec3(0.5) +
  //        vec3(0.5) *
  //            cos(2. * PI *
  //                (vec3(1.0) * (-0.3 + 0.4 * sin(10. * t + (u_time / 1000.)))
  //                +
  //                 vec3(0.0, 0.33, 0.67)));
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

    depth += result.surface.dist * 0.5;

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

vec3 render(vec3 camera, vec3 rayDir, vec3 sunDir, vec3 ddxDir, vec3 ddyDir) {
  vec3 color = vec3(0.0);
  float fresnel = 1.0;

  float rayDist = 0.0;

  for (int i = 0; i < 2; i++) {
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
    } else if (ray.surface.id >= SPHERE) {
      normal = normalize(ray.pos - currentSphere.xyz);
    }

    Material material = Material(vec3(0.43, 0.42, 0.4), vec3(0.0),
                                 vec3(0.43, 0.42, 0.4), 1., 0.0);

    vec3 light = shade(ray.pos, rayDir, normal, ray.surface.id);

    color = mix(color, light, fresnel);

    // Fog
    vec3 e = exp2(-rayDist * u_fog_intensity * u_color_shift);
    color = color * e + (1. - e) * u_fog_color;

    if (ray.surface.id >= SPHERE || ray.surface.id == FLOOR_LEFT ||
        ray.surface.id == FLOOR_RIGHT || ray.surface.id == FLOOR_BACK) {
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

    color *= 1.0 * grid;
    fresnel *= 0.5 * grid;

    // if (ray.surface.id == FLOOR_TOP) {
    //   break;
    // }

    camera = ray.pos;
    rayDir = reflect(rayDir, normal);
  }

  return color;
}

mat4 lookAt(vec3 camera, vec3 target, vec3 up) {
  vec3 f = normalize(target - camera);
  vec3 s = normalize(cross(up, f));
  vec3 u = cross(f, s);

  return mat4(vec4(s, .0), vec4(u, .0), vec4(-f, .0), vec4(.0, .0, .0, 1.));
}

void main() {
  vec2 xy = gl_FragCoord.xy - u_resolution / 2.0;
  float z = u_resolution.y / tan(radians(u_fov) / 2.0);
  vec3 viewDir = normalize(vec3(xy, -z));

  vec3 sunDir = normalize(u_sun);
  mat4 viewToWorld = lookAt(u_camera, u_target, normalize(vec3(0., 1., 0.)));
  // mat4 viewToWorld =
  //     lookAt(u_camera, u_target,
  //            normalize(vec3(sin(u_time / 10000.), cos(u_time / 10000.),
  //            0.)));
  vec3 worldDir = (viewToWorld * vec4(viewDir, 0.0)).xyz;

  vec3 ddxDir =
      (viewToWorld * vec4(normalize(vec3(xy + vec2(1.0, 0.0), -z)), 0.0)).xyz;

  vec3 ddyDir =
      (viewToWorld * vec4(normalize(vec3(xy + vec2(0.0, 1.0), -z)), 0.0)).xyz;

  vec3 color = render(u_camera, worldDir, sunDir, ddxDir, ddyDir);

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