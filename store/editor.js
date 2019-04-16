import {
    storage,
    database
} from '@/config/FirebaseInit'

import atlases from '@/static/textures/atlases'
// const stagesPressets = require("@/static/content/levels/levels.json");



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
    },
    export (state, json) {
        database.ref('stages/').set(json, function (error) {
            if (error) {
                // The write failed...
                console.log('export failed', error)
            } else {
                // Data saved successfully!
                console.log('export succeed')
            }
        });
    }
}

export const actions = {
    async get({
        commit
    }) {
        // let url = await storage.ref('levels1.json').getDownloadURL()
        // let response = await fetch(url)
        // let data = await response.json()
        let snapshot = await database.ref('/stages').once('value')
        let data = await snapshot.val()
        console.log(data)
        await commit('setStages', data)
        await commit('setCurrentStageId', Object.keys(data)[0])
        await commit('setLoaded', true)
    }
}