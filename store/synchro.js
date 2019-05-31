import io from "socket.io-client";

const serverURL = 'https://blooming-garden-58138.herokuapp.com/'
const URL = 'https://momo-romo.netlify.com/'

export const state = () => ({
    socket: null,
    device: null,
    roomID: null,
    isSynchro: false,
    serverURL: serverURL,
    url: null,
})

export const getters = {

}

export const mutations = {
    connection(state) {
        console.log('connection', state.device, state.roomID)
        state.socket = io(serverURL, {
            query: {
                device: state.device,
                roomID: state.roomID
            },
            autoConnect: false
        });
        state.socket.connect()
    },
    disconnection(state) {
        state.socket.disconnect()
    },
    init(state) {
        state.socket.on('room created', (id) => {
            state.url = URL + id
            console.log('room created', state.url)
            state.roomID = id
        })

        state.socket.on('room joined', (id) => {
            console.log('room joined', id)
            state.roomID = id
        })

        state.socket.on('synchro', (value) => {
            state.isSynchro = value
        })

        state.socket.on('disconnect', (reason) => {
            console.log('disconnect', reason)
            setTimeout(() => {
                state.socket.io.opts.query = {
                    device: state.device,
                    roomID: state.roomID
                }
                state.socket.connect()
            }, 2000)

        });

        state.socket.on('connect', () => {
            console.log('connect')
        })

        state.socket.on('debug', (v) => {
            console.log(v)
        })
    },
    setDevice(state, device) {
        state.device = device ? 'mobile' : 'desktop';
    },
    setRoomID(state, roomID) {
        state.roomID = roomID;
    },
}

export const actions = {
    connect({
        commit
    }, {
        device,
        roomID
    }) {
        commit('setDevice', device);
        commit('setRoomID', roomID);
        commit('connection');
        commit('init');
    },
    disconnect({
        commit
    }, {}) {
        commit('disconnection');
    }
}