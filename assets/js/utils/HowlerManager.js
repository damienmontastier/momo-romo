import {
    Howl,
    Howler
} from 'howler';

class HowlerManager {
    constructor() {
        this.sounds = {}
    }

    add(sounds) {
        let promises = []
        sounds.forEach((sound) => {
            if (!Object.keys(this.sounds).includes(sound.id)) {
                let promise = new Promise((resolve, reject) => {
                    let howl = new Howl({
                        src: [sound.src],
                        onload: () => {
                            resolve()
                        }
                    });
                    this.sounds[sound.id] = howl
                })
                promises.push(promises)
            } else {
                console.warn(sound.id + ' already exist, not added to Manager')
            }
        })

        return new Promise((resolve, reject) => {
            Promise.all(promises)
                .then(() => {
                    resolve(this.sounds)
                })
        })

    }

    stop() {
        Object.values(this.sounds).forEach(sound => {
            sound.stop()
        });
    }

    // play(id) {
    //     if(Object.keys(this.sounds).includes(id)) {
    //         let sound = this.sounds[id]
    //         sound.play()
    //     }
    // }

    // find() {

    // }
}

export default new HowlerManager()


// import HowlerManager from "~/assets/js/utils/HowlerManager";

// import countdown_3 from "~/static/sounds/countdown_3.mp3";
// import countdown_2 from "~/static/sounds/countdown_2.mp3";
// import countdown_1 from "~/static/sounds/countdown_1.mp3";

// HowlerManager.add(
//    [
//      {
//        id:"countdown_1",
//        src:countdown_1
//      },
//      {
//        id:"countdown_2",
//        src:countdown_2
//      },
//      {
//        id:"countdown_3",
//        src:countdown_3
//      }
//    ]
//  )
//  .then((sounds)=> {
//      sounds.countdown_1.play()
//  })