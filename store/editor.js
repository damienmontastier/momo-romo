import {
    storage
} from '@/config/FirebaseInit'

import atlases from '@/static/textures/atlases'
// const stagesPressets = require("@/static/content/levels/levels.json");

export const strict = false

export const state = () => ({
    atlases: atlases,
    stages: null,
    currentStageId: null,
    draggingPropId: null,
    loaded: false
})

export const getters = {
    currentStage: state => {
        return state.stages[state.currentStageId]
    },
    currentAtlas: (state, getters) => {
        return state.atlases[getters.currentStage.atlas]
    },
    isDragging: (state) => {
        return Boolean(state.draggingPropId != null)
    }
}

export const mutations = {
    setCurrentStageId(state, id) {
        state.currentStageId = id
    },
    setDraggingPropId(state, id) {
        state.draggingPropId = id
    },
    setStages(state, stages) {
        state.stages = stages
    },
    setLoaded(state, value) {
        state.loaded = value
    }
}

export const actions = {
    async get({
        commit
    }) {
        let url = await storage.ref('levels.json').getDownloadURL()
        let response = await fetch(url)
        let data = await response.json()
        await commit('setStages', data)
        await commit('setCurrentStageId', Object.keys(data)[0])
        await commit('setLoaded', true)
    }
}