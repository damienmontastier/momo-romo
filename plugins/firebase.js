import Vue from 'vue'
import {
    storage
} from '@/config/FirebaseInit'

const firebasePlugin = {
    install() {
        if (Vue.__nuxt_firebase_installed__) {
            return
        }
        Vue.__nuxt_firebase_installed__ = true

        Vue.prototype.$storage = storage
    }
}

Vue.use(firebasePlugin)

export default (ctx) => {
    const {
        app,
        store
    } = ctx

    app.$storage = Vue.prototype.$storage
    ctx.$storage = Vue.prototype.$storage
    store.$storage = Vue.prototype.$storage
}