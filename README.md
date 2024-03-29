# Lumispheres - 4k intro

![Screenshot](https://github.com/Cadiac/lumispheres/blob/main/entry/screenshot.png)

## Online version

https://lumispheres.cadi.ac/

## About

First released at Instanssi 2024, placing on 2nd place.

At the version seen at instanssi the demo also controlled the hall lights, but
the version included here on entry directory here doesn't do that as it crashes
if it can't reach the effects server.

Tools used:

- JavaScript
- WebGL
- [SoundBox](https://gitlab.com/mbitsnbites/soundbox)
- [Brotli](https://github.com/google/brotli)
- [Shader Minifier](http://www.ctrl-alt-test.fr)
- [UglifyJS](https://github.com/mishoo/UglifyJS)

This is my second 4k intro.

## Running locally

See `entry` directory and its `lumispheres.nfo` file.

TL;DR: Go to `entry` directory and start the provided python server

```shell
cd entry
python3 server.py
```

and open http://localhost:8000 on the browser.

**Click to start the demo.** It should automatically enter full screen mode and start, and stop once the demo is over.

## Development

Install Node (tested with v20.11.1) and development dependencies with `npm install`.

To build the demo you'll also need at least Mono, [Brotli](https://github.com/google/brotli) and [Shader Minifier](http://www.ctrl-alt-test.fr) (modify the path on package.json to match your installation).

### Building the entry

[Brotli](https://github.com/google/brotli) was allowed at this competition as a compression method, and it was used to reach the size limit. To build the demo and compress it using Brotli run

```
npm run build
```

This produces a compressed entry that can be served to the browser locally using the included python server `python3 server.py`.

To build an alternative PNG compressed entry using [PnginatorModified](https://gitlab.com/tmptknn/pipeline/-/blob/main/tools/pnginator_modified.rb) you can run

```
npm run build-png
```

This requires you having `Ruby` and `zopfli` installed.

### Development version

Because it is inconvenient to constantly build the demo this comes with a development mode that can be started with

```
npm run dev
```

This just starts up a `serve` instance serving your local files to the browser. You can then open `localhost:3000/4k` and make changes to the demo-small.js, refreshing the browser manually. If you are making shader changes you can modify the demo-small.js code to load unminified the fragment shader from the backend using fetch. Note that if you do this, you need to change the onclick handler to be async, and adjust the uniform names to the unminified ones. I didn't build good tooling for this.

Note that the minified shader is just manually copy & pasted from `dist/fragment.min.glsl` and inlined to the entry.

### Interactive playground

This playground can be found online at https://spheres.cadi.ac

This demo comes with an interactive version of the shader with dat.gui controls. This mode can be started with

```shell
$ npm run dev-vite
```

Note that this works on the code found within `src/` directory. The actual demo was branched off from this point and continued within the `4k` directory.

## License

This intro is released under MIT license.

Some of the GLSL shader functions are derived from iquilezles.org, as indicated on the `fragment.glsl` file. Thanks for the great learning resources IQ!

SoundBox synthesizer player has its own copyright notice included on the code.
