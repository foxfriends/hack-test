# Hack Test

Dig through the source code to figure out the password. Play
[here](http://cameldridge.com/hack-test/0/)

## Contributions

Contributions are totally welcome. If you have an idea for a level, shoot me a
pull request following these guidelines:

*   Put all your new files in a directory under `public_html`
    *   Ensure one of these files is titled `index.html`, and is based on the
        template in the root directory of this repository
*   Give your directory a catchy name, which has no relevance to the puzzle
*   Name your pull request this same catchy name
*   Scrub your commits of anything that could give away the password
    *   I'll check for this too, but it's probably easier for you...
*   Set the content for the author meta-tag to your Github username. This is so
    that if a level is having issues, the original puzzle designer can be
    tracked down.

In terms of the code, ensure that it follows the same general structure. i.e:
*   Implements the `validate(guess)` function
*   Which returns `completeLevel(0, password)` when complete (I'll fix the
    number when I add it to the game), or false otherwise
    *   If you use asynchronous actions, you may return a promise that resolves
        to `completeLevel(0, password)` or rejects instead

Be sure you don't write the password anywhere. I'll figure it out myself, or
I'll ask you about it if I am really stuck. Once I am sure your level is in good
spirit, I'll slip it into the game somewhere.

### External packages

Though you should do your best to avoid additional dependencies, there may be
times when you require them. In that case follow this process:

1.  Check if a similar-purpose package is already included. If so, skip to 5
2.  Install the relevant package from NPM using `npm install <package> --save`
3.  Copy the *minified* (if you can) source file to `public_html/resource/lib`
4.  Ensure the file name follows the format `<package>.min.js` (even if not 
    actually minimized)
5.  Add a `data-libs` attribute to the script tag that loads the common scripts.
    The value is a comma separated list of package names, i.e:
    ```html
    <script src="{{ '/resource/common.js' | relative_url }}" data-libs="react,redux"></script>
    ```
    These packages will be loaded automatically but asynchronously. Since they
    are asynchronous, they should only be used after the validate function is
    called to ensure they have had enough time to load. 
    
    If you *absolutely require* a package be loaded immediately, or wish to keep
    some code separately, add its script tag to the page normally. This is
    discouraged as it adds unnecessary clutter to the user's experience. No puzzle
    should require reading the source code of external libraries (they can read
    the docs instead, based on the titles listed, if necessary).
6.  Commit any installed modules to the repository when you submit the level. This 
    is to accommodate custom patches to packages to make them work as required.
7.  Add a note to the NOTES.md file in the resource directory about the package
    added and describe the purpose of any changes you made to the package.

Following this process keeps unnecessary clutter away from the players, so they
can focus on solving the actual puzzle.
