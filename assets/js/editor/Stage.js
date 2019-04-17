import * as THREE from 'three'
import FixedProp from '../objects/FixedProp'
import History from '../editor/History'
import Platform from '../editor/Platform'

export default class Stage extends THREE.Object3D {
    constructor(opts) {
        super()
        this.textureAtlas = opts.textureAtlas;
        // this.fixedProps = [ ...opts.pressets.props.fixed ];
        this.fixedProps = []
        this.platforms = []
        this.pressets = {
            ...opts.pressets
        };
        // console.log(this.pressets)
        //     let store
        //     if (process.browser) {
        //     window.onNuxtReady(({$store}) => {
        //         store = $store
        //         console.log(store.state.editor)
        //     })
        // }

        if (!this.pressets.props) {
            this.pressets.props = {
                fixed: [],
                sprites: []
            }
        }


        // window.addEventListener('click',()=>{
        //     this.export()
        // })
        this.loadTextureAtlas()
    }

    export () {
        //export fixed props
        let fixedprops = [];
        this.fixedProps.filter(prop => prop.visible).forEach((prop) => {
            fixedprops.push({
                _id: prop._id,
                position: {
                    x: prop.position.x,
                    y: prop.position.y,
                    z: prop.position.z
                },
                rotation: {
                    x: prop.rotation.x,
                    y: prop.rotation.y,
                    z: prop.rotation.z
                },
                scale: {
                    x: prop.scale.x,
                    y: prop.scale.y,
                    z: prop.scale.z
                }
            })
        });
        // !this.pressets.props ? this.pressets.props = {} : null;

        // !this.pressets.props.fixed ? this.pressets.props.fixed = [] : null;
        // !this.pressets.props.platforms ? this.pressets.props.platforms = [] : null;

        this.pressets.props.fixed = fixedprops;

        //TODO : Export platforms
        let platforms = [];
        this.platforms.filter(platform => platform.visible).forEach((platform) => {
            platforms.push({
                position: {
                    x: platform.position.x,
                    y: platform.position.y,
                    z: platform.position.z,
                },
                rotation: {
                    x: platform.rotation.x,
                    y: platform.rotation.y,
                    z: platform.rotation.z,
                },
                scale: {
                    x: platform.scale.x,
                    y: platform.scale.y,
                    z: platform.scale.z,
                }
            })
        });

        this.pressets.platforms = platforms;

        return {
            id: this.pressets.id,
            pressets: this.pressets
        }
    }

    init() {
        //init fixed Props
        this.pressets.props.fixed.forEach((prop, index) => {
            this.addFixedProp(prop)
        });

        this.pressets.platforms.forEach(platform => {
            this.addPlatform(platform)
        });
    }

    loadTextureAtlas() {
        if (!this.textureAtlas.isLoaded) {
            this.textureAtlas.load().then(textures => {
                this.textures = textures;
                this.init()
            });
        } else {
            this.textures = this.textureAtlas.textures;
        }
    }

    removeElement(target) {
        target.visible = false
        History.push({
            name: 'deleted',
            target: target,
            copy: {}
        })
    }

    addPlatform(params) {
        let platform = new Platform(params)

        console.log(params)
        let position = typeof params == "undefined" || undefined ? new THREE.Vector3(0, 0, 0) : params.position
        let rotation = typeof params == "undefined" || undefined ? new THREE.Vector3(0, 0, 0) : params.rotation
        let scale = typeof params == "undefined" || undefined ? new THREE.Vector3(1, 1, 6) : params.scale

        platform.scale.set(scale.x, scale.y, scale.z)
        platform.position.set(position.x, position.y, position.z)
        platform.rotation.set(rotation.x, rotation.y, rotation.z)

        this.platforms.push(platform)

        this.add(platform)

        return platform
    }

    addFixedProp({
        _id,
        position,
        rotation, 
        scale
    }) {
        let id = _id
        rotation = rotation || new THREE.Vector3(0, 0, 0)
        position = position || new THREE.Vector3(0, 0, 0)
        scale = scale || new THREE.Vector3(1, 1, 1)
        console.log(id, 'prop added')
        let t = this.textureAtlas.get(id);
        let prop = new FixedProp({
            id: id,
            width: t._data.ratio,
            height: 1,
            material: new THREE.MeshBasicMaterial({
                // color: 0xff0000,
                map: t,
                // // side: THREE.FaceSide,
                transparent: true,
                alphaTest: 0.5,
            })
        });
        prop.position.set(position.x, position.y, position.z);
        prop.rotation.set(rotation.x, rotation.y, rotation.z)
        prop.scale.set(scale.x, scale.y, scale.z)
        prop.index = this.fixedProps.length
        this.fixedProps.push(prop);
        this.add(prop);
        return prop
    }
}