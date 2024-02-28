/* -*- mode: javascript; tab-width: 4; indent-tabs-mode: nil; -*-
 *
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
 *
 */

// Some general notes and recommendations:
//  * This code uses modern ECMAScript features, such as ** instead of
//    Math.pow(). You may have to modify the code to make it work on older
//    browsers.
//  * If you're not using all the functionality (e.g. not all oscillator types,
//    or certain effects), you can reduce the size of the player routine even
//    further by deleting the code.

// NOTE: This file is a partial version of the "player-small.js" used by Soundbox,
// with only sin oscillators and partial effects that are in use at this entry.
// This was then minified further using automatic tooling and used in the demo.

export let CPlayer = function (song) {
  let mSong = song;

  // Init iteration state letiables
  let mLastRow = song.endPattern;
  let mCurrentCol = 0;

  // Prepare song info
  let mNumWords = song.rowLen * song.patternLen * (mLastRow + 1) * 2;

  // Create work buffer (initially cleared)
  let mMixBuf = new Int32Array(mNumWords);

  //--------------------------------------------------------------------------
  // Private methods
  //--------------------------------------------------------------------------

  // Oscillators
  let osc_sin = (value) => {
    return Math.sin(value * 6.283184);
  };

  let getnotefreq = (n) => {
    // 174.61.. / 44100 = 0.003959503758 (F3)
    return 0.00396 * 2 ** ((n - 128) / 12);
  };

  //--------------------------------------------------------------------------
  // Private members
  //--------------------------------------------------------------------------

  // Array of oscillator functions

  // Private letiables set up by init()

  //--------------------------------------------------------------------------
  // Initialization
  //--------------------------------------------------------------------------

  //--------------------------------------------------------------------------
  // Public methods
  //--------------------------------------------------------------------------

  // Generate audio data for a single track
  this.generate = () => {
    // Local variables
    let i, j, p, row, col, n, cp, k, t, rsample, rowStartSample, f;

    // Put performance critical items in local variables
    let chnBuf = new Int32Array(mNumWords),
      instr = mSong.songData[mCurrentCol],
      rowLen = mSong.rowLen,
      patternLen = mSong.patternLen;

    // Clear effect state
    let low = 0,
      band = 0,
      high;
    let lsample,
      filterActive = false;

    // Clear note cache.
    let noteCache = [];

    // Patterns
    for (p = 0; p <= mLastRow; ++p) {
      cp = instr.p[p];

      // Pattern rows
      for (row = 0; row < patternLen; ++row) {
        // Execute effect command.
        let cmdNo = cp ? instr.c[cp - 1].f[row] : 0;
        if (cmdNo) {
          instr.i[cmdNo - 1] = instr.c[cp - 1].f[row + patternLen] || 0;

          // Clear the note cache since the instrument has changed.
          if (cmdNo < 17) {
            noteCache = [];
          }
        }

        // Put performance critical instrument properties in local variables
        let oscLFO = osc_sin,
          lfoAmt = instr.i[17] / 512,
          lfoFreq = 2 ** (instr.i[18] - 9) / rowLen,
          fxLFO = instr.i[19],
          fxFilter = instr.i[20],
          fxFreq = (instr.i[21] * 43.23529 * 3.141592) / 44100,
          q = 1 - instr.i[22] / 255,
          dist = instr.i[23] * 1e-5,
          drive = instr.i[24] / 32,
          panAmt = instr.i[25] / 512,
          panFreq = (6.283184 * 2 ** (instr.i[26] - 9)) / rowLen,
          dlyAmt = instr.i[27] / 255,
          dly = (instr.i[28] * rowLen) & ~1; // Must be an even number

        // Calculate start sample number for this row in the pattern
        rowStartSample = (p * patternLen + row) * rowLen;

        // Generate notes for this pattern row
        for (col = 0; col < 4; ++col) {
          n = cp ? instr.c[cp - 1].n[row + col * patternLen] : 0;
          if (n) {
            if (!noteCache[n]) {
              let o1vol = instr.i[1],
                o1xenv = instr.i[3] / 32,
                o2vol = instr.i[5],
                o2xenv = instr.i[8] / 32,
                noiseVol = instr.i[9],
                attack = instr.i[10] * instr.i[10] * 4,
                sustain = instr.i[11] * instr.i[11] * 4,
                release = instr.i[12] * instr.i[12] * 4,
                releaseInv = 1 / release,
                expDecay = -instr.i[13] / 16;

              let noteBuf = new Int32Array(attack + sustain + release);

              // Re-trig oscillators
              let c1 = 0,
                c2 = 0;

              // Local letiables.
              let j, e, rsample, o1t, o2t;

              // Generate one note (attack + sustain + release)
              for (j = 0; j < attack + sustain + release; j++) {
                // Calculate note frequencies for the oscillators
                o1t = getnotefreq(n + instr.i[2] - 128);
                o2t =
                  getnotefreq(n + instr.i[6] - 128) * (1 + 0.0008 * instr.i[7]);

                // Envelope
                e = 1;
                if (j < attack) {
                  e = j / attack;
                } else if (j >= attack + sustain) {
                  e = (j - attack - sustain) * releaseInv;
                  e = (1 - e) * 3 ** (expDecay * e);
                }

                // Oscillator 1
                c1 += o1t * e ** o1xenv;
                rsample = osc_sin(c1) * o1vol;

                // Oscillator 2
                c2 += o2t * e ** o2xenv;
                rsample += osc_sin(c2) * o2vol;

                // Noise oscillator
                if (noiseVol) {
                  rsample += (2 * Math.random() - 1) * noiseVol;
                }

                // Add to (mono) channel buffer
                noteBuf[j] = (80 * rsample * e) | 0;
              }

              noteCache[n] = noteBuf;
            }

            // Copy note from the note cache
            let noteBuf = noteCache[n];
            for (
              j = 0, i = rowStartSample * 2;
              j < noteBuf.length;
              j++, i += 2
            ) {
              chnBuf[i] += noteBuf[j];
            }
          }
        }

        // Perform effects for this pattern row
        for (j = 0; j < rowLen; j++) {
          // Dry mono-sample
          k = (rowStartSample + j) * 2;
          rsample = chnBuf[k];

          // We only do effects if we have some sound input
          if (rsample || filterActive) {
            // State variable filter
            f = fxFreq;
            if (fxLFO) {
              f *= oscLFO(lfoFreq * k) * lfoAmt + 0.5;
            }
            f = 1.5 * Math.sin(f);
            low += f * band;
            high = q * (rsample - band) - low;
            band += f * high;
            rsample = fxFilter == 3 ? band : fxFilter == 1 ? high : low;

            // Distortion
            if (dist) {
              rsample *= dist;
              rsample =
                rsample < 1 ? (rsample > -1 ? osc_sin(rsample * 0.25) : -1) : 1;
              rsample /= dist;
            }

            // Drive
            rsample *= drive;

            // Is the filter active (i.e. still audiable)?
            filterActive = rsample * rsample > 1e-5;

            // Panning
            t = Math.sin(panFreq * k) * panAmt + 0.5;
            lsample = rsample * (1 - t);
            rsample *= t;
          } else {
            lsample = 0;
          }

          // Delay is always done, since it does not need sound input
          if (k >= dly) {
            // Left channel = left + right[-p] * t
            lsample += chnBuf[k - dly + 1] * dlyAmt;

            // Right channel = right + left[-p] * t
            rsample += chnBuf[k - dly] * dlyAmt;
          }

          // Store in stereo channel buffer (needed for the delay effect)
          chnBuf[k] = lsample | 0;
          chnBuf[k + 1] = rsample | 0;

          // ...and add to stereo mix buffer
          mMixBuf[k] += lsample | 0;
          mMixBuf[k + 1] += rsample | 0;
        }
      }
    }

    // Next iteration. Return progress (1.0 == done!).
    mCurrentCol++;
    return mCurrentCol / mSong.numChannels;
  };

  // Create a WAVE formatted Uint8Array from the generated audio data
  this.createWave = () => {
    // Create WAVE header
    let headerLen = 44;
    let l1 = headerLen + mNumWords * 2 - 8;
    let l2 = l1 - 36;
    let wave = new Uint8Array(headerLen + mNumWords * 2);
    wave.set([
      82,
      73,
      70,
      70,
      l1 & 255,
      (l1 >> 8) & 255,
      (l1 >> 16) & 255,
      (l1 >> 24) & 255,
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
      l2 & 255,
      (l2 >> 8) & 255,
      (l2 >> 16) & 255,
      (l2 >> 24) & 255,
    ]);

    // Append actual wave data
    for (let i = 0, idx = headerLen; i < mNumWords; ++i) {
      // Note: We clamp here
      let y = mMixBuf[i];
      y = y < -32767 ? -32767 : y > 32767 ? 32767 : y;
      wave[idx++] = y & 255;
      wave[idx++] = (y >> 8) & 255;
    }

    // Return the WAVE formatted typed array
    return wave;
  };
};
