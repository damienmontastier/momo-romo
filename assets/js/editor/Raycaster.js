import * as THREE from 'three'

class Raycaster extends THREE.Raycaster {
    constructor() {
        super()
    }

    use(mouse, group) {
        this.setFromCamera(mouse, this.camera);
        let intersects = this.intersectObjects(group, true);
        return intersects;
    }
}

export default new Raycaster()