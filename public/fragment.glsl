precision highp float;

const int TAIL_COUNT = 5;
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
uniform vec4 u_tail[TAIL_COUNT];

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

float sdSphere(vec3 p, float s) { return length(p) - s; }

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float opSmoothUnion(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
  return mix(d2, d1, h) - k * h * (1.0 - h);
}

Surface scene(in vec3 p) {
  float dist = 1e5;

  for (int i = 0; i < TAIL_COUNT; ++i) {
    float d = sdBox(p + u_tail[i].xyz, vec3(0.5));
    dist = opSmoothUnion(dist, d, 1.0);
  }

  Material material =
      Material(vec3(0.8), vec3(0.2), vec3(0.5, 0.4, 0.3), 10., 0.5);

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

mat4 lookAt(vec3 camera, vec3 target, vec3 up) {
  vec3 f = normalize(target - camera);
  vec3 s = normalize(cross(up, f));
  vec3 u = cross(f, s);

  return mat4(vec4(s, .0), vec4(u, .0), vec4(-f, .0), vec4(.0, .0, .0, 1.));
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