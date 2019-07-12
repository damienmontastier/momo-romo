// {
//     id:'bowl',
//      url:'url
//      type:'model'
// }

import * as THREE from "three";

class AssetsLoader {
  constructor() {
    this.resources = {};
  }

  add() {}

  loadTexture(media) {
    return new Promise((resolve, reject) => {
      new THREE.TextureLoader().load(
        media.url,
        texture => {
          resolve({
            id: media.id,
            media: texture
          });
        },
        xhr => {
          console.log(`${(xhr.loaded / xhr.total) * 100} % loaded`);
        },
        xhr => {
          reject(
            `Une erreur est survenue lors du chargement de la texture : ${xhr}`
          );
        }
      );
    });
  }

  loadModel(model) {
    return new Promise((resolve, reject) => {
      const ext = model.url.split(".").pop();

      switch (ext) {
        case "obj": {
          const loader = new THREE.OBJLoader();

          // load a resource
          loader.load(
            // resource URL
            model.url,
            // Function when resource is loaded
            object => {
              resolve({ id: model.id, media: object, type: "obj" });
            },

            () => {},
            () => {
              reject("An error happened with the model import.");
            }
          );
          break;
        }

        case "gltf": {
          const loader = new THREE.GLTFLoader();

          // load a resource
          loader.load(
            // resource URL
            model.url,
            // Function when resource is loaded
            object => {
              resolve({ id: model.id, media: object, type: "gltf" });
            },

            () => {},
            () => {
              reject("An error happened with the model import.");
            }
          );
          break;
        }

        default: {
          const loader = new THREE.OBJLoader();

          // load a resource
          loader.load(
            // resource URL
            model.url,
            // Function when resource is loaded
            object => {
              resolve({ id: model.id, media: object, type: "obj" });
            },

            () => {},
            () => {
              reject("An error happened with the model import.");
            }
          );
        }
      }
    });
  }
}

export default new AssetsLoader();
