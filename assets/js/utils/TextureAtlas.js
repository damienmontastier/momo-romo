import * as THREE from "three";

export default class TextureAtlas {
  constructor(json, image) {
    this.textures = {};
    this.json = json;
    this.image = image;
  }

  get isLoaded() {
    return Object.keys(this.textures).length > 0
  }

  get(id) {
    return this.textures[id];
  }

  load() {
    return new Promise((resolve, reject) => {
      this.loader = new THREE.TextureLoader();
      this.loader.load(
        this.image,
        //onLoad
        texture => {
          for (let key in this.json.frames) {
            let image = texture.image;

            let t = texture.clone();
            let frame = this.json.frames[key];
            let data = frame.frame;
            t.repeat.set(data.w / image.width, data.h / image.height);
            t.offset.x = data.x / image.width;
            t.offset.y = 1 - data.h / image.height - data.y / image.height;
            t.needsUpdate = true;
            data.ratio = data.w / data.h;
            t._data = data;
            this.textures[frame.filename.replace(".png", "").toLowerCase()] = t;
          }
          resolve(this.textures);
        },
        // onProgress
        undefined,
        // onError
        err => {
          reject(err);
        }
      );
    });
  }
}