# hack-test

Dig through the source code to figure out the password.

## Contributions

Contributions are totally welcome. If you have an idea for a level, shoot me a
pull request following these guidelines:
*   Put all your new files in a directory under public_html
    *   Ensure one of these files is titled index.html, and is based on the
        template in the root directory of this repository
*   Give your directory a catchy name, which has no relevance to the puzzle
*   Name your pull request this same catchy name
*   Scrub your commits of anything that could give away the password
    *   I'll check for this too, but it's probably easier for you...

In terms of the code, ensure that it follows the same general structure. i.e:
*   Implements the `validate(guess)` function
*   Returns `completeLevel(0, password)` when complete (I'll fix the number when
    I add it to the game)
*   Looks like the other levels (the puzzles are in the code, not on the page)

Be sure you don't write the password anywhere. I'll figure it out myself, or
I'll ask you about it if I am really stuck. Once I am sure your level is in good
spirit, I'll slip it into the game somewhere.

If you require any additional dependencies, submit the necessary changes to
package.json. Do not commit the node_modules folder to the repository. Try to
reuse existing similar packages as much as possible.
