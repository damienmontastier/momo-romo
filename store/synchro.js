import io from "socket.io-client";

const serverURL = 'https://blooming-garden-58138.herokuapp.com/'
const URL = 'http://localhost:3000/synchro/?id='

export const state = () => ({
    socket: null,
    device: null,
    roomID: null,
    isSynchro: false,
    serverURL: serverURL,
    url: URL
})

export const getters = {

}

export const mutations = {
    init(state, roomID) {
        state.socket = io(serverURL, {
            query: {
                device: state.device,
                roomID: roomID
            }
        });
        state.socket.on('room created', (id) => {
            console.log('room created', 'http://localhost:3000/synchro/?id=' + id)
            state.roomID = id
        })

        state.socket.on('room joined', (id) => {
            console.log('room joined', id)
            state.roomID = id
        })

        state.socket.on('synchro', (value) => {
            console.log('SYNCHRO', value)
            state.isSynchro = value
        })

        state.socket.on('debug', (v) => {
            console.log(v)
        })
    },
    setDevice(state, device) {
        state.device = device ? 'mobile' : 'desktop';
    }
}

export const actions = {
    async init({
        commit
    }, {
        device,
        roomID
    }) {
        commit('setDevice', device);
        commit('init', roomID);
    }
}