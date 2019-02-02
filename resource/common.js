var { handler, completeLevel } = (function() {
  'use strict';
  const url = window.location.href.split('/').slice(-2);

  /**
   * Leaderboard identification and scoring
   */
  if (!window.localStorage.getItem('user-id')) {
    // not quite official, but good enough! (https://codegolf.stackexchange.com/questions/58442/generate-random-uuid/170363#170363)
    const uuid = () => '66-6-6-6-666'.replace(/6/g,_=>(Math.random().toString(16)+'00000').slice(2,6))
    window.localStorage.setItem('user-id', uuid());
  }
  const userId = window.localStorage.getItem('user-id');
  let attempts = window.localStorage.getItem(`attemts-${url[0]}`) || 0;
  let name = window.localStorage.getItem('user-name');

  /**
   * Generate leaderboard elements
   */
  window.addEventListener('load', () => {
    const leaderboard = document.createElement('DIV');
    leaderboard.classList.add('leaderboard');
    const scores = document.createElement('DIV');
    scores.classList.add('scores');
    leaderboard.appendChild(scores);
    fetch('http://cameldridge.com/hack-test/lb.php')
      .then(response => response.text())
      .then(data => [].concat(...data.split('\n')
        .filter(x => x)
        .map(row => row.split(',').slice(1))
        .map(([name, level, attempts]) => (console.log(level), [name, +level, +attempts]))
        .sort((a, b) => b[1] - a[1] === 0 ? a[2] - b[2] : b[1] - a[1])
        .map((row, i) => [i + 1, ...row])
        .slice(0, 15)
      ))
      .then(entries => ['', 'Name', 'Level', 'Attempts', ...entries]
        .map(text => {
          const element = document.createElement('span');
          element.textContent = text;
          return element
        })
        .forEach(element => scores.appendChild(element))
      )
      .then(() => {
        const nameField = document.createElement('INPUT');
        nameField.value = name;
        nameField.setAttribute('placeholder', 'Enter your name');
        nameField.addEventListener('change', () => {
          name = nameField.value;
          window.localStorage.setItem('user-name', name);
        })
        leaderboard.appendChild(nameField);
      })
      .then(() => document.body.appendChild(leaderboard))
      .catch(error => console.error(error));
  });

  /**
   * Save progress
   */
  if(+window.sessionStorage.getItem('last-level') + 1 == +url[0] && url[1].length === 40) {
    // save progress, only for sha1 hash levels
    window.localStorage.setItem(`test-${url[0]}`, url[1]);
  }

  /**
   * Load dependencies
   */
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
        xhr.open('GET', `../resource/lib/${lib}.min.js`, true);
        xhr.setRequestHeader('Content-Type', 'text/javascript');
        xhr.send();
      }))
  );

  libs.catch(() => alert(
    `Hey, it seems like there's been an error. This level won't be possible right now.
    Why don't you just come back later... Hopefully it will be fixed by then!`
  ))

  /**
   * Password validation
   */
  function shake() {
    if(!this.classList.contains('shake')) {
      this.classList.add('shake');
      window.setTimeout(() => this.classList.remove('shake'), 500);
    }
  }

  const loader = document.createElement('DIV');
  loader.classList.add('loader');

  let fails = 0;
  function handler(event) {
    if(event.key === "Enter") {
      ++attempts;
      const validation = validate(this.value, 'deeper');
      if(validation instanceof Promise) {
        document.body.appendChild(loader)
        validation.catch(() => {
          document.body.removeChild(loader)
          shake.call(this);
        });
      } else if(!validation) {
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
    window.sessionStorage.setItem('last-level', `${url[0]}`);

    libs
      .then(() => {
        // send this victory to the leaderboard, if they have a name
        if (userId && name) {
          return fetch(`http://cameldridge.com/hack-test/lb.php?id=${userId}&name=${name}&level=${url[0]}&hash=${sha1(password)}&attempts=${attempts}`, {
            method: 'POST',
          });
        }
      })
      .then(() => window.location.href = `../${level}/${sha1(password)}`);

    return true;
  }

  /**
   * Rules message
   */
  console.log(
    `Though I certainly can't stop you, and looking at the code through the`,
    `debugger is very much allowed, do consider how unexciting this would be if`,
    `you used it to avoid the challenge. There's no shame in using the console`,
    `as a scratchpad for calculations, but for the intended experience, it`,
    `would be best to just view-source the old fashioned way (ctrl/cmd-u)`
  );

  return { handler, completeLevel };
})();
