import {
    storage,
    database
} from '@/config/FirebaseInit'

import atlases from '@/static/textures/atlases'

export const state = () => ({
    atlases: atlases,
    currentStageId: null,
    stage: null,
    loaded: false,
    duration: 0,
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
    resetLoaded(state) {
        state.loaded = false
    },
    setLoadingDuration(state, value) {
        state.duration = value
    },
}

export const getters = {
    currentAtlas: (state) => {
        return state.atlases[state.currentStageId]
    }
}

export const actions = {
    async loadStage({
        commit,
        getters
    }, id) {
        await commit('setCurrentStageId', id)
        await getters.currentAtlas
        let snapshot = await database.ref('/stages/' + id).once('value')
        let data = await snapshot.val()
        await commit('setStage', data)
        await commit('setLoaded', true)
    }
}