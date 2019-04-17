import atlases from '@/static/textures/atlases'

export const state = () => ({
    atlases: atlases,
    currentStageId: null,
    stage: null,
})

export const mutations = {
    setCurrentStageId(state, id) {
        state.currentStageId = id
    },
    setStage(state, data) {
        state.stage = data
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