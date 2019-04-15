import * as firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'

var config = {
        apiKey: "AIzaSyA7gIDPTHPKJ00Ca30x9G37K1hKgIXszF8",
        authDomain: "momo-romo.firebaseapp.com",
        databaseURL: "https://momo-romo.firebaseio.com",
        projectId: "momo-romo",
        storageBucket: "momo-romo.appspot.com",
        messagingSenderId: "832096293696"
    }

    !firebase.apps.length ? firebase.initializeApp(config) : ''

export const storage = firebase.storage()
export const database = firebase.database()

export default firebase