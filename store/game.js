// const levels = require('@/static/content/levels/levels.json');
import {
    storage,
    database
} from '@/config/FirebaseInit'
import atlases from '@/static/textures/atlases'

export const state = () => ({
    // levels: levels,
    atlases: atlases,
    currentStageId: null,
    stage: null,
    loaded: false
})

export const mutations = {
    setCurrentStageId(state, id) {
        state.currentStageId = id
    },
    setStage(state, data) {
        state.stage = data
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
        let snapshot = await database.ref('/stages/'+state.currentStageId).once('value')
        let data = await snapshot.val()
        await commit('setStage', data)
        await commit('setLoaded', true)
    }
}