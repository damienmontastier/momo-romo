export default class KeyboardManager {
  constructor(callback, keyboard) {
    console.log(keyboard)
    this.callback = callback;
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  onKeyDown(e) {
    let ctrl = "";
    let shift = "";
    let key = "";
    if (e.metaKey || e.ctrlKey) {
      ctrl = "CTRL+";
    }
    if (e.altKey || e.shiftKey) {
      shift = "Shift+";
    }
    key = ctrl + shift + e.key.toUpperCase();

    if (!e.repeat) {
      this.callback(key, true);
    }
  }
  onKeyUp(e) {
    let ctrl = "";
    let shift = "";
    let key = "";
    if (e.metaKey || e.ctrlKey) {
      ctrl = "CTRL+";
    }
    if (e.altKey || e.shiftKey) {
      shift = "Shift+";
    }
    key = ctrl + shift + e.key.toUpperCase();
    if (!e.repeat) {
      this.callback(key, false);
    }
  }
}