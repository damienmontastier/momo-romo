const levels = require('../static/content/level/levels.json');

export const state = () => ({
    counter: "10",
    levels: levels
})

export const mutations = {
    increment(state) {
        state.counter++
    }
}