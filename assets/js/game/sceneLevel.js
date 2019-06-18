import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import FixedProp from '../objects/FixedProp'
import CANNON from 'cannon'
import physicParams from '../physics/physicParams';
import Characters from '../objects/Characters';
import cannonDebugRenderer from '../physics/CannonDebugRenderer'
import AnimatedProp from "@/assets/js/objects/AnimatedProp";
import HowlerManager from "~/assets/js/utils/HowlerManager";
import background_level from "@/static/sounds/background_level.mp3";
import breaking_bowl from "@/static/sounds/breaking_bowl.mp3";
import cta_ready from "@/static/sounds/cta_ready.mp3";
import Sprite from '@/assets/js/objects/Sprite'

import kintsugi_sprite from '~/static/sprites/about/kintsugi.png'
import kintsugi_json from '~/static/sprites/about/kintsugi.json'

import {
    TweenMax,
    TimelineMax
} from 'gsap';

const visibleHeightAtZDepth = (depth, camera) => {
    const cameraOffset = camera.position.z;
    if (depth < cameraOffset) depth -= cameraOffset;
    else depth += cameraOffset;

    const vFOV = camera.fov * Math.PI / 180;

    return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

const visibleWidthAtZDepth = (depth, camera) => {
    const height = visibleHeightAtZDepth(depth, camera);
    return height * camera.aspect;
};

export default class Level {
    constructor(opts, store) {

        this.time = 1000;

        this.store = store

        HowlerManager.add([{
                id: "background_level",
                src: background_level
            },
            {
                id: "breaking_bowl",
                src: breaking_bowl
            },
            {
                id: "cta_ready",
                src: cta_ready
            }

        ]).then(sounds => {
            this.sounds = sounds;
        });

        this.canvas = document.getElementById("canvas")
        this.textureAtlas = opts.textureAtlas; // textureAtlas

        this.fixedProps = opts.levelParams.props.fixed; // Fixed Props

        this.fixedPropsGroup = []; // Fixed Props

        this.animates = opts.levelParams.animates; // Animate Props
        this.animatesArray = []

        this.levelParams = {
            ...opts.levelParams
        };
        this.platforms = this.levelParams.platforms

        this.clock = new THREE.Clock()

        this.charactersClass = new Characters(store)

        this.charactersClass.add().then((characters) => {
            this.characters = characters
            this.momo = this.characters.momo
            this.momo.originPosition = new THREE.Vector3().copy(this.momo.position)
            this.momo.scale.set(1.5, 1.5, 1.5)
            this.romo = this.characters.romo
            this.romo.position.z = 2.5
            this.romo.position.y = 1
            this.romo.originPosition = new THREE.Vector3().copy(this.romo.position)
            this.romo.scale.set(-2, 2, 2)
            this.addCharacter()
        })

        this.loaderTexture()

        this.eventAnimate = new Event('launchAnimated');

        this.eventMinigame = new Event('launchMiniGame');

        this.eventAnimate.props = new Object();

        this.isMiniGameLaunched = false

        this.isAnimatedLaunched = false

        this.startRestrictedZone = false

        this.animateRunning = false

        this.animationFinish = false

        this.firstLaunch = true

        this.camera = new THREE.PerspectiveCamera(
            40,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.heightCamera = 1

        this.camera.position.z = 12;

        this.preRenderFinish = false

        // this.controls = new OrbitControls(this.camera);

        // this.controls.enablePan = false

        this.scene = new THREE.Scene();

        this.scene.add(this.camera)

        this.scene.background = new THREE.Color(0xfdf9eb);

        this.worldPhysic();

        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.renderer.setAnimationLoop(this.render.bind(this));

        this.canvas.appendChild(this.renderer.domElement);

        window.addEventListener("resize", this.onWindowResize.bind(this));

        this.addMask()
    }

    worldPhysic() {
        this.physicParams = new physicParams()
        this.world = this.physicParams.world

        this.cannonDebugRenderer = new cannonDebugRenderer(
            this.scene,
            this.world
        )
    }

    loaderTexture() {
        this.textureAtlas.load().then(textures => {
            this.textures = textures;
            this.init()
        });
    }

    init() {
        if (this.fixedProps) {
            this.fixedProps.forEach(prop => {
                this.addFixedProp(prop)
            });
        }
        if (this.platforms) {
            this.platforms.forEach(platform => {
                this.addPlatforms(platform)
            });
        }
        if (this.animates) {
            this.animates.forEach(animate => {
                this.addAnimate(animate)
            });
        }
    }

    addFixedProp(props) {
        let t = this.textureAtlas.get(props._id);
        let prop = new FixedProp({
            id: props._id,
            width: t._data.ratio,
            position: props.position,
            height: 1,
            material: new THREE.MeshBasicMaterial({
                map: t,
                transparent: true,
                alphaTest: 0.5,
            })
        });
        if (prop._id == "window1" || prop._id == "window2") {
            let singleGeometry = new THREE.Geometry();

            let width = 1
            let height = 1
            let geometryRightLeft = new THREE.PlaneGeometry(width, height * 1.5, 1);
            let geometryTopBottom = new THREE.PlaneGeometry(width, height, 1);
            let material = new THREE.MeshBasicMaterial({
                color: 0xfdf9eb,
                side: THREE.DoubleSide
            });

            let plane = new THREE.Mesh(geometryRightLeft, material); //Right
            plane.position.set(-width + .03, 0, 0)
            singleGeometry.mergeMesh(plane);

            plane = new THREE.Mesh(geometryRightLeft, material); //Left
            plane.position.set(width - .03, 0, 0)
            singleGeometry.mergeMesh(plane);

            plane = new THREE.Mesh(geometryTopBottom, material); //Top
            plane.position.set(0, width, 0)
            singleGeometry.mergeMesh(plane);

            plane = new THREE.Mesh(geometryTopBottom, material); //Bottom
            plane.position.set(0, -width, 0)
            singleGeometry.mergeMesh(plane);

            let mask = new THREE.Mesh(singleGeometry, material);

            prop.add(mask)
        }
        prop.position.set(props.position.x, props.position.y, props.position.z);
        prop.originPosition = new THREE.Vector3().copy(prop.position)
        prop.scale.set(props.scale.x, props.scale.y, props.scale.z);
        prop.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z);
        prop.checkpointMinigame = props.checkpoint.minigame
        if (props.checkpoint.minigame) {
            this.minigameProps = prop
        }
        // this.fixedProps.push(prop);
        this.fixedPropsGroup.push(prop)
        this.scene.add(prop)
    }

    addAnimate(params) {

        new AnimatedProp(params).then((animate) => {
            animate.scale.set(params.scale.x, params.scale.y, params.scale.z)
            animate.position.set(params.position.x, params.position.y, params.position.z)
            animate.originPosition = new THREE.Vector3().copy(animate.position)
            animate.rotation.set(params.rotation.x, params.rotation.y, params.rotation.z)
            animate.name = params.json.id
            animate.alreadyAnimated = false

            this.animatesArray.push(animate)
            this.scene.add(animate)
            this.launchSprite(animate.animate, 'wait')
        })
    }

    addCharacter() {
        this.scene.add(this.momo, this.romo)
        this.world.add(this.momo.body)
    }

    addPlatforms(platform) {
        let size = platform.scale
        let position = platform.position
        let rotation = platform.rotation
        let axis = new CANNON.Vec3(0, 0, 1);

        let platform_material = new CANNON.Material("platform_material")

        let body = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 10, size.z / 2)),
            material: platform_material,
            position: new CANNON.Vec3(position.x, position.y, position.z),
        });

        body.quaternion.setFromAxisAngle(axis, rotation.z)

        let platform_cm = new CANNON.ContactMaterial(this.momo.body.material, platform_material, {
            friction: 0.1,
            restitution: 0,
            // frictionEquationStiffness: 1e9,
            // frictionEquationRelaxation: 10
        });
        this.world.addContactMaterial(platform_cm);

        this.world.add(body);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    addMask() {
        this.restrictedZone = {}
        let singleGeometry = new THREE.Geometry();

        this.width = visibleWidthAtZDepth(0, this.camera)
        this.height = visibleHeightAtZDepth(0, this.camera)

        let geometryLeftRight = new THREE.PlaneGeometry(this.width, this.height, 32);
        let geometryTopBottom = new THREE.PlaneGeometry(this.width, this.height / 2, 32);
        let material = new THREE.MeshBasicMaterial({
            color: 0x2d2d2d,
            side: THREE.DoubleSide
        });

        let plane = new THREE.Mesh(geometryLeftRight, material); // Left
        plane.position.set(-this.width / 1.25, 0, 0);
        plane.updateMatrix()
        let planeSize = new THREE.Box3().setFromObject(plane);
        this.restrictedZone.left = planeSize.max.x
        singleGeometry.merge(plane.geometry, plane.matrix);

        plane = new THREE.Mesh(geometryLeftRight, material); // Right
        plane.position.set(this.width / 1.25, 0, 0);
        plane.updateMatrix()
        planeSize = new THREE.Box3().setFromObject(plane);
        this.restrictedZone.right = planeSize.min.x
        singleGeometry.merge(plane.geometry, plane.matrix);

        plane = new THREE.Mesh(geometryTopBottom, material); // Top
        plane.position.set(0, this.height / 2, 0);
        plane.rotation.set(0, 0, THREE.Math.degToRad(-.5))
        plane.updateMatrix()
        planeSize = new THREE.Box3().setFromObject(plane);
        this.displayGIFPosition = new THREE.Vector3(this.restrictedZone.right, this.restrictedZone.bottom, 0)
        this.restrictedZone.top = planeSize.min.y
        singleGeometry.merge(plane.geometry, plane.matrix);

        plane = new THREE.Mesh(geometryTopBottom, material); //Bottom
        plane.position.set(0, -this.height / 2, 0);
        plane.rotation.set(0, 0, THREE.Math.degToRad(2))
        plane.updateMatrix()
        planeSize = new THREE.Box3().setFromObject(plane);
        this.restrictedZone.bottom = planeSize.max.y
        singleGeometry.merge(plane.geometry, plane.matrix);

        this.masks = new THREE.Mesh(singleGeometry, material);

        this.materialbis = new THREE.ShaderMaterial({
            // wireframe: true,
            uniforms: {
                iTime: {
                    value: 0
                }
            },
            vertexShader: `
                varying vec3 v_position;
                void main() {
                    v_position = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
            `,
            fragmentShader: `
                //	Simplex 3D Noise 
                //	by Ian McEwan, Ashima Arts
                //
                vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
                vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
                
                float snoise(vec3 v){ 
                const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
                const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
                
                // First corner
                vec3 i  = floor(v + dot(v, C.yyy) );
                vec3 x0 =   v - i + dot(i, C.xxx) ;
                
                // Other corners
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min( g.xyz, l.zxy );
                vec3 i2 = max( g.xyz, l.zxy );
                
                //  x0 = x0 - 0. + 0.0 * C 
                vec3 x1 = x0 - i1 + 1.0 * C.xxx;
                vec3 x2 = x0 - i2 + 2.0 * C.xxx;
                vec3 x3 = x0 - 1. + 3.0 * C.xxx;
                
                // Permutations
                i = mod(i, 289.0 ); 
                vec4 p = permute( permute( permute( 
                            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                        + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                
                // Gradients
                // ( N*N points uniformly over a square, mapped onto an octahedron.)
                float n_ = 1.0/7.0; // N=7
                vec3  ns = n_ * D.wyz - D.xzx;
                
                vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)
                
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
                
                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                
                vec4 b0 = vec4( x.xy, y.xy );
                vec4 b1 = vec4( x.zw, y.zw );
                
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                
                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);
                
                //Normalise gradients
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;
                
                // Mix final noise value
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                                dot(p2,x2), dot(p3,x3) ) );
                }
                
                float map(float value, float min1, float max1, float min2, float max2) {
                    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
                }
                varying vec3 v_position;
                uniform float iTime;
                void main() {
                    vec3 color1 = vec3(253., 249., 235.)/255.;
                    vec3 color2 = vec3(234., 227., 205.)/255.;
                    //color2 = vec3(214., 197., 185.)/255.;
                    vec3 gradient = mix(vec3(1.0),color1,v_position.y);
                    float noise = snoise(vec3(vec2(v_position.x * 0.1,v_position.y* 0.1* 0.5 - iTime*0.1),iTime*0.1));
                    float grain = snoise(vec3(v_position.xy*500000.,iTime*0.1));
                   
                    vec3 noise_color = mix(color1,color2,clamp(noise,0.0,1.0));
                    
                    vec3 color = ((gradient*0.5) + grain + (noise_color * 10.5)) / 11.;
                    gl_FragColor = vec4(color,.1);
                }
            `
        })

        var border = new THREE.Mesh(singleGeometry, this.materialbis);
        border.scale.multiplyScalar(1.015);
        this.masks.add(border);

        this.camera.position.x = -this.width
        this.camera.position.y = this.heightCamera

        this.masks.position.set(this.width / 2.5, 0, -5)
        this.masks.scale.set(.5, .5, .5)

        this.scene.add(this.masks);
        this.camera.add(this.masks);
    }

    reset() {
        this.scene = null
    }

    preRenderProps(propsLoad, addTutorial, hideTutorial, displayGIF) {
        let promises = []
        let delay = 200
        let duration = this.fixedPropsGroup.length * delay
        this.store.commit('game/setLoadingDuration', duration)
        this.sounds.background_level.loop(true);
        this.sounds.background_level.play();
        this.sounds.background_level.fade(0, 1.0, 5000);
        //FixedProps preRender
        for (let i = 0; i < this.fixedPropsGroup.length; i++) {
            let p1 = new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.fixedPropsGroup[i].position.x = this.camera.position.x
                    this.fixedPropsGroup[i].position.z = 0
                    resolve(this.fixedPropsGroup[i]);
                }, i * delay)
            });
            promises.push(p1)
            p1.then((fixed) => {
                setTimeout(() => {
                    fixed.position.copy(fixed.originPosition)
                }, delay);
            })
        }

        //Animates preRender
        for (let i = 0; i < this.animatesArray.length; i++) {
            let p2 = new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.animatesArray[i].position.x = this.camera.position.x
                    this.animatesArray[i].position.z = 0
                    resolve(this.animatesArray[i]);
                }, i * 2000)
            });
            promises.push(p2)
            p2.then((animate) => {
                setTimeout(() => {
                    animate.position.copy(animate.originPosition)
                }, 2000);
            })
        }

        //Momo preRender
        let p3 = new Promise((resolve, reject) => {
            setTimeout(() => {
                this.momo.position.x = this.camera.position.x
                this.momo.position.z = 0
                resolve(this.momo);
            }, 2000)
        });
        promises.push(p3)
        p3.then((momo) => {
            setTimeout(() => {
                momo.position.copy(momo.originPosition)
            }, 2000);
        })

        //Romo preRender
        let p4 = new Promise((resolve, reject) => {
            setTimeout(() => {
                this.romo.position.x = this.camera.position.x
                this.romo.position.z = 0
                resolve(this.romo);
            }, 2000)
        });
        promises.push(p4)
        p4.then((romo) => {
            setTimeout(() => {
                romo.position.copy(romo.originPosition)
            }, 2000);
        })

        Promise.all(promises).then(() => {
            this.preRenderFinish = true
            setTimeout(() => {
                propsLoad()

                this.sounds.breaking_bowl.play();

                TweenMax.to(this.masks.position, 2.5, {
                    x: 0,
                    ease: Power4.easeOut,
                    onComplete: () => {
                        setTimeout(() => {
                            let position = this.projectVectorToScreen(this.displayGIFPosition)
                            displayGIF(position)
                        }, 1000);


                        this.startRestrictedZone = true
                        this.animationFinish = true
                        this.charactersClass.blockCharacter(addTutorial, this.camera, hideTutorial)
                    }
                }, 1000);
            })
        })
    }

    launchMiniGame() {
        return new Promise((resolve, reject) => {
            let tl = new TimelineMax({
                onComplete: () => {
                    resolve()
                }
            })
            tl.to(this.masks.position, 3, {
                x: -this.width / 4.5,
                ease: Power4.easeOut,
            });
            tl.to(this.camera.position, 3, {
                x: this.width / 4.5,
                ease: Power4.easeOut,
            }, 0);
        })
    }

    projectVectorToScreen(vector) {

        vector.project(this.camera);
        vector.x = ((vector.x + 1) * window.innerWidth) / 2;
        vector.y = (-(vector.y - 1) * window.innerHeight) / 2;
        vector.z = 0;
        return vector;
    }

    launchEndMiniGame() {
        return new Promise((resolve, reject) => {
            let tl = new TimelineMax({
                onComplete: () => {
                    resolve()
                    this.startVideo()
                }
            })
            tl.to(this.masks.position, 3, {
                x: -this.width / 2.5,
                ease: Power4.easeOut,
            });
            tl.to(this.camera.position, 3, {
                x: this.width / 2,
                ease: Power4.easeOut,
            }, 0);
        })
    }

    nextToMinigame(value) {
        if (value) {
            if (this.miniGameOut) {
                this.miniGameOut = false
                this.isMiniGameLaunched = true
                this.eventMinigame.minigame = value
                this.sounds.cta_ready.play();
            }
            this.miniGameIn = true
        } else {
            if (this.miniGameIn) {
                this.miniGameIn = false
                this.isMiniGameLaunched = false
            }
            this.miniGameOut = true
        }
        this.eventMinigame.minigame = value

        window.dispatchEvent(this.eventMinigame);
    }

    render() {
        const delta = this.clock.getDelta();
        this.time += delta;

        this.materialbis.uniforms.iTime.value = this.time

        if (this.animatesArray.length && this.animationFinish && this.momo) {
            this.animatesArray.forEach(animate => {
                animate.animate.update(delta * 10000)
                if (this.momo.position.x >= animate.position.x - .8 && this.momo.position.x <= animate.position.x + .8 && !animate.animated) {
                    if ((animate.out && !animate.in) || (!animate.in && !animate.out)) {
                        animate.in = true
                        if (animate.name == "cat") {
                            let postX = animate.position.x
                            let postY = animate.position.y
                            TweenMax.to(animate.position, 2.5, {
                                x: postX + 1,
                                ease: Circ.easeIn
                            })
                            TweenMax.to(animate.position, 4, {
                                y: postY - 2,
                                ease: Power4.easeIn
                            })
                            animate.animate
                                .newSprites()
                                .addState('jump')
                                .addState('wait')
                                .start()
                        } else if (animate.name == "petals") {
                            console.log(animate.animate)
                            animate.animate
                                .newSprites()
                                .addState('petals')
                                .addState('wait')
                                .start()
                        } else if (animate.name == "plants") {
                            animate.animate
                                .newSprites()
                                .addState('plants')
                                .start()
                        } else if (animate.name == "mobile") {
                            animate.animate
                                .newSprites()
                                .addState('mobile')
                                .start()
                            animate.animated = true
                        }
                    }


                } else if (animate.in) {
                    if (animate.in || (!animate.in && !animate.out)) {
                        animate.out = true
                    }
                    animate.in = false
                }
            });
        }

        // Romo add restrictedZone 
        if (this.romo && this.restrictedZone && this.startRestrictedZone) {
            this.romo.position.x = Math.max(1 + (this.camera.position.x + this.restrictedZone.left), Math.min((this.camera.position.x + this.restrictedZone.right) - 1, this.romo.position.x))
            this.romo.position.y = Math.max(0, Math.min(this.restrictedZone.top + 1, this.romo.position.y))
        }

        // this.cannonDebugRenderer.update()

        if (this.characters && this.preRenderFinish) {
            this.characters.update()
            TweenMax.to(this.camera.position, 3, {
                x: this.momo.position.x,
                ease: Power4.easeOut,
            })
        }

        if (this.minigameProps && this.romo) {
            if (this.romo.position.x >= this.minigameProps.position.x - 1 && this.romo.position.x <= this.minigameProps.position.x + 1) {
                this.nextToMinigame(true)
            } else {
                this.nextToMinigame(false)
            }
        }


        this.physicParams.update()

        if (this.video) {
            this.video.update(delta * 5000)
        }

        this.renderer.render(this.scene, this.camera);
    }
    launchSprite(character, id) {
        character
            .newSprites()
            .addState(id)
            .start()
        this.currentSpriteID = id;
    }

    startVideo() {
        return new Promise((reolve, reject) => {
            new Sprite(kintsugi_sprite, kintsugi_json.sprites, {
                wTiles: 8,
                hTiles: 16
            }).then((video) => {
                this.video = video
                this.scene.add(this.video)

                this.video
                    .newSprites()
                    .addState("default")
                    .start(this.stopVideo.bind(this));
                this.video.scale.set(2, 1, 1)
                this.video.position.set(this.camera.position.x, this.camera.position.y, 10);
                HowlerManager.sounds.voice_bowl_repaired.play()
            })
        })
    }

    stopVideo() {
        this.video.visible = false
        this.video = null
        let event = new Event('launchAbout');
        window.dispatchEvent(event)
    }
}