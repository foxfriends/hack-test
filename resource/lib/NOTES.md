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
