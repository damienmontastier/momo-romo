<template>
  <div id="kintsugi">
    <!-- <div class="title">kintsugi mobile mini game {{roomID}}</div> -->
    <is-ready v-if="!isReady"/>
    <div ref="canvas" id="canvas"></div>
    <div id="debug"></div>
  </div>
</template>

<script>
import * as THREE from "three";
import OrbitControls from "orbit-controls-es6";
import ObjectLoader from "~/assets/js/utils/ObjectLoader";
import { mapState } from "vuex";
import { TweenMax } from "gsap";
import isReady from './isReady'

class App {
  constructor() {
    window.addEventListener("resize", this.onWindowResize.bind(this));
    window.addEventListener("orientationchange", this.onOrientationChange.bind(this));
    this.loaded = false;
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
  }

  init(ref, socket, roomID) {
    this.socket = socket;
    this.roomID = roomID;
    this.ref = ref;
    this.WIDTH = window.innerWidth;
    this.HEIGHT = window.innerHeight;

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.ref.appendChild(this.renderer.domElement);

    // scene
    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(
      40,
      this.WIDTH / this.HEIGHT,
      1,
      10000
    );
    this.camera.position.set(0, 0, 100);

    // controls
    // this.controls = new OrbitControls(this.camera);
    // this.controls.enabled = true;

    // ambient light
    this.scene.add(new THREE.AmbientLight(0x222222));

    // directional light
    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(0, 0, 100);
    this.scene.add(this.light);

    // axes
    this.scene.add(new THREE.AxesHelper(20));

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
    let intersects = this.raycaster.intersectObjects(
      this.currentFracture.children.filter(f => !f._triggered),
      true
    );
    if (intersects[0]) {
      let piece = intersects[0].object;
      console.log(piece);
      if (
        piece.name === 0 ||
        this.currentFracture.children[piece.name - 1].triggered === true
      ) {
        this.triggerFracturePiece(piece);
        if (
          piece.name ===
          this.currentFracture.children[
            this.currentFracture.children.length - 1
          ].name
        ) {
          this.endFracture();
        }
      }
    }
  }

  triggerFracturePiece(piece) {
    piece.triggered = true;
    piece.material.color.set(0x00ff00);
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

  loadBowl() {
    ObjectLoader.load({
      url: "https://rocheclement.fr/momoromo/bol/_.glb",
      format: "glb"
    }).then(object => {
      this.model = object.scene.children[0].children[0].children[0];
      this.model.children.forEach((c, index) => {
        c._originPosition = c.getWorldPosition(new THREE.Vector3());
        c._originRotation = c.rotation;
        c._originScale = c.scale;

        c.position.multiplyScalar(3);
        c._maxPosition = c.position.clone();
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
          piece.material.color.set(new THREE.Color(0xff0000));
          piece.name = index;
          // console.log(piece)
        });
      });

      this.scene.add(this.model);
      this.loaded = true;
    });
  }

  bringCloser(targets, step) {
    step = 6 - (step + 1);
    let ratio = step / 6;

    let target1 = this.fragments[targets[0]];
    let p1 = target1._maxPosition
      .clone()
      .sub(target1._originPosition.clone())
      .multiplyScalar(ratio)
      .add(target1._originPosition.clone());
    TweenMax.to(target1.position, 0.5, { x: p1.x, y: p1.y, z: p1.z });

    if (targets[1]) {
      let target2 = this.fragments[targets[1]];
      let p2 = target2._maxPosition
        .clone()
        .sub(target2._originPosition.clone())
        .multiplyScalar(ratio)
        .add(target2._originPosition.clone());
      TweenMax.to(target2.position, 0.5, { x: p2.x, y: p2.y, z: p2.z });
    }
  }

  spread(targets) {
    let target1 = this.fragments[targets[0]];
    let p1 = target1._maxPosition.clone();
    TweenMax.to(target1.position, 0.5, { x: p1.x, y: p1.y, z: p1.z });

    if (targets[1]) {
      let target2 = this.fragments[targets[1]];
      let p2 = target2._maxPosition.clone();
      TweenMax.to(target2.position, 0.5, { x: p2.x, y: p2.y, z: p2.z });
    }
  }

  launchFracture(fracture) {
    if (this.fractures[fracture]) {
      this.currentFracture = this.fractures[fracture];
    }
  }

  endFracture() {
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
    this.currentFracture = null;
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
    let orientation = screen.orientation.angle
    if(orientation === 90 || orientation === -90) {
      this.orientation = "landscape"
    } else if (orientation === 0 || orientation === -0) {
      this.orientation = "portrait"
    }
    this.camera.aspect = window.innerHeight / window.innerWidth;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerHeight,window.innerWidth);
  }
}

export default {
  data() {
    return {
      app: new App(),
      mouse: new THREE.Vector2(),
      isMouseDown: false,
      isReady: false
    };
  },
  computed: {
    ...mapState({
      socket: state => state.synchro.socket,
      roomID: state => state.synchro.roomID
    }),
    loaded() {
      return this.app.loaded;
    }
  },
  watch: {
    loaded(val) {
      console.log("isLoaded");
    },
    mouse: {
      handler: function() {
        this.app.mouse = this.mouse;
      },
      deep: true
    }
  },
  // created() {
  //     TouchEmulator();
  // },
  mounted() {
    // TouchEmulator();
    window.addEventListener("touchmove", this.onTouchMove.bind(this), false);
    window.addEventListener("mousemove", this.onMouseMove.bind(this), false);
    window.addEventListener("mousedown", this.onMouseDown.bind(this), false);
    window.addEventListener("mouseup", this.onMouseUp.bind(this), false);
    this.init();
    this.createSocketEvents();
  },
  methods: {
    createSocketEvents() {
      if (this.socket) {
        this.socket.on("kintsugi mini-game", params => {
          if (params.id === "launch fracture") {
            this.app.launchFracture(params.fracture);
          }
          if (params.id === "bring closer") {
            this.app.bringCloser(params.fragments, params.step);
          }
          if (params.id === "cancel fracture") {
            this.app.spread(params.fragments);
          }
          if (params.id === "romo is ready") {
            this.isReady = true
          }
        });
      }
    },
    init() {
      this.app.init(this.$refs.canvas, this.socket, this.roomID);
      this.app.loadBowl();
      // setTimeout(() => {
      //   this.app.launchFracture(0);
      // }, 2000);
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
      console.log("touch move");
      this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      // }
    },
    onMouseDown(event) {
      this.isMouseDown = true;
    },
    onMouseUp(event) {
      this.isMouseDown = false;
    }
  },
  components: {
    isReady
  }
};
</script>

<style lang="scss">
</style>
