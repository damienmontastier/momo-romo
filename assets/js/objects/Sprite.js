import * as THREE from 'three'

export default class Sprite extends THREE.Object3D {
    constructor(textureURL, json, {
        wTiles,
        hTiles
    }) {
        super()
        console.log('yo sprite', textureURL, json, wTiles, hTiles)
        this.textureURL = textureURL
        this.json = json;
        this.wTiles = wTiles;
        this.hTiles = hTiles;

        if (textureURL.image) {
            console.log('textureURL.image')
            this.texture = this.textureURL
            this.resets()
            this.init()
            return this
        } else {
            console.log('textureURL.image else')

            return new Promise((resolve, reject) => {
                this.loadTexture()
                    .then((texture) => {
                        console.log('then((texture)')
                        this.texture = texture
                        this.resets()
                        this.init()
                        resolve(this)
                    })
            })
        }

    }

    resets() {
        console.log('resets()')

        this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
        // this.texture.magFilter = this.texture.minFilter = THREE.NearestFilter;
        // this.texture.anisotropy = 0;
        this.texture.flipY = true
        this.texture.flipX = true
    }

    loadTexture() {
        console.log('loader Texture / Sprite.js')

        let loader = new THREE.TextureLoader();

        return new Promise((resolve, reject) => {
            loader.load(this.textureURL, (texture) => {
                resolve(texture)
            })
        })

    }

    init() {
        console.log('init()')

        this.loaded = true
        this.currentTile = 0;
        this.currentTime = 0;
        this.durationPerTile = 500;
        this.spritesMap = [];
        this.geometry = new THREE.PlaneGeometry(1, 1, 1);

        this.uniforms = {
            time: {
                value: 0
            },
            texture: {
                value: this.texture
            },
            tiles: {
                value: new THREE.Vector2(this.wTiles, this.hTiles)
            },
            offset: {
                value: new THREE.Vector2(0, 0)
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
            transparent: true,
            // depthWrite: false,
            // depthTest: false,
            // depthWrite: false,
            // alphaTest:0
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.render()

        this.currentTile = 0;
        this.setOffset()
    }

    newSprites() {
        this.spritesMap = []
        return this
    }

    start(callback) {
        this.changeState(this.spritesMap[0])
        this.callback = callback
    }

    addState(id) {
        let sprite = this.json.find(sprite => sprite.id === id);
        if (sprite) {
            this.spritesMap.push(sprite)
        }
        return this
    }

    setOffset() {
        // console.log(this.currentTile)
        let indexRow = Math.floor(this.currentTile / this.wTiles);
        let indexColumn = this.currentTile % this.wTiles;

        // console.log(Math.floor(this.currentTile / this.wTiles));
        this.uniforms.offset.value.x = indexColumn;
        this.uniforms.offset.value.y = indexRow % this.hTiles;
    }

    render() {
        this.add(this.mesh);

    }

    changeState(sprite) {
        this.startTile = sprite.start
        this.endTile = sprite.end
        this.currentTile = sprite.start
        this.durationPerTile = sprite.durationTile
        this.currentTime = 0;
        this.setOffset();
    }

    update(delta) {
        this.currentTime += delta;
        if (this.currentTime >= this.durationPerTile) {
            this.setOffset()
            this.currentTile += 1
            this.currentTime = 0
            if (this.currentTile > this.endTile) {
                if (!!this.callback) {
                    this.callback()
                }
                if (this.spritesMap.length > 1) {
                    this.spritesMap.shift()
                    this.start()
                }
                this.currentTile = this.startTile
            }
        }

    }
}