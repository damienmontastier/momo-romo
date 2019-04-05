import * as THREE from 'three';

export default class GridsHelper extends THREE.Object3D {
    constructor(opts) {
        super()
        this.size = opts.size;
        this.divisions = opts.divisions || opts.size;
        this.render();
    }

    render() {
        this.gridMesh = new THREE.GridHelper( this.size, this.divisions,0x888888 );
    
        this.gridHelperX = new THREE.Group();
        for(let i = 0; i<20; i++) {
            let g = this.gridMesh.clone();
            g.position.x = this.size * i + this.size/2;
            g.position.z = this.size/2;
            this.gridHelperX.add(g);
        }

        this.gridHelperY = new THREE.Group();
        for(let i = 0; i<20; i++) {
            let g = this.gridMesh.clone();
            g.position.x = this.size * i + this.size/2;
            g.position.y = this.size/2;
            g.rotation.x = THREE.Math.degToRad(90);
            this.gridHelperY.add(g);
        }

        this.gridHelperZ = new THREE.Group();
        let g = this.gridMesh.clone();
        g.rotation.z = THREE.Math.degToRad(90);
        g.position.z = this.size/2;
        g.position.y = this.size/2;
        this.gridHelperZ.add(g);

        this.add( this.gridHelperX );
        this.add( this.gridHelperY );
        this.add( this.gridHelperZ );
    }
}