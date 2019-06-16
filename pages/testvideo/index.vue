<template>
  <div id="motion">
    <div class="container" ref="container">
      <div class="video_container" ref="video-container1">
        <video :src="video1" muted preload="none" ref="video1"></video>
      </div>
      <div class="video_container" ref="video-container2">
        <video :src="video2" muted preload="none" ref="video2"></video>
      </div>
      <div class="video_container third" ref="video-container3">
        <div class="third_container">
          <video :src="video3" muted preload="none" ref="video3"></video>
        </div>
      </div>
    </div>
    <div class="subtitles">
      <div class="subtitles_container subtitle-semi">{{currentSubtitle}}</div>
    </div>
  </div>
</template>

<script>
import video1 from "~/static/videos/intro/intro_1.mp4";
import video2 from "~/static/videos/intro/intro_2.mp4";
import video3 from "~/static/videos/intro/intro_3.mp4";
import intro_sound from "~/static/sounds/intro_sound.mp3";

import { TweenMax } from "gsap";
import HowlerManager from "~/assets/js/utils/HowlerManager";

let subtitles = [
  {
    timecode: 0,
    text: ""
  },
  {
    timecode: 1012,
    text: "The World was evolving in perfect Harmony"
  },
  {
    timecode: 4013,
    text:
      "thanks to the peaceful existence between Nature and All Living Things."
  },
  {
    timecode: 10005,
    text: "Then Humans"
  },
  {
    timecode: 12003,
    text: "corrupted by over-consumption"
  },
  {
    timecode: 14014,
    text: "started polluting the Environment"
  },
  {
    timecode: 16021,
    text: "shattering this Harmony, little by little."
  },
  {
    timecode: 20000,
    text: ""
  },
  {
    timecode: 22008,
    text: "Humans then shed their obsolete objects"
  },
  {
    timecode: 25017,
    text: "to get new ephemeral gadgets."
  },
  {
    timecode: 29014,
    text: "Thus laid aside"
  },
  {
    timecode: 31010,
    text: "those abandoned objects saw their spirit leave them,"
  },
  {
    timecode: 35017,
    text: "and were reduced to simple rubbish."
  },
  {
    timecode: 38021,
    text: ""
  },
  {
    timecode: 40002,
    text: "Momo was a little House Being"
  },
  {
    timecode: 43006,
    text: "whose task was to keep Harmony within his Humans home."
  },
  {
    timecode: 47011,
    text: "As he couldn't maintain this Harmony by himself anymore,"
  },
  {
    timecode: 51070,
    text: "he prayed and asked the World's Spirit for help."
  },
  {
    timecode: 55000,
    text: ""
  },
  {
    timecode: 57007,
    text: "The World's Spirit as willing to help Momo,"
  },
  {
    timecode: 61001,
    text: "and She gave a part of Herself"
  },
  {
    timecode: 63009,
    text: "Romo, to assist him in his quest."
  },
  {
    timecode: 67002,
    text: ""
  }
];

export default {
  data() {
    return {
      video1: video1,
      video2: video2,
      video3: video3,
      extended: false,
      subtitles: subtitles,
      currentSubtitleIndex: 0
    };
  },
  computed: {
    currentSubtitle() {
      return this.subtitles[this.currentSubtitleIndex].text;
    },
    nextSubtitleTimecode() {
      return this.subtitles[this.currentSubtitleIndex + 1].timecode;
    }
  },
  mounted() {
    this.load().then(() => {
      console.log("can start");
      this.timecodeEvents();
      this.start();
    });
  },
  methods: {
    load() {
      let promises = [];

      this.$refs.video1.load();
      let videoLoading = new Promise((resolve, reject) => {
        this.$refs.video1.addEventListener(
          "loadeddata",
          () => {
            resolve();
          },
          false
        );
      });
      promises.push(videoLoading);
      let soundsLoading = new Promise((resolve, reject) => {
        HowlerManager.add([
          {
            id: "intro_sound",
            src: intro_sound
          }
        ]).then(sounds => {
          this.sounds = sounds;
          resolve();
        });
      });
      promises.push(soundsLoading);

      return new Promise((resolve, reject) => {
        Promise.all(promises).then(() => {
          resolve();
        });
      });
    },
    onTimeUpdate() {
		let seek = this.sounds.intro_sound.seek()
		let currentTime = seek*1000
      if (currentTime > 1120 && !this.timecodes[0]) {
        this.timecodes[0] = true;
        this.$refs.video1.play();
        this.$refs.video2.load();
      } else if (currentTime > 21011 && !this.timecodes[1]) {
        this.timecodes[1] = true;
        this.$refs.video2.play();
        this.$refs.video3.load();
      } else if (currentTime > 39502 && !this.timecodes[2]) {
        this.timecodes[2] = true;
        this.$refs.video3.play();
      } else if (currentTime > 43014 && !this.timecodes[3]) {
        this.timecodes[3] = true;
        this.extends();
      }

      if (currentTime > this.nextSubtitleTimecode) {
        this.currentSubtitleIndex++;
      }

      this.$refs.video1.addEventListener("play", () => {
        this.$refs.video1.status = "playing";
        TweenMax.to(this.$refs["video-container1"], 0.5, {
          ease: Power4.easeOut,
          opacity: 1
        });
      });

      this.$refs.video2.addEventListener("play", () => {
        this.$refs.video2.status = "playing";
        TweenMax.to(this.$refs["video-container2"], 0.5, {
          ease: Power4.easeOut,
          opacity: 1
        });
      });

      this.$refs.video3.addEventListener("play", () => {
        this.$refs.video3.status = "playing";
        TweenMax.to(this.$refs["video-container3"], 0.5, {
          ease: Power4.easeOut,
          opacity: 1
        });
      });

      requestAnimationFrame(this.onTimeUpdate.bind(this));
    },
    timecodeEvents() {
      this.timecodes = [false, false, false, false];
      this.sounds.intro_sound.once("play", () => {
        requestAnimationFrame(this.onTimeUpdate.bind(this));
      });
    },
    start() {
      this.sounds.intro_sound.play();
    },
    extends() {
      let box = this.$refs["video-container3"].getBoundingClientRect();

      //create shadow div
      let shadow = document.createElement("div");
      shadow.style.width = box.width + "px";
      shadow.style.height = box.height + "px";
      this.$refs.container.appendChild(shadow);

      //positionning video3
      this.$refs["video-container3"].classList.add("extended");

      let tl = new TimelineMax();
      tl.to(this.$refs["video-container3"], 3, {
        width: "100%",
        ease: Power4.easeInOut
	  })
	//   .to(
    //     this.$refs["video-container1"],
    //     2.5,
    //     {
    //       opacity: 0,
    //       ease: Power4.easeOut
    //     },
    //     0
    //   );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";
#motion {
  width: 100%;
  height: 100%;
  display: flex;
  .container {
    margin: auto;
    width: 90vw;
    height: 80vh;
    // max-width: 1214px;
    // max-height: 686px;
    display: flex;
    justify-content: space-between;
    position: relative;
    .video_container {
      &:nth-child(2) {
        margin: 0 16px;
      }
      max-width: 400px;
      width: 400px;
      //   max-height: 100%;
        // display: flex;
      opacity: 0;
	  //   width: 400px;
	  border: 3px solid #000;
      video {
        // margin: auto;
        max-width: unset;
        overflow: hidden;
        
        height: 100%;

        // object-fit: contain;
        width: 100%;
        background: #fefaf0;
      }
      &.third {
        z-index: 2;
        .third_container {
          overflow: hidden;
          display: flex;
          margin: auto;
		  height: 100%;
		  position: relative;
        }
        video {
		//   object-fit: cover;
		  width: unset;
		  position: absolute;
		  left: 0px;
		  top: 0px;
		  max-width: 90vw;
		  min-width: 100%;
        }

        &.extended {
          display: block;
          position: absolute;
          max-width: unset;
          height: 100%;
          top: 0px;
          right: 0px;
          .third_container {
            width: 100%;
            video {
				// max-width: 100%;
            //   object-fit: contain;
            }
          }
        }
      }
    }
  }
  .subtitles {
    position: absolute;
    bottom: calc(5vh - (45px / 2));
    width: 100%;
    display: flex;
    .subtitles_container {
      margin: auto;
    }
  }
}
</style>
