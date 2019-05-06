import * as THREE from 'three';
import '~/assets/js/utils/GLTFLoader';

class ObjectLoader {
    constructor() {
    }

    load(opts) {
        let url = opts.url;
        let format = opts.format;
        if (format === "obj") {
            this.loader = new THREE.OBJLoader();
        } else if (format === "gltf" || format === "glb") {
            this.loader = new THREE.GLTFLoader();
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