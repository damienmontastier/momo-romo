import * as THREE from 'three'
import FixedProp from '../objects/FixedProp'

export default class Stage {
    constructor(opts) {
        this.textureAtlas = opts.textureAtlas
        this.group = new THREE.Group()
        this.fixedProps = opts.props || []
    }

    init() {
        // this.props.forEach(prop => {
        //     this.addProp(prop.id)
        // });
    }

    loadTextureAtlas() {
        if (!this.textureAtlas.isLoaded) {
            this.textureAtlas.load().then(textures => {
                this.textures = textures;
            });
        } else {
            this.textures = this.textureAtlas.textures
        }
    }

    addFixedProp(id) {

        let t = this.textureAtlas.get(id);
        let prop = new FixedProp({
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
        prop.mesh.position.set(t._data.ratio * 0.5, 0.5, 0);
        prop.mesh._id = id
        this.fixedProps.push(prop)
        this.group.add(prop.mesh);
    }
}