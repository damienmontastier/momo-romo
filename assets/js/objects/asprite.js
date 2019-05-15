import * as THREE from 'three'

export default class Sprite extends THREE.Object3D{
    constructor(camera,texture,json,{wTiles,hTiles}) {
        super()
        this.camera = camera
        this.texture = new THREE.TextureLoader().load(texture);
        this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
        this.json = json;

        this.wTiles = wTiles;
        this.hTiles = hTiles;
        
        this.texture.flipY = true
        this.texture.flipX = true
        this.init()
    }

    init() {
        this.currentTile = 0;
        this.currentTime = 0;
        this.durationPerTile = 500;
        this.spritesMap = [];
        this.geometry = new THREE.PlaneGeometry( 1,1,1 );

        this.uniforms = {
            time: {
                value: 0
            },
            texture: {
                value: this.texture
            },
            tiles: {
               value: new THREE.Vector2(this.wTiles,this.hTiles)
            },
            offset: {
                value: new THREE.Vector2(0,0)
            }
        }
        

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( vec3(position), 1.0 );
                }
            `,
            fragmentShader: `
                uniform sampler2D texture;
                uniform float time;
                uniform vec2 tiles;
                uniform vec2 offset;

                varying vec2 vUv;

                void main() {
                    vec2 o = vec2(offset.x,-offset.y + (tiles.y-1.));
                    vec2 t = vUv * vec2(1./tiles.x,1./tiles.y) + (o/tiles);
                    gl_FragColor = texture2D(texture,t);
                }
            `,
            transparent:true
        });

        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.render()

        this.currentTile = 0;
        this.setOffset()
    }

    newSprites() {
        this.spritesMap = []
        return this
    }

    start() {
        console.log(this.spritesMap)
        
    }

    addState(id,opts) {
        let sprite = this.json.find(sprite => sprite.id === id);
        if(sprite) {
            this.spritesMap.push(sprite)
        }
        return this
    }

    setOffset() {
        // console.log(this.currentTile)
        let indexRow = Math.floor(this.currentTile / this.hTiles);
        let indexColumn = this.currentTile % this.hTiles;
        
        // console.log(indexRow,indexColumn)
        this.uniforms.offset.value.x = indexColumn;
        this.uniforms.offset.value.y = indexRow%this.hTiles;
    }

    render() {
        this.add( this.mesh );
        
    }

    update(delta) {
        this.mesh.lookAt(this.camera.position)

        // console.log(delta)
        
        this.currentTime += delta;
        if(this.currentTime >= this.durationPerTile) {
            this.setOffset()
            this.currentTile += 1
            this.currentTime = 0
            if(this.currentTile > 10) {
                console.log('end')
                this.currentTile = 0
            }
        }
        
    }
}