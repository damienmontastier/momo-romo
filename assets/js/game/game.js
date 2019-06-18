import sceneLevel from "@/assets/js/game/sceneLevel.js";
import TextureAtlas from '@/assets/js/utils/TextureAtlas.js';
import {
    throws
} from "assert";
import {
    reject
} from "q";

export default class Game {
    constructor() {}
    start(opts, store) {
        this.currentLevelParams = opts.currentLevelParams
        this.currentAltlas = opts.currentAltlas

        this.sceneLevel = new sceneLevel({
            levelParams: this.currentLevelParams,
            textureAtlas: new TextureAtlas(this.currentAltlas)
        }, store)
    }
    reset() {
        this.sceneLevel.reset()
    }
    preRenderProps(callback, addTutorial, hideTutorial) {
        this.sceneLevel.preRenderProps(callback, addTutorial, hideTutorial)
    }
    launchMiniGame() {
        return new Promise((resolve, reject) => {
            this.sceneLevel.launchMiniGame().then(() => {
                resolve()
            })
        })
    }

    launchEndMiniGame() {
        return new Promise((resolve, reject) => {
            this.sceneLevel.launchEndMiniGame().then(() => {
                resolve()
            })
        })
    }
}