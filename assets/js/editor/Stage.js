import * as THREE from 'three'
import FixedProp from '../objects/FixedProp'

export default class Stage  extends THREE.Object3D{
    constructor(opts) {
        super()
        this.textureAtlas = opts.textureAtlas;
        this.fixedProps = [ ...opts.pressets.props.fixed ];
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
        //     this.exportPressets()
        // })
    }

    exportPressets() {
        let fixedprops = [];
        this.fixedProps.forEach((prop)=>{
            fixedprops.push({_id: prop._id, position: prop.position})
        });
        this.pressets.props.fixedProps = fixedprops;
        // console.log(this.pressets.id,this.pressets);
    }

    init() {
        this.fixedProps.forEach(prop => {
            this.addFixedProp(prop)
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

    addFixedProp({_id,position,rotation}) {
        let id = _id
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
        prop.rotation.set(rotation.x,rotation.y,rotation.z);
        this.fixedProps.push(prop);
        this.add(prop);
    }
}