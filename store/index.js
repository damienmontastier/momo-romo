import {
    storage,
    database
} from '@/config/FirebaseInit'

export const strict = false

export const state = () => ({
    stages: null,
    loaded: false
})

export const mutations = {
    setStages(state, data) {
        state.stages = data
    },
    setLoaded(state, value) {
        state.loaded = value
    },
}

export const actions = {
    async get({
        commit,
        state
    }) {
        let snapshot = await database.ref('stages/').once('value')
        let data = await snapshot.val()
        await commit('setStages', data)
        await commit('setLoaded', true)
    }
}