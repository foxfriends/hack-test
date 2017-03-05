function shake() {
  if(!this.classList.contains('shake')) {
    this.classList.add('shake');
    window.setTimeout(this.classList.remove.bind(this.classList, 'shake'), 500);
  }
}

function handler(event) {
  if(event.key === "Enter") {
    if(!validate(this.value)) {
      shake.call(this);
    }
  }
}
