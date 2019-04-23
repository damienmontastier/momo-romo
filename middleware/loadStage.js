import {
  storage,
  database
} from '@/config/FirebaseInit'

export default function ({
  store,
  route,
  redirect
}) {
  return new Promise((resolve, reject) => {
    store.dispatch("loadStagesList").then((stages) => {
      if (Object.values(stages).includes(route.params.level)) {

      } else {
        console.log(route.path)
        redirect(route.path, {
          room: true
        })
      }

      resolve()
    })
  })
}