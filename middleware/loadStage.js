import {
  storage,
  database
} from '@/config/FirebaseInit'

export default function ({
  store,
  route,
  redirect
}) {
  console.log('passing')
  return new Promise((resolve, reject) => {
    store.dispatch("loadStagesList").then((stages) => {
      if (!Object.values(stages).includes(route.params.level)) {
        redirect(route.path, {
          room: true
        })
      }
      resolve()
    })
  })
}