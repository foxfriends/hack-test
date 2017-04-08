# HTMS

Everyone knows HTML, but new programmers are often intimidated by JavaScript and
its code-looking syntax. Unfortunately, HTML does not have scripting abilities
of its own. Until now!

HyperText Markup Script provides a way to express computations using just HTML.
It even provides full interoperability with JavaScript code for a smooth
transition when you feel ready to use a "real" language.

## How to use HTMS:

1.  Include the `htms.min.js` script on the page
2.  Create your root `<htms></htms>` element
3.  Write your code!

## Syntax

The formal syntax of the language is exactly the same as HTML, though the tags
have slightly different meanings.

## Nodes (Tags)

#### `<htms name="some_name">`

The root HTMS node defines where to start running your HTMS code. All exported
values will be placed in a global JavaScript object with the name given by the
`name` attribute. (i.e. `some_name`, or `window.some_name`).

The final value of the `<htms>` node is automatically exported with the name
`default`.

```html
<HTMS>
  <!-- your program here -->
</HTMS>
```

#### `<span>`

Provides no special purpose other than to execute its children in order. It can
be used to turn variables into strings and numbers (see `<q>` and `<i>`).
```html
<span>
  <!-- some block of code -->
</span>
```

#### `<var name="some_name">`

Assigns the final value of its children to the variable given by the name
attribute. This variable can then be referenced later by its name.

Note that there are a few built in identifiers which cannot be used as variable
names, namely `true`, `false`, and `$_`. These correspond to the Boolean true
and false values, and the "previous value".

`$_` is often used internally, and so you should not need to reference it, but
you can. `$_` always holds the value of the previously executed node in the
current block. When no nodes have yet been run in the current block, the value
of `$_` is `null`. This is the only way to obtain the `null` value, which may be
useful at times.

```html
<!-- string = "Hello world" -->
<var name="string"><q>Hello world</q></var>

<span>
  <!-- some code -->
  string
</span> <!-- evaluates to "Hello world" -->
```

#### `<q>`

Turns its final value into a string. If it is a text node, the text is used
literally. Otherwise, it is the return value of evaluating the final element.

```html
<var name="x"><i>3</i></var>
<q>Hello world</q> <!-- String: "Hello world" -->
<q>x</q> <!-- String: "x" -->
<q><span>x</span></q> <!-- String: "3" -->
```

#### `<i>`

Similar to `<q>` but for numbers.

```html
<var name="x"><q>5</q></var>
<i>3</i> <!-- Number: 3 -->
<i>x</i> <!-- Number: NaN -->
<i><span>x</span></i> <!-- Number: 5 -->
```

#### `<b>`

Similar to `<q>` but for Booleans.

```html
<var name="x"><q>0</q></var>
<b>3</b> <!-- Boolean: true -->
<b>0</b> <!-- Boolean: false -->
<b>false</b> <!-- Boolean: false -->
<b>true</b> <!-- Boolean: true -->
<b><q>false</q></b> <!-- Boolean: true -->
<b>x</b> <!-- Boolean: true -->
<b><span>x</span></b> <!-- Boolean: false -->
```

#### `<del>`

Negates its final value as a Boolean. Note that this is an operator, and not a
type constructor, so untyped values are evaluated as variables automatically and
do not require being nested in a `<span>`.

```html
<var name="x">false</var>
<del>true</del> <!-- false -->
<del>3</del> <!-- false -->
<del>false</del> <!-- true -->
<del>x</del> <!-- true -->
<del><span>x</span></del> <!-- true -->
```

#### `<a>`

Produces the sum of all the elements in its final value, which must be an array
of numbers or strings. With strings, it performs concatenation.

```html
<!-- 12 -->
<a>
  <ol>
    <li><i>3</i></li>
    <li><i>4</i></li>
    <li><i>5</i></li>
  </ol>
</a>
<!-- "345" -->
<a>
  <ol>
    <li><q>3</q></li>
    <li><q>4</q></li>
    <li><q>5</q></li>
  </ol>
</a>
```

#### `<s>`

Similar to `<a>`, but performs subtraction. Does not work on strings.
```html
<!-- -6 -->
<s>
  <ol>
    <li><i>3</i></li>
    <li><i>4</i></li>
    <li><i>5</i></li>
  </ol>
</s>
```

#### `<div>`

Similar to `<s>`, but performs division.
```html
<!-- 1 -->
<div>
  <ol>
    <li><i>10</i></li>
    <li><i>2</i></li>
    <li><i>5</i></li>
  </ol>
</div>
```

#### `<em>`

Similar to `<div>`, but performs multiplication.
```html
<!-- 100 -->
<em>
  <ol>
    <li><i>10</i></li>
    <li><i>2</i></li>
    <li><i>5</i></li>
  </ol>
</em>
```

#### `<sup>`

Raises `$_` to the power of its final value. Both must be numbers.

```html
<!-- 9 -->
<i>3</i><sup><i>2</i></sup>
```

#### `<small>`

Performs a less than comparison between `$_` and its final value.

```html
<!-- true -->
<i>3</i><small><i>5</i></small>
<!-- false -->
<i>5</i><small><i>3</i></small>
```

#### `<samp>`

Performs an equality comparison between `$_` and its final value. Types of both
arguments must be the same for this to evaluate to true.

```html
<!-- true -->
<i>3</i><samp><i>3</i></samp>
<!-- false -->
<i>5</i><samp><i>3</i></samp>
```

#### `<ol> ... <li>`

Creates an array, where each array element is the final value of each `<li>`

```html
<!-- [3, "Hi", [ 5 ]] -->
<ol>
  <li><i>3</i></li>
  <li><q>Hi</q></li>
  <li>
    <ol>
      <li><i>5</i></li>
    </ol>
  </li>
</ol>
```

#### `<dl> ... <dd> ... <dt>`

Creates a dictionary where each key, denoted by `<dd>`, corresponds to the value
of the following `<dt>`. The children of `<dl>` must start with `<dd>` and then
alternate `<dd><dt><dd><dt>`

```html
<!--
{
  first_name: "John",
  last_name: "Smith",
  age: 15
}
-->
<dl>
  <dd><q>first_name</q></dd>
  <dt><q>John</q></dt>
  <dd><q>last_name</q></dd>
  <dt><q>Smith</q></dt>
  <dd><q>age</q></dd>
  <dt><i>15</i></dt>
</dl>
```

#### `<sub>`

Perform the subscript operation to extract the values of an array or object. The
final value of the `<sub>` is the key to extract.

```html
<var name="obj">
  <dl>
    <dd><q>first_name</q></dd>
    <dt><q>John</q></dt>
    <dd><q>last_name</q></dd>
    <dt><q>Smith</q></dt>
    <dd><q>age</q></dd>
    <dt><i>15</i></dt>
  </dl>
</var>
obj<sub><q>first_name</q></sub> <!-- "John" -->
<var name="arr">
  <ol>
    <li><i>3</i></li>
    <li><q>Hi</q></li>
    <li>
      <ol>
        <li><i>5</i></li>
      </ol>
    </li>
  </ol>
</var>
arr<sub><i>1</i></sub> <!-- "Hi" -->
```

#### `<template name="some_name">`

Defines a function. User-defined functions can take only one argument. If you
need more arguments, consider currying or passing an array or dictionary
instead.

The contents of the `<template>` tag define the body of the function. To
reference the argument, use the variable `argument`. The final value is used as
the return value.

The function can be later referenced by its name, given by the name attribute.

```html
<template name="fn">
  <!-- ... some function body -->
</template>
```

#### `<ins>`

Performs a function call, passing its final value to the function referred to
by the previous value (`$_`). This node evaluates to the return value of the
function.

```html
<template name="fn">
  <!-- ... some function body -->
</template><ins><q>hello world</q></ins>  <!-- $_ is the template[name="fn"] -->
<!-- or make $_ fn, then call it -->
fn<ins><q>hello world</q></ins>
```

#### `<article> ... <header> ... <main> ... <aside>`

The if-else block. If the final value of the (required) `<header>` tag is
`true`, the (optional) `<main>` block is run. If it is false, the (optional)
`<aside>` block is run. The return value of the `<article>` is the final value
of whichever block was run. If the block to run did not exist, the previous
value of `$_` is returned instead.

For those experienced with programming who are used to the `else if` clause,
there is none, and you must instead nest `<articles>` to achieve this effect.

#### `<code>`

Obtains the native, global, JavaScript object `window[identifier]`, where the
identifier is the final value of its children. Notice that the types of native
objects are not the same as HTMS types, so if you wish to use it as a HTMS
number or string, you must use the respective `<i>` or `<q>` to perform the
conversion. You can, however, pass HTMS values to these functions as they will
be converted automatically.

```html
<!-- Produces the number 3 -->
<i>
  <code><q>Math</q></code><sub><q>min</q></sub>
  <fieldset>
    <ol>
      <li><i>3</i></li>
      <li><i>7</i></li>
    </ol>
  </fieldset>
<i>
```

#### `<fieldset>`

Performs a function call, but instead of passing its final value as the
argument, its final value must be an array whose elements are passed as multiple
arguments to the function. This is most useful for interacting with native
JavaScript code, as user-defined functions can only have one argument.

```html
<!-- Produces the number 3 -->
<i>
  <code><q>Math</q></code><sub><q>min</q></sub>
  <fieldset>
    <ol>
      <li><i>3</i></li>
      <li><i>7</i></li>
    </ol>
  </fieldset>
<i>
```

#### `<output name"some_name">`

Exports a HTMS value to the host program with the name given by the name
attribute.

```html
<HTMS name="program">
  <output name="x"><i>3</i></output>
</HTMS>
<!-- Now in the native JS: window.program.x === 3 -->
```
