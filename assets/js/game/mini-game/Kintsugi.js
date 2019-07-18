import * as THREE from "three";
import OrbitControls from "orbit-controls-es6";
import AssetsLoader from "~/assets/js/utils/AssetsLoader";
import Sprite from "@/assets/js/objects/Sprite";
import { TweenMax } from "gsap";

import GroundTexture from "~/static/ui/kintsugi/mini-game/kintsugi_ground_texture_white.png";
import Rosace from "~/static/ui/kintsugi/mini-game/rosace.png";
import Title from "~/static/ui/kintsugi/mini-game/repair_the_bowl.png";
import Gradient from "~/static/ui/kintsugi/mini-game/gradient.png";

import MomoSprite from "~/static/ui/kintsugi/mini-game/sprites/momo/power_momo_opti.png";
const MomoSpriteJson = require("~/static/ui/kintsugi/mini-game/sprites/momo/power_momo.json");

import BrushSprite from "~/static/ui/kintsugi/mini-game/sprites/romo/romo_brush.png";
const BrushSpriteJson = require("~/static/ui/kintsugi/mini-game/sprites/romo/romo_brush.json");

export default class Kintsugi {
  constructor(canvas) {
    window.addEventListener("resize", this.onWindowResize.bind(this));
    this.canvas = canvas;
    this.createScene();
  }

  load() {
    return new Promise((resolve, reject) => {
      AssetsLoader.add([
        {
          id: "GroundTexture",
          url: GroundTexture,
          type: "texture"
        },
        {
          id: "MomoSprite",
          url: MomoSprite,
          type: "texture"
        },
        {
          id: "BrushSprite",
          url: BrushSprite,
          type: "texture"
        },
        {
          id: "Bowl",
          url: "https://rocheclement.fr/momoromo/bol/_2.glb",
          type: "model"
        },
        {
          id: "Rosace",
          url: Rosace,
          type: "texture"
        },
        {
          id: "Title",
          url: Title,
          type: "texture"
        },
        {
          id: "Gradient",
          url: Gradient,
          type: "texture"
        }
      ]).then(assets => {
        this.assets = assets;
        resolve();
      });
    });
  }

  render() {
    const delta = this.clock.getDelta() * 5000;
    this.time += delta;

    this.renderer.render(this.scene, this.camera);
  }

  createScene() {
    this.WIDTH = this.canvas.offsetWidth;
    this.HEIGHT = this.canvas.offsetHeight;

    this.time = 0;
    this.clock = new THREE.Clock();

    // renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas
    });
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.renderer.setPixelRatio(
      window.devicePixelRatio,
      window.devicePixelRatio
    );

    // scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xcccccc);

    // camera
    this.camera = new THREE.PerspectiveCamera(
      40,
      this.WIDTH / this.HEIGHT,
      1,
      10000
    );
    this.camera.position.set(0, 0, 200);

    //controls
    // this.controls = new OrbitControls(this.camera);
    // this.controls.enabled = true;

    // ambient light
    this.scene.add(new THREE.AmbientLight(0xffffff, 4));
    this.scene.background = new THREE.Color("#fefbf0");

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  bringFragmentsCloser(targets, step) {
    step = 6 - (step + 1);
    let ratio = step / 6;

    let target1 = this.fragments[targets[0]];
    let p1 = target1._maxPosition
      .clone()
      .sub(target1._originPosition.clone())
      .multiplyScalar(ratio)
      .add(target1._originPosition.clone());
    TweenMax.to(target1.position, 0.5, { x: p1.x, y: p1.y, z: p1.z });

    let r1 = target1._maxRotation.clone();
    TweenMax.to(target1.rotation, 0.5, { z: r1.z * ratio });

    if (targets[1]) {
      let target2 = this.fragments[targets[1]];
      let p2 = target2._maxPosition
        .clone()
        .sub(target2._originPosition.clone())
        .multiplyScalar(ratio)
        .add(target2._originPosition.clone());
      TweenMax.to(target2.position, 0.5, { x: p2.x, y: p2.y, z: p2.z });

      let r2 = target2._maxRotation.clone();
      TweenMax.to(target2.rotation, 0.5, { z: r2.z * ratio });
    }
  }

  spreadFragments(targets) {
    let target1 = this.fragments[targets[0]];
    let p1 = target1._maxPosition.clone();
    TweenMax.to(target1.position, 0.5, { x: p1.x, y: p1.y, z: p1.z });

    let r1 = target1._maxRotation.clone();
    TweenMax.to(target1.rotation, 0.5, { z: r1.z });

    if (targets[1]) {
      let target2 = this.fragments[targets[1]];
      let p2 = target2._maxPosition.clone();
      TweenMax.to(target2.position, 0.5, { x: p2.x, y: p2.y, z: p2.z });

      let r2 = target2._maxRotation.clone();
      TweenMax.to(target2.rotation, 0.5, { z: r2.z });
    }
  }

  triggerFracturePiece(fractureIndex, pieceIndex) {
    let fracture = this.fractures[fractureIndex];
    let piece = fracture.children[pieceIndex];
    piece.triggered = true;
    piece.visible = true;
  }

  resetFracturePieces(fractureIndex) {
    let fracture = this.fractures[fractureIndex];
    fracture.children.forEach(piece => {
      piece.triggered = false;
      piece.visible = false;
    });
  }

  addAllElements() {
    this.addFixedElements();
    this.addCharacters();
    this.addTitleElements();
    this.addBowl();
  }

  addBowl() {
    if (!this.assets["Bowl"].media.scene.children[0].children[1]) {
      return null;
    }
    this.bowl = this.assets["Bowl"].media.scene.children[0].children[1];
    this.bowl.position.z = 0.2;

    this.bowl.children.forEach((c, index) => {
      c._originPosition = c.getWorldPosition(new THREE.Vector3());
      c._originRotation = c.rotation;
      c._originScale = c.scale;

      let ratio = 1;

      if (index === 0) {
        let position = new THREE.Vector3(-5.697, -9.13, 0);
        c.position.add(position.multiplyScalar(ratio));
        let euler = new THREE.Euler(0, 0, THREE.Math.degToRad(29.7) * ratio);
        c.rotation.copy(euler);
      } else if (index === 1) {
        let position = new THREE.Vector3(8.308, 3.16, 0);
        c.position.add(position.multiplyScalar(ratio));
        c.rotation.set(0, 0, THREE.Math.degToRad(-18.05) * ratio);
      } else if (index === 2) {
        let position = new THREE.Vector3(-7.943, 10.734, 0);
        c.position.add(position.multiplyScalar(ratio));
        c.rotation.set(0, 0, THREE.Math.degToRad(-21.57) * ratio);
      } else if (index === 3) {
        let position = new THREE.Vector3(5.338, 10.434, 0);
        c.position.add(position.multiplyScalar(ratio));
        c.rotation.set(0, 0, THREE.Math.degToRad(12.69) * ratio);
      }
      // c.position.multiplyScalar(3);
      c._maxPosition = c.position.clone();
      c._maxRotation = c.rotation.clone();
      // c.children[1].rotation.z = THREE.Math.degToRad(index*10)
    });

    //fragments
    this.fragments = [];
    this.fragments.push(this.bowl.getObjectByName("bowlpart_0"));
    this.fragments.push(this.bowl.getObjectByName("bowlpart_1"));
    this.fragments.push(this.bowl.getObjectByName("bowlpart_2"));
    this.fragments.push(this.bowl.getObjectByName("bowlpart_3"));

    //fractures
    this.fractures = [];
    this.fractures.push(this.bowl.getObjectByName("fracture_1"));
    this.fractures.push(this.bowl.getObjectByName("fracture_2"));
    this.fractures.push(this.bowl.getObjectByName("fracture_3"));

    //all fractures invisibles and yellow
    this.fractures.forEach(fracture => {
      fracture.children.forEach(piece => {
        piece.visible = false;
        piece.material.color.set(0xffff00);
      });
    });

    this.bowl.visible = false;
    this.bowl._originScale = new THREE.Vector3(1.2, 1.2, 1.2);
    this.bowl.scale.copy(this.bowl._originScale);
    this.bowl.position.y = -5;

    this.scene.add(this.bowl);
  }

  addTitleElements() {
    this.titleGroup = new THREE.Group();

    this.assets["Rosace"].media.magFilter = this.assets[
      "Rosace"
    ].media.minFilter = THREE.NearestFilter;
    let rosaceGeometry = new THREE.PlaneGeometry(
      this.assets["Rosace"].media.image.width / 10.5,
      this.assets["Rosace"].media.image.height / 10.5,
      1
    );
    let rosaceMaterial = new THREE.MeshBasicMaterial({
      map: this.assets["Rosace"].media,
      transparent: true
    });
    this.rosace = new THREE.Mesh(rosaceGeometry, rosaceMaterial);
    this.titleGroup.add(this.rosace);
    this.rosace.position.z = 0.1;

    this.assets["Gradient"].media.magFilter = this.assets[
      "Gradient"
    ].media.minFilter = THREE.NearestFilter;
    let gradientGeometry = new THREE.PlaneGeometry(
      this.assets["Gradient"].media.image.width / 10.5,
      this.assets["Gradient"].media.image.height / 10.5,
      1
    );
    let gradientMaterial = new THREE.MeshBasicMaterial({
      map: this.assets["Gradient"].media,
      transparent: true
    });
    this.gradient = new THREE.Mesh(gradientGeometry, gradientMaterial);
    this.titleGroup.add(this.gradient);
    this.gradient.position.z = 0.9;

    this.assets["Title"].media.magFilter = this.assets[
      "Title"
    ].media.minFilter = THREE.NearestFilter;
    // this.assets['Title'].media.anisotropy = 0;
    let titleGeometry = new THREE.PlaneGeometry(
      this.assets["Title"].media.image.width / 13.5,
      this.assets["Title"].media.image.height / 13.5,
      1
    );
    let titleMaterial = new THREE.MeshBasicMaterial({
      map: this.assets["Title"].media,
      transparent: true
    });
    this.title = new THREE.Mesh(titleGeometry, titleMaterial);
    this.titleGroup.add(this.title);
    this.title.position.z = 1;

    this.titleGroup.visible = false;

    this.scene.add(this.titleGroup);
  }

  addCharacters() {
    //charactersGroup
    //  - momoGroup
    //    - momo
    //    - momoMoods
    //  - romoGroup
    //    - romo

    this.charactersGroup = new THREE.Group();

    this.momoGroup = new THREE.Group();
    this.momo = new Sprite(
      this.assets["MomoSprite"].media,
      MomoSpriteJson.sprites,
      {
        wTiles: 8,
        hTiles: 8
      }
    );
    this.momoMoods = new Sprite(
      this.assets["MomoSprite"].media,
      MomoSpriteJson.sprites,
      {
        wTiles: 8,
        hTiles: 8
      }
    );
    this.momo
      .newSprites()
      .addState("wait")
      .start();
    this.momoMoods.visible = false;
    this.momoGroup.scale.set(55, 55, 55);
    this.momoGroup.position.z = 2;
    this.momoGroup.position.x = -63;
    this.momoGroup.position.y = -5;

    this.momoGroup.add(this.momo);
    this.momoGroup.add(this.momoMoods);
    this.charactersGroup.add(this.momoGroup);

    this.romoGroup = new THREE.Group();
    this.romo = new Sprite(
      this.assets["BrushSprite"].media,
      BrushSpriteJson.sprites,
      {
        wTiles: 8,
        hTiles: 8
      }
    );
    this.romo.scale.set(45, 45, 45);
    this.romo.position.z = 2;
    this.romo.position.x = 58;
    this.romo.position.y = -5;

    this.romoGroup.add(this.romo);
    this.charactersGroup.add(this.romoGroup);

    this.scene.add(this.charactersGroup);
  }

  addFixedElements() {
    this.fixedElementsGroup = new THREE.Group();
    let groundAsset = this.assets["GroundTexture"];
    groundAsset.media.magFilter = THREE.NearestFilter;
    groundAsset.media.minFilter = THREE.NearestFilter;
    let groundGeometry = new THREE.PlaneBufferGeometry(
      groundAsset.media.image.width / 7.5,
      groundAsset.media.image.height / 7.5,
      1
    );
    let groundMaterial = new THREE.MeshBasicMaterial({
      // color: 0xffff00,
      map: groundAsset.media,
      transparent: true
    });
    let groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.position.y = -43;
    groundMesh.position.z = -1;
    groundMesh.scale.set(1.2, 1.2, 1.2);

    this.fixedElementsGroup.add(groundMesh);

    this.scene.add(this.fixedElementsGroup);
  }

  titleAnimation() {
    this.titleGroup.visible = true;
    this.bowl.visible = true;

    this.tweeningScalar = 1.1;

    let tl = new TimelineMax();

    return new Promise((resolve,reject)=>{
      tl.add("titleAppear", 0)
      .add("titleDisappear", 2)
      .from(
        [this.title.material,this.rosace.material,this.gradient.material],
        0.5,
        {
          ease: Back.easeOut.config(1.4),
          opacity: 0,
          onUpdate:()=>{
            this.bowl.traverse((mesh)=>{
              if(mesh.material){
                mesh.material.opacity = this.title.material.opacity
              }
            })
          }
        },
        "titleAppear"
      )
      .from(
        [this.rosace.scale, this.gradient.scale,this.bowl.scale],
        0.5,
        {
          ease: Back.easeOut.config(1.4),
          x: 0.01,
          y: 0.01,
          z: 0.01
        },
        "titleAppear"
      )
      .from(
        this.title.scale,
        0.5,
        {
          ease: Back.easeOut.config(1.4),
          delay: 0.2,
          x: 0.01,
          y: 0.01,
          z: 0.01
        },
        "titleAppear"
      )
      .to(
        this,
        3,
        {
          ease: Power4.easeOut,
          tweeningScalar: 1.25,
          onUpdate: () => {
            this.fragments.forEach(fragment => {
              let o = new THREE.Vector3().copy(fragment._maxPosition);
              let rotationZ = fragment._maxRotation.z;
              fragment.position.copy(o.multiplyScalar(this.tweeningScalar));
              fragment.rotation.z = rotationZ * this.tweeningScalar;
            });
          }
        },
        "titleAppear"
      )
      .to(
        [this.title.scale,this.rosace.scale,this.gradient.scale,this.bowl.scale],
        0.5,
        {
          ease: Back.easeIn.config(1.4),
          x: 0.01,
          y:0.01,
          z:0.01,
          onComplete:()=>{
            this.titleGroup.visible = false;
            this.bowl.visible = false;
            this.bowl.scale.copy(this.bowl._originScale);
            this.title.scale.set(1,1,1)
            this.rosace.scale.set(1,1,1)
            this.gradient.scale.set(1,1,1)
          }
        },
        "titleDisappear"
      )
      .to(
        [this.title.material,this.rosace.material,this.gradient.material],
        0.5,
        {
          ease: Back.easeIn.config(1.4),
          opacity: 0,
          onUpdate:()=>{
            this.bowl.traverse((mesh)=>{
              if(mesh.material){
                mesh.material.opacity = this.title.material.opacity
              }
            })
          },
          onComplete:()=>{
            this.title.material.opacity = 1;
            this.rosace.material.opacity = 1;
            this.gradient.material.opacity = 1;
          }
        },
        "titleDisappear"
      )
      .eventCallback("onComplete", () => {
        this.gradient.position.z = 0.15;
        this.fragments.forEach(fragment => {
          let o = new THREE.Vector3().copy(fragment._maxPosition);
          let rotationZ = fragment._maxRotation.z;
          fragment.position.copy(o);
          fragment.rotation.z = rotationZ;
        });
        resolve()
      });
    })

  }

  onWindowResize() {
    if (this.renderer) {
      this.camera.aspect = window.innerHeight / (window.innerHeight * 0.85);
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerHeight, window.innerHeight * 0.85);
    }
  }
}
