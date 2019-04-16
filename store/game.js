import {
    storage,
    database
} from '@/config/FirebaseInit'

import atlases from '@/static/textures/atlases'

export const state = () => ({
    atlases: atlases,
    currentStageId: null,
    stages: null,
    loaded: false
})

export const mutations = {
    setCurrentStageId(state, id) {
        state.currentStageId = id
    },
    setStages(state, data) {
        state.stages = data
    },
    setLoaded(state, value) {
        state.loaded = value
    },
}

export const getters = {
    currentStage: state => {
        return state.stages[state.currentStageId]
    },
    currentAtlas: (state) => {
        return state.atlases[state.currentStageId]
    }
}

// export const actions = {
//     async get({
//         commit,
//         state
//     }) {
//         let snapshot = await database.ref('stages/').once('value')
//         let data = await snapshot.val()
//         await commit('setStages', data)
//         await commit('setLoaded', true)
//     }
// }