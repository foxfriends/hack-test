// Hey you,
//  You're totally allowed to look in this file, but I can assure you nothing
//  puzzle related is in here. It's all just background stuff to reduce the
//  clutter from the main page.

// Here, the sha1 package is loaded
//  It's pretty unlikely you can type in the password before this arrives, and
//  you do somehow, it'll be ok
const sha1Available = new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('readystatechange', () => {
    if(xhr.readyState === 4 && xhr.status === 200) {
      const scr = document.createElement('script');
      scr.text = xhr.responseText;
      document.querySelector('head').appendChild(scr);
      resolve();
    }
  });
  xhr.open('GET', '/resource/lib/sha1.min.js', true);
  xhr.send();
});

// This guy shakes the box when you get the password wrong
function shake() {
  if(!this.classList.contains('shake')) {
    this.classList.add('shake');
    window.setTimeout(this.classList.remove.bind(this.classList, 'shake'), 500);
  }
}

// This guy submits your guess when you hit Enter
function handler(event) {
  if(event.key === "Enter")
    if(!validate(this.value))
      shake.call(this);
}

// And this guy moves you to the next level when you get the password right
function completeLevel(level, password) {
  // SHA1 is used to encode the password so it can be used for the name of the
  //  next level without you being able to just check the repository and see
  //  the passwords on display
  sha1Available.then(() => window.location.href = `/${level}/${sha1(password)}`)
  return true;
}
