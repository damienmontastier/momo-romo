 <template>
  <div ref="page">
    <canvas ref="canvas"></canvas>
    <video ref="video" muted playinsline></video>
  </div>
</template>

<script>
import * as THREE from "three";
import OrbitControls from "orbit-controls-es6";

import Sprite from "@/assets/js/objects/Sprite";

import kintsugi_sprite from "~/static/sprites/about/kintsugi.png";
import kintsugi_json from "~/static/sprites/about/kintsugi.json";
export default {
  computed: {},
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // renderer
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: this.$refs.canvas
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio = window.devicePixelRatio;

      // scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xfdf9eb);

      // camera
      this.camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      this.camera.position.set(2, 2, 2);

      // controls
      this.controls = new OrbitControls(this.camera, this.$refs.page);
      this.controls.enabled = true;
      // this.controls.enablePan = false;

      // axes
      this.scene.add(new THREE.AxesHelper(20));

      this.time = 0;
      this.clock = new THREE.Clock();

      // this.createVideo()
      // .then(()=>{
      //   this.addVideo()
      // })

      this.addVideo();

      //animation loop
      this.renderer.setAnimationLoop(this.render.bind(this));
    },
    addVideo() {
      new Sprite(kintsugi_sprite, kintsugi_json.sprites, {
        wTiles: 8,
        hTiles: 16
      }).then(video => {
        this.video = video;
        this.scene.add(this.video);
        console.log(this.scene);

        this.video
          .newSprites()
          .addState("default")
          .start();
        this.video.scale.set(-2, 1, 1);
      });
    },
    // createVideo() {
    //   this.$refs.video.src = kintsugi_video

    //   return new Promise((resolve,reject)=>{
    //     this.$refs.video.addEventListener('loadeddata',()=>{
    //       resolve()
    //     })
    //   })

    // },
    // addVideo() {
    //   this.$refs.video.play();

    //   this.videoTexture = new THREE.VideoTexture(this.$refs.video);
    //   this.videoTexture.minFilter = THREE.LinearFilter;
    //   this.videoTexture.magFilter = THREE.LinearFilter;
    //   this.videoTexture.format = THREE.RGBFormat;

    //   this.uniforms = {
    //     video_texture: { value: this.videoTexture }
    //   };
    //   this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
    //   this.material = new THREE.ShaderMaterial({
    //     uniforms: this.uniforms,
    //     transparent:true,
    //     vertexShader: `
    //       varying vec2 vUv;

    //       void main() {
    //         vUv = uv;
    //         gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    //       }
    //     `,
    //     fragmentShader: `
    //       uniform sampler2D video_texture;
    //       varying vec2 vUv;

    //       void main() {
    //         vec4 texture = texture2D(video_texture,vUv);
    //         if(texture.g > 0.55) {
    //           texture.a = 0.0;
    //         }
    //         gl_FragColor = vec4(texture);
    //       }
    //     `
    //   });

    //   // this.material = new THREE.MeshBasicMaterial({
    //   //   map: this.videoTexture
    //   // })

    //   this.video = new THREE.Mesh(this.geometry, this.material);
    //   this.scene.add(this.video);
    // },
    render() {
      const delta = this.clock.getDelta() * 5000;
      this.time += delta;
      if (this.video) {
        this.video.update(delta);
      }
      this.renderer.render(this.scene, this.camera);
    }
  }
};
</script>

<style lang="scss" scoped>
#debugger-sprite {
  position: absolute;
  top: 0px;
  left: 0px;
  background: #fff;

  ul {
    li {
      &.current {
        background: red;
        color: #fff;
      }
    }
  }
}

video {
  display: none;
}
</style>
