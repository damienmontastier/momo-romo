import {
  storage,
  database
} from '@/config/FirebaseInit'

export default function ({
  store
}) {
  var starCountRef = database.ref('stages/');
  starCountRef.on('value', (snapshot) => {
    let data = snapshot.val()
    store.commit('setStages', data)
  });
}