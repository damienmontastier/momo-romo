import sceneLevel from "@/assets/js/game/sceneLevel.js";
import TextureAtlas from '@/assets/js/utils/TextureAtlas.js';
import {
    throws
} from "assert";

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
    preRenderProps() {
        this.sceneLevel.preRenderProps()
    }
}