export default class KeyboardManager {
    constructor(callback) {
        this.callback = callback;
        window.addEventListener('keydown',this.onKeyDown.bind(this));
    }

    onKeyDown(e) {
        let ctrl = '';
        let shift = '';
        let key = '';
        if(e.metaKey || e.ctrlKey) {
            ctrl = 'CTRL+'
        }
        if(e.altKey) {
            shift = "Shift+"
        }
        key = ctrl + shift + e.key.toUpperCase()
        this.callback(key)
    }
 }