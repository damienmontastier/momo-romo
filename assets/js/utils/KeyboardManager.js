export default class KeyboardManager {
    constructor(callback) {
        this.callback = callback
        window.addEventListener('keydown',this.onKeyDown.bind(this))
    }

    onKeyDown(e) {
        console.log(e)
        let key = ''
        if(e.metaKey || e.ctrlKey) {
            key = 'CTRL+' + e.key.toUpperCase()
        } else {
            key = e.code.replace('Key','')
        }
        this.callback(key)
    }
 }