import * as THREE from 'three';
import levelScene from "@/assets/js/game/levelScene.js";
import TextureAtlas from '@/assets/js/utils/TextureAtlas.js';

export default class Game {
    constructor(opts) {
        this.currentLevelParams = opts.currentLevelParams
        this.currentAltlas = opts.currentAltlas
    }
    start() {
        this.levelScene = new levelScene({
            levelParams: this.currentLevelParams,
            textureAtlas: new TextureAtlas(this.currentAltlas)
        })
    }
}