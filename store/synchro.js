import io from "socket.io-client";

const serverURL = 'https://blooming-garden-58138.herokuapp.com/'

export const state = () => ({
    socket: null,
})

export const getters = {

}

export const mutations = {
    init(state) {
        state.socket = io(url, {
            query: {
              type: "desktop",
            },
          });
    }
}

export const actions = {
    async init({
        commit
    }) {

    }
}