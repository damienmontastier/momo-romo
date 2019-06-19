<template>
  <div id="kintsugi">
    <!-- <div class="title">kintsugi mobile mini game {{roomID}}</div> -->
    <is-ready v-if="!isReady"/>
    <div ref="canvas" id="canvas"></div>
    <div class="ui">
      <div class="isPlaying" ref="momoIsPlaying">
        <div class="container">
          <span class="skew fill-en">momo is playing</span>
          <p class="skew book">stay ready for your turn</p>
        </div>
      </div>
      <div class="countdown">
        <div class="container">
          <Countdown :countdown="countdown"/>
        </div>
      </div>
      <div class="swipe" ref="swipe">
        <div id="cursor"></div>
      </div>
    </div>
    <!-- <div class="debug">
      <button @click="debugLaunchFracture([0,1],0)">0</button>
      <button @click="debugLaunchFracture([2],1)">1</button>
      <button @click="debugLaunchFracture([3],2)">2</button>
      <button @click="cancelCurrentFracture()">cancel</button>
    </div>-->
  </div>
</template>

<script>
import * as THREE from "three";
import OrbitControls from "orbit-controls-es6";
import ObjectLoader from "~/assets/js/utils/ObjectLoader";
import { mapState } from "vuex";
import { TweenMax } from "gsap";
import isReady from "./isReady";
import Countdown from "@/components/mini-game/Kintsugi/Countdown";
import { Vector3 } from "three";

const MeshLine = require("three.meshline");

class App {
  constructor($parent) {
    window.addEventListener("resize", this.onWindowResize.bind(this));
    window.addEventListener(
      "orientationchange",
      this.onOrientationChange.bind(this)
    );
    this.$parent = $parent;
    this.loaded = false;
    this.mouse = new THREE.Vector2(100000, 100000);
    this.raycaster = new THREE.Raycaster();
  }

  init() {
    this.socket = this.$parent.socket;
    this.roomID = this.$parent.roomID;
    this.canvas = this.$parent.$refs.canvas;
    this.WIDTH = window.innerWidth;
    this.HEIGHT = window.innerHeight;

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.canvas.appendChild(this.renderer.domElement);

    // scene
    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(
      40,
      this.WIDTH / this.HEIGHT,
      1,
      10000
    );
    this.camera.position.set(0, 0, 80);
    this.camera.originPosition = new THREE.Vector3().copy(this.camera.position);

    // controls
    // this.controls = new OrbitControls(this.camera);
    // this.controls.enabled = true;

    // ambient light
    this.scene.add(new THREE.AmbientLight(0xffffff, 4));
    this.scene.background = new THREE.Color("#fefbf0");

    // directional light
    // this.light = new THREE.DirectionalLight(0xffffff, 1);
    // this.light.position.set(0, 0, 100);
    // this.scene.add(this.light);

    // axes
    // this.scene.add(new THREE.AxesHelper(20));

    //animation loop
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  render() {
    if (this.loaded) {
      if (this.currentFracture) {
        this.raycast();
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  raycast() {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    let intersect = this.raycaster.intersectObject(this.shadowPlane);
    if (intersect[0]) {
      let point = intersect[0].point;

      let piece = this.currentFracture.children
        .slice()
        .reverse()
        .find(piece => piece.triggered);

      let index;
      if (piece === undefined) {
        index = 0;
      } else {
        index = piece.name + 1;
      }

      let target = this.currentFracture.children.find(
        piece => piece.name === index
      );

      if (target) {
        let p = target.getWorldPosition(new THREE.Vector3());
        let d = p.distanceTo(point);

        if (d < 1.5) {
          this.triggerFracturePiece(target);
          this.updateCursor(p, true);
          if (
            target.name ===
            this.currentFracture.children[
              this.currentFracture.children.length - 1
            ].name
          ) {
            this.$parent.success();
          }
        }
      }
    }
  }

  projectVectorToScreen(vector) {
    vector.project(this.camera);
    vector.x = ((vector.x + 1) * window.innerWidth) / 2;
    vector.y = (-(vector.y - 1) * window.innerHeight) / 2;
    vector.z = 0;
    return vector;
  }

  updateCursor(vector, tween = false) {
    vector = this.projectVectorToScreen(vector);

    TweenMax.to(this.$parent.$refs.swipe, tween ? 0.25 : 0, {
      x: vector.x,
      y: vector.y
    });
  }

  triggerFracturePiece(piece) {
    piece.triggered = true;
    piece.visible = true;

    if (this.socket) {
      this.socket.emit("custom-event", {
        name: "kintsugi mini-game",
        in: this.roomID,
        args: {
          id: "piece triggered",
          index: piece.name
        }
      });
    }
  }

  addShadowPlane() {
    var geometry = new THREE.PlaneGeometry(100, 100, 1);
    var material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0
    });
    this.shadowPlane = new THREE.Mesh(geometry, material);
    this.scene.add(this.shadowPlane);
  }

  loadBowl() {
    ObjectLoader.load({
      url: "https://rocheclement.fr/momoromo/bol/_2.glb",
      format: "glb"
    }).then(object => {
      this.model = object.scene.children[0].children[1];
      this.model.position.y = -3;
      this.model.children.forEach((c, index) => {
        c._originPosition = c.getWorldPosition(new THREE.Vector3());
        c._originRotation = c.rotation;
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
        c._maxPosition = c.position.clone();
        c._maxRotation = c.rotation.clone();
        // c.children[1].rotation.z = THREE.Math.degToRad(index*10)
      });

      //fragments
      this.fragments = [];
      this.fragments.push(this.model.getObjectByName("bowlpart_0"));
      this.fragments.push(this.model.getObjectByName("bowlpart_1"));
      this.fragments.push(this.model.getObjectByName("bowlpart_2"));
      this.fragments.push(this.model.getObjectByName("bowlpart_3"));
      // console.log(fragments)

      //fractures
      this.fractures = [];
      this.fractures.push(this.model.getObjectByName("fracture_1"));
      this.fractures.push(this.model.getObjectByName("fracture_2"));
      this.fractures.push(this.model.getObjectByName("fracture_3"));
      // console.log(fractures)

      this.fractures.forEach(fracture => {
        fracture.children.forEach((piece, index) => {
          piece.material.color.set(new THREE.Color(0xffff00));
          piece.visible = false;
          piece.name = index;
        });
      });

      this.scene.add(this.model);
      this.loaded = true;
    });
  }

  bringCloser(targets, step) {
    let tl = new TimelineMax();
    tl.add("start", 0);

    step = 6 - (step + 1);
    let ratio = step / 6;

    let target1 = this.fragments[targets[0]];
    let p1 = target1._maxPosition
      .clone()
      .sub(target1._originPosition.clone())
      .multiplyScalar(ratio)
      .add(target1._originPosition.clone());
    tl.to(target1.position, 0.5, { x: p1.x, y: p1.y, z: p1.z }, "start");

    let r1 = target1._maxRotation.clone();
    tl.to(target1.rotation, 0.5, { z: r1.z * ratio }, "start");

    if (targets[1]) {
      let target2 = this.fragments[targets[1]];
      let p2 = target2._maxPosition
        .clone()
        .sub(target2._originPosition.clone())
        .multiplyScalar(ratio)
        .add(target2._originPosition.clone());
      tl.to(target2.position, 0.5, { x: p2.x, y: p2.y, z: p2.z }, "start");

      let r2 = target2._maxRotation.clone();
      tl.to(target2.rotation, 0.5, { z: r2.z * ratio }, "start");
    }

    return new Promise((resolve, reject) => {
      tl.eventCallback("onComplete", () => {
        resolve();
      });
    });
  }

  spread(targets) {
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

  setCurrentFracture(fracture, fragments) {
    if (this.fractures[fracture]) {
      this.currentFracture = this.fractures[fracture];
      this.currentFragments = fragments;
    } else {
      console.error("la fracture n existe pas");
      return false;
    }

    return this;
  }

  zoomToFracture(fracture) {
    let box = new THREE.Box3().setFromObject(this.fractures[fracture]);
    let p = box.getCenter(new THREE.Vector3());
    this.camera.position.x = p.x;
    this.camera.position.y = p.y;
    this.camera.position.z = 30;
  }

  resetCamera() {
    this.camera.position.copy(this.camera.originPosition);
  }

  createFractureUI(fracture) {
    let currentFracture = this.fractures[fracture];
    let geometry = new THREE.Geometry();
    currentFracture.children.forEach(piece => {
      let v = piece.getWorldPosition(new THREE.Vector3());
      geometry.vertices.push(v);
    });

    let line = new MeshLine.MeshLine();
    line.setGeometry(geometry);

    let material = new MeshLine.MeshLineMaterial({
      lineWidth: 0.2,
      color: new THREE.Color(0xff5736)
      // dashArray: 2
    });

    this.lineUI = new THREE.Mesh(line.geometry, material);
    this.scene.add(this.lineUI);
    this.lineUI.position.z = 0.5;

    //cursor UI
    // setTimeout(()=>{
    this.$parent.$refs.swipe.style.opacity = "1";
    this.updateCursor(
      currentFracture.children[0].getWorldPosition(new THREE.Vector3())
    );
    // },100)
  }

  removeFractureUI() {
    this.$parent.$refs.swipe.style.opacity = "0";
    this.lineUI.visible = false;
  }

  endFracture() {
    this.resetCamera();
    this.removeFractureUI();
  }

  onWindowResize() {
    // if(this.orientation = "landscape") {
    //   this.camera.aspect = window.innerWidth / window.innerHeight;
    // }
    // this.camera.aspect = window.innerWidth / window.innerHeight;
    // this.camera.updateProjectionMatrix();
    // this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onOrientationChange() {
    let orientation = screen.orientation.angle;
    if (orientation === 90 || orientation === -90) {
      this.orientation = "landscape";
    } else if (orientation === 0 || orientation === -0) {
      this.orientation = "portrait";
    }
    this.camera.aspect = window.innerHeight / window.innerWidth;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerHeight, window.innerWidth);
  }
}

export default {
  data() {
    return {
      // app: new App(),
      mouse: new THREE.Vector2(),
      isMouseDown: false,
      isReady: false,
      timer: 10,
      timerInterval: null,
      countdown: 4
    };
  },
  computed: {
    ...mapState({
      socket: state => state.synchro.socket,
      roomID: state => state.synchro.roomID
    })
  },
  watch: {
    mouse: {
      handler: function() {
        this.app.mouse = this.mouse;
      },
      deep: true
    }
  },
  mounted() {
    window.addEventListener("touchmove", this.onTouchMove.bind(this), false);
    window.addEventListener("mousemove", this.onMouseMove.bind(this), false);
    window.addEventListener("mousedown", this.onMouseDown.bind(this), false);
    window.addEventListener("mouseup", this.onMouseUp.bind(this), false);
    this.app = new App(this);
    this.init();
    this.createSocketEvents();
  },
  methods: {
    createSocketEvents() {
      if (this.socket) {
        this.socket.on("kintsugi mini-game", params => {
          if (params.id === "launch fracture") {
            this.launchFracture(params.fracture, params.fragments);
          } else if (params.id === "bring closer") {
            this.app.bringCloser(params.fragments, params.step);
          } else if (params.id === "cancel fracture") {
            this.cancelFracture(params.fragments);
          } else if (params.id === "romo is ready") {
            this.isReady = true;
          }
        });
      }
    },
    init() {
      this.app.init(this.$refs.canvas, this.socket, this.roomID);
      this.app.loadBowl();
      this.app.addShadowPlane();
    },
    startTimer() {
      this.timer = 10;
      this.timerInterval = setInterval(() => {
        this.timer--;
        console.log(this.timer);
        if (this.timer === 0) {
          console.log("timer ecoulé");
          clearInterval(this.timerInterval);
          this.fail();
          this.timer = 10;
        }
      }, 1000);
    },
    onMouseMove(event) {
      if (this.isMouseDown) {
        console.log("mouse move");
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }
    },
    onTouchMove(event) {
      // if(event){
      // console.log("touch move");
      this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      // }
    },
    onMouseDown(event) {
      this.isMouseDown = true;
    },
    onMouseUp(event) {
      this.isMouseDown = false;
    },
    launchFracture(fracture, fragments) {
      this.$refs.momoIsPlaying.style.opacity = "0";
      this.launchCountdown().then(() => {
        this.app
          .setCurrentFracture(fracture, fragments)
          .createFractureUI(fracture);
        this.startTimer();
      });
      setTimeout(() => {
        this.app.zoomToFracture(fracture);
      }, 1000);
    },
    fail() {
      console.log("fail");
      this.app.currentFracture.children.forEach(piece => {
        piece.triggered = false;
        piece.visible = false;
      });
      if (this.socket) {
        this.socket.emit("custom-event", {
          name: "kintsugi mini-game",
          in: this.roomID,
          args: {
            id: "cancel fracture",
            fragments: this.app.currentFragments
          }
        });
      }
      this.endFracture();
    },
    success() {
      console.log("success");
      if (this.socket) {
        this.socket.emit("custom-event", {
          name: "kintsugi mini-game",
          in: this.roomID,
          args: {
            id: "next fracture",
            fracture: this.currentFracture
          }
        });
      }
      this.endFracture();
    },
    cancelFracture(fragments) {
      console.log(fragments);
      this.app.spread(fragments);
    },
    launchCountdown() {
      return new Promise((resolve, reject) => {
        this.countdown = 3;
        this.countdownInterval = setInterval(() => {
          this.countdown--;
          console.log("coutdown", this.countdown);
          if (this.countdown === 0) {
            clearInterval(this.countdownInterval);
            console.log("coutdown écoulé");
            resolve();
          }
        }, 1000);
      });
    },
    endFracture() {
      clearInterval(this.timerInterval);
      this.app.currentFracture = null;
      this.app.currentFragments = null;
      this.app.endFracture();
      this.$refs.momoIsPlaying.style.opacity = "1";
    },
    debugLaunchFracture(fragments, fracture) {
      console.log("debugLaunchFracture");
      this.app.bringCloser(fragments, 5);

      this.launchFracture(fracture, fragments);
    }
  },
  destroyed() {
    window.removeEventListener("touchmove", this.onTouchMove.bind(this));
    window.removeEventListener("mousemove", this.onMouseMove.bind(this));
    window.removeEventListener("mousedown", this.onMouseDown.bind(this));
    window.removeEventListener("mouseup", this.onMouseUp.bind(this));
    window.removeEventListener("resize", this.app.onWindowResize.bind(this));
    window.removeEventListener(
      "orientationchange",
      this.app.onOrientationChange.bind(this)
    );
  },
  components: {
    isReady,
    Countdown
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";
.ui {
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 2;
  width: 100%;
  height: 100%;
  .isPlaying {
    // opacity: 0;
    position: absolute;
    left: 0px;
    top: 0px;
    // z-index: 2;
    width: 100%;
    height: 100%;
    background: rgba(200, 200, 200, 0.7);
    display: flex;
    .container {
      margin: auto;
      display: flex;
      justify-content: center;
      flex-direction: column;
    }
  }
  .countdown {
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    .container {
      margin: auto;
      height: 100px;
    }
  }

  .swipe {
    position: absolute;
    top: -40px;
    left: -40px;
    display: flex;
    pointer-events: none;
    opacity: 0;

    #cursor {
      margin: auto;
      height: 80px;
      width: 80px;
      background: $white;
      border: $red 3px solid;
      border-radius: 100%;
    }
  }
}
.debug {
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  display: flex;
  flex-direction: row;
  z-index: 20;
  button {
    background: white;
  }
}
</style>
