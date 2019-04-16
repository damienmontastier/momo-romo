const levels = require('@/static/content/levels/levels.json');

export const strict = false

export const state = () => ({
    counter: "10",
    levels: levels
})

export const mutations = {
    increment(state) {
        state.counter++
    }
}