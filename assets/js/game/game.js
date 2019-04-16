import sceneLevel from "@/assets/js/game/sceneLevel.js";
import TextureAtlas from '@/assets/js/utils/TextureAtlas.js';

export default class Game {
    constructor(opts) {
        console.log(opts)
        this.currentLevelParams = opts.currentLevelParams
        this.currentAltlas = opts.currentAltlas
    }
    start() {
        this.sceneLevel = new sceneLevel({
            levelParams: this.currentLevelParams,
            textureAtlas: new TextureAtlas(this.currentAltlas)
        })
    }
}