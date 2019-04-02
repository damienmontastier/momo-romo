const levels = require('@/static/content/levels/levels.json');
import atlases from '@/static/textures/atlases'

export const state = () => ({
    levels: levels,
    atlases: atlases,
})

export const getters = {
    // currentAtlas: state => {
    //     return state.atlases[state.id]
    // },
}

export const mutations = {
    // setCurrentStageId(state, id) {
    //     console.log('coucou')
    //     // state.currentStageId = id
    // }
}