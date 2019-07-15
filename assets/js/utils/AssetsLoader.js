// {
//     id:'bowl',
//      url:'url
//      type:'model'
// }

import * as THREE from "three";
import OBJLoader from './OBJLoader';
import GLTFLoader from './GLTFLoader';

class AssetsLoader {
  constructor() {
    this.resources = {};
  }

  add(resources) {
		let promises = []
		resources.forEach((resource)=>{
			if (!Object.keys(this.resources).includes(resource.id)) {
				switch (resource.type) {
					case 'texture':
						promises.push(this.loadTexture(resource))
						this.resources[resource.id] = {}
						break;
					case 'model':
						promises.push(this.loadModel(resource))
						this.resources[resource.id] = {}
						break;
					default:
						break;
				}
			} else {
				console.warn(resource.id + ' already exist, not added to Manager')
			}
		})
		return new Promise((resolve,reject)=>{
			Promise.all(promises)
			.then((responses)=>{
				responses.forEach((resource)=>{
					this.resources[resource.id] = resource
				})
				resolve(this.resources)
			})
		})

	}

  loadTexture(media) {
    return new Promise((resolve, reject) => {
      new THREE.TextureLoader().load(
        media.url,
        texture => {
          resolve({
            id: media.id,
						media: texture,
						type: 'texture'
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
          const loader = new OBJLoader();

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
				
        case 'gltf': {
          const loader = new GLTFLoader();

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

        case 'glb': {
          const loader = new GLTFLoader();

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
          const loader = new OBJLoader();

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
