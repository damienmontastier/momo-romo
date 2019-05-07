import sceneLevel from "@/assets/js/game/sceneLevel.js";
import TextureAtlas from '@/assets/js/utils/TextureAtlas.js';

export default class Game {
    constructor() {

    }
    start(opts) {
        this.currentLevelParams = opts.currentLevelParams
        this.currentAltlas = opts.currentAltlas

        this.sceneLevel = new sceneLevel({
            levelParams: this.currentLevelParams,
            textureAtlas: new TextureAtlas(this.currentAltlas)
        })
    }
    behind() {
        console.log(this.sceneLevel.behind())
    }
}