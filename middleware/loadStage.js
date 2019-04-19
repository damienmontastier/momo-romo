import {
  storage,
  database
} from '@/config/FirebaseInit'

export default function ({
  store,
  route
}) {
  var dataSnapshot = database.ref('/stages/' + route.params.level);
  dataSnapshot.on('value', (snapshot) => {
    let data = snapshot.val()
    store.commit('game/setStage', data)
  });
}