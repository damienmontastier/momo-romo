import {
    storage,
    database
} from '@/config/FirebaseInit'

export const strict = false

export const state = () => ({
    loaded: false,
    stagesList: null,
    quality: null,
    keyboard: null
})

export const mutations = {
    setLoaded(state, value) {
        state.loaded = value
    },
    setStagesList(state, data) {
        state.stagesList = data
    },
    setQuality(state, data) {
        state.quality = data
    },
    setKeyboard(state, data) {
        state.keyboard = data
    }
}

export const actions = {
    loadStagesList({
        commit
    }) {
        return new Promise((resolve, reject) => {
            database.ref('/stagesList/').once('value').then((snapshot) => {
                var data = snapshot.val()
                commit("setStagesList", Object.values(data))
                resolve(Object.values(data))
            })

        })
    }
}