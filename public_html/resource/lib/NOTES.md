# Notes on lib modifications

## `sha1`

Computes SHA-1 hashes.

Unmodified.

## `roy`

Roy language compiler.

Modified to automatically compile and run Roy code specified in by
`<script type='text/roy'> ... </script>` in HTML. Also added the `stripIndent`
library, which had to be modified to be compatible with whatever nasty module
system Roy was using.

## `htms`

HTMS interpreter.

Unmodified. Stored in the folder with Level 21, since I expect it only to be
used there, is not minified, and will likely be read when looking for the
solution.

## `babel-standalone`

Babel standalone compiler.

Stored as `babel` in libs. Used for backwards compatibility on some levels (21).
May be removed in the future when browsers all catch up.

## `jszip`

Used for decompressing a zip file.

Unmodified.

## `@susisu/grass`

Grass interpreter.

Added `webpack.config.js` and `browser.js` to compile to `grass.min.js`,
exposing a function to execute a script given a selector.

## `@susisu/whitespace`

Whitespace interpreter.

Added `webpack.config.js` and `browser.js` to compile to `ws.min.js`,
exposing a function to execute a script given a selector.

## `@susisu/bfjs`

Brainf*** interpreter.

Added `webpack.config.js` and `browser.js` to compile to `bf.min.js`,
exposing a function to execute a script given a selector.

## `befunge`

Befunge interpreter. Found [here](http://www.quirkster.com/iano/js/befunge.js),
not on NPM.

Modified so it could be called as a function like the other libraries above
instead of parsing the DOM for specific elements, and to remove the step through
features.

## `tesseract`

Optical character recognition.

Unmodified.

## `transliteration.cyr`

Transliterate from Cyrillic alphabet to Latin.

Unmodified.
