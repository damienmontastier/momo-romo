import * as THREE from 'three'
import FixedProp from '../objects/FixedProp'
import History from '../editor/History'
import Platform from '../editor/Platform'

export default class Stage  extends THREE.Object3D{
    constructor(opts) {
        super()
        this.textureAtlas = opts.textureAtlas;
        // this.fixedProps = [ ...opts.pressets.props.fixed ];
        this.fixedProps = []
        this.platforms = []
        this.pressets = { ...opts.pressets };
        // console.log(this.pressets)
        //     let store
        //     if (process.browser) {
        //     window.onNuxtReady(({$store}) => {
        //         store = $store
        //         console.log(store.state.editor)
        //     })
        // }
        

        // window.addEventListener('click',()=>{
        //     this.export()
        // })
    }

    export() {
        //export fixed props
        let fixedprops = [];
        this.fixedProps.filter(prop => prop.visible).forEach((prop)=>{
            fixedprops.push({_id: prop._id, position: prop.position, rotation: prop.rotation, scale: prop.scale})
        });
        this.pressets.props.fixedProps = fixedprops;

        //TODO : Export platforms
        // let platforms = [];
        // this.platforms.filter(platform => platform.visible).forEach((platform)=>{
        //     platforms.push({position: platform.position, rotation: platform.rotation, scale: platform.scale})
        // });

        console.log(this.pressets.id,this.pressets);
    }

    init() {
        //init fixed Props
        this.pressets.props.fixed.forEach(prop => {
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
        History.push({name: 'deleted',target: target,copy:{}})
    }

    addPlatform(params) {
        let platform = new Platform(params)

        let position = typeof params == "undefined" || undefined ? new THREE.Vector3(0,0,0) : params.position
        let rotation = typeof params == "undefined" || undefined ? new THREE.Vector3(0,0,0) : params.rotation

        platform.position.set(position.x * .5, position.y, position.z)
        platform.rotation.set(rotation.x, rotation.y, rotation.z)
        
        this.platforms.push(platform)

        this.add(platform)        
    }

    addFixedProp({_id,position,rotation}) {
        let id = _id
        rotation = rotation || new THREE.Vector3(0,0,0)
        position = position || new THREE.Vector3(0,0,0)
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
        prop.position.set((t._data.ratio * 0.5) + position.x, 0.5 + position.y, 0 + position.z);
        prop.rotation.set(rotation.x,rotation.y,rotation.z)
        prop.index = this.fixedProps.length
        this.fixedProps.push(prop);
        this.add(prop);
    }
}