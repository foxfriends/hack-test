const { handler, completeLevel } = (function() {
  'use strict';
  const url = window.location.href.split('/').slice(-2);
  window.localStorage.set(`${test}-${url[0]}`, url[1]);

  const libs = Promise.all(
    [...new Set(
      ((document.currentScript.getAttribute('data-libs') || '') + ',sha1')
      .split(',')
    )].filter(s => s != '')
      .map(lib => new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', () => {
          if(xhr.readyState === 4)
            if(xhr.status === 200) {
              const scr = document.createElement('script');
              scr.text = xhr.responseText;
              document.querySelector('head').appendChild(scr);
              resolve();
            } else reject();
        });
        xhr.open('GET', `/resource/lib/${lib}.min.js`, true);
        xhr.setRequestHeader('Content-Type', 'text/javascript');
        xhr.send();
      }))
  );

  libs.catch(() => alert(
    `Hey, it seems like there's been an error. This level won't be possible right now.
    Why don't you just come back later... Hopefully it will be fixed by then!`
  ))

  function shake() {
    if(!this.classList.contains('shake')) {
      this.classList.add('shake');
      window.setTimeout(() => this.classList.remove('shake'), 500);
    }
  }

  function handler(event) {
    if(event.key === "Enter") {
      const validation = validate(this.value, 'deeper');
      if(validation instanceof Promise)
        validation.catch(shake.bind(this));
      else if(!validation)
        shake.call(this);
    }
  }

  function completeLevel(level, password) {
    libs.then(() => window.location.href = `/${level}/${sha1(password)}`)
    return true;
  }

  return { handler, completeLevel };
})();
