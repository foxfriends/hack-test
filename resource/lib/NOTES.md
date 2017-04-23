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

## `jszip`

Used for decompressing a zip file.

Unmodified.
