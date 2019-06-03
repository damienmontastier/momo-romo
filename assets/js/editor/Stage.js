import * as THREE from 'three'
import FixedProp from '../objects/FixedProp'
import History from '../editor/History'
import Platform from '../editor/Platform'
import AnimatedProp from "@/assets/js/objects/AnimatedProp";

export default class Stage extends THREE.Object3D {
    constructor(opts) {
        super()
        if (opts.model) {
            this.modelIMG = opts.model
            this.addModelToScene()
        }

        this.textureAtlas = opts.textureAtlas;
        // this.fixedProps = [ ...opts.pressets.props.fixed ];
        this.fixedPropsGroup = new THREE.Group()
        this.fixedPropsGroup.name = 'fixedPropsGroup'
        this.add(this.fixedPropsGroup)
        this.fixedProps = []

        this.platformsGroup = new THREE.Group()
        this.platformsGroup.name = 'platformsGroup'
        this.add(this.platformsGroup)
        this.platforms = []

        this.animatesGroup = new THREE.Group()
        this.animatesGroup.name = 'spriteAnimateGroup'
        this.add(this.animatesGroup)
        this.animates = []

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
                },
                checkpoint: {
                    minigame: prop.checkpointMinigame || false,
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

        let animates = [];
        this.animates.filter(animate => animate.visible).forEach((animate) => {
            console.log('animate paraaaams', animate)
            animates.push({
                position: {
                    x: animate.position.x,
                    y: animate.position.y,
                    z: animate.position.z,
                },
                rotation: {
                    x: animate.rotation.x,
                    y: animate.rotation.y,
                    z: animate.rotation.z,
                },
                scale: {
                    x: animate.scale.x,
                    y: animate.scale.y,
                    z: animate.scale.z,
                },
                params: {
                    w: animate.animate.wTiles,
                    h: animate.animate.hTiles,
                    png: animate.animate.textureURL,
                    json: animate.animate.json
                }
            })
        });

        this.pressets.animates = animates;

        return {
            id: this.pressets.id,
            pressets: this.pressets
        }
    }

    init() {
        //init fixed Props
        if (this.pressets.props.fixed) {
            this.pressets.props.fixed.forEach((prop, index) => {
                this.addFixedProp(prop)
            });
        }

        if (this.pressets.platforms) {
            this.pressets.platforms.forEach(platform => {
                this.addPlatform(platform)
            });
        }

        if (this.pressets.animates) {

            this.pressets.animates.forEach(animate => {
                this.addAnimate(animate)
            });
        }
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

    addModelToScene() {
        this.modelTexture = new THREE.TextureLoader().load(
            this.modelIMG,
            (texture) => {
                let width = texture.image.width;
                let height = texture.image.height;
                let ratio = width / height
                let geometry = new THREE.PlaneGeometry(5 * ratio, 5, 1);
                let material = new THREE.MeshBasicMaterial({
                    // color: 0xffff00,
                    side: THREE.DoubleSide,
                    map: texture,
                    opacity: 0.25,
                    transparent: true
                });
                this.model = new THREE.Mesh(geometry, material);
                this.model.position.set((5 * ratio) / 2, 1.5, -0.1)
                this.model.scale.set(1, -1, 1)
                this.add(this.model)
            }, );

        // let geometry = new THREE.PlaneGeometry(5, 20, 1);
        // let material = new THREE.MeshBasicMaterial({
        //     // color: 0xffff00,
        //     side: THREE.DoubleSide,
        //     map: this.modelTexture
        // });
        // this.model = new THREE.Mesh(geometry, material);
        // this.add(this.model)
    }

    addPlatform(params) {
        let platform = new Platform(params)

        let position = typeof params == "undefined" || undefined ? new THREE.Vector3(0, 0, 0) : params.position
        let rotation = typeof params == "undefined" || undefined ? new THREE.Vector3(0, 0, 0) : params.rotation
        let scale = typeof params == "undefined" || undefined ? new THREE.Vector3(1, 1, 6) : params.scale

        platform.scale.set(scale.x, scale.y, scale.z)
        platform.position.set(position.x, position.y, position.z)
        platform.rotation.set(rotation.x, rotation.y, rotation.z)

        this.platforms.push(platform)

        this.platformsGroup.add(platform)

        return platform
    }

    addAnimate(params) {
        new AnimatedProp(params).then((animate) => {

            let position = typeof params.position == "undefined" || undefined ? new THREE.Vector3(0, 0, 0) : params.position
            let rotation = typeof params.rotation == "undefined" || undefined ? new THREE.Vector3(0, 0, 0) : params.rotation
            let scale = typeof params.scale == "undefined" || undefined ? new THREE.Vector3(1, 1, 1) : params.scale

            animate.scale.set(scale.x, scale.y, scale.z)
            animate.position.set(position.x, position.y, position.z)
            animate.rotation.set(rotation.x, rotation.y, rotation.z)

            this.animates.push(animate)
            this.animatesGroup.add(animate)

            return animate
        })
    }

    addFixedProp({
        _id,
        position,
        rotation,
        scale,
        checkpoint
    }) {
        let id = _id
        rotation = rotation || new THREE.Vector3(0, 0, 0)
        position = position || new THREE.Vector3(0, 0, 0)
        scale = scale || new THREE.Vector3(1, 1, 1)
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

        prop.checkpointMinigame = typeof checkpoint == "undefined" || undefined ? false : checkpoint.minigame

        this.fixedProps.push(prop);
        // this.add(prop);
        this.fixedPropsGroup.add(prop)
        return prop
    }
}