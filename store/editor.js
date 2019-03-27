import atlases from '@/static/textures/atlases'
const stagesPressets = require("@/static/content/level/levels.json");

export const state = () => ({
    atlases: atlases,
    stages: stagesPressets,
    currentStageId: Object.keys(stagesPressets)[0]
})

export const getters = {
    currentStage: state => {
        return state.stages[state.currentStageId]
    },
    currentAtlas: (state,getters) => {
        return state.atlases[getters.currentStage.atlas]
    }
}

export const mutations = {
    setCurrentStageId(state, id) {
        state.currentStageId = id
    }
}