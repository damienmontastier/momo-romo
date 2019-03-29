import atlases from '@/static/textures/atlases'
const stagesPressets = require("@/static/content/level/levels.json");

export const state = () => ({
    atlases: atlases,
    stages: stagesPressets,
    currentStageId: Object.keys(stagesPressets)[0],
    draggingPropId: null
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
    }
}