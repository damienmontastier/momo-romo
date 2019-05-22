import * as THREE from 'three';
import GLTFLoader from '~/assets/js/utils/GLTFLoader';
import OBJLoader from '~/assets/js/utils/OBJLoader';

class ObjectLoader {
    constructor() {
    }

    load(opts) {
        let url = opts.url;
        let format = opts.format;
        if (format === "obj") {
            this.loader = new OBJLoader();
        } else if (format === "gltf" || format === "glb") {
            this.loader = new GLTFLoader();
        }
        return new Promise((resolve, reject) => {
            this.loader.load(
                url,
                object => {
                    resolve(object);
                },
                xhr => {},
                error => {
                    reject(error);
                }
            );
        });
    }
}

export default new ObjectLoader();