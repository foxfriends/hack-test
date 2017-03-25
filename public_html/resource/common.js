---
---
const { handler, completeLevel } = (function() {
  'use strict';
  const url = window.location.href.split('/').slice(-2);
  if(url[1].length === 40) {
    // save progress, only for sha1 hash levels
    window.localStorage.setItem(`test-${url[0]}`, url[1]);
  }

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
        xhr.open('GET', `{{ site.baseurl }}/resource/lib/${lib}.min.js`, true);
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

  let fails = 0;
  function handler(event) {
    if(event.key === "Enter") {
      const validation = validate(this.value, 'deeper');
      if(validation instanceof Promise)
        validation.catch(shake.bind(this));
      else if(!validation) {
        shake.call(this);
        if(++fails >= 5) {
          const el = document.querySelector('q') || document.createElement('Q');
          el.innerHTML = 'Hint: You can view-source with Ctrl/Cmd-U';
          document.body.appendChild(el);
        }
      }
    }
  }

  function completeLevel(level, password) {
    libs.then(() => window.location.href = `{{ site.baseurl }}/${level}/${sha1(password)}`);
    return true;
  }

  console.log(
    `Though I certainly can't stop you, and looking at the code through the`,
    `debugger is very much allowed, do consider how unexciting this would be if`,
    `you used it to avoid the challenge. There's no shame in using the console`,
    `as a scratchpad for calculations, but for the intended experience, it`,
    `would be best to just view-source the old fashioned way (ctrl/cmd-u)`
  );

  return { handler, completeLevel };
})();
