<template>
    <div id="page">
        <div class="container" ref="container">
            <div class="video_container" ref="video-container1">
                <video :src="video1" muted preload="none" ref="video1" controls></video>
            </div>
            <div class="video_container" ref="video-container2">
                <video :src="video2" muted preload="none" ref="video2" controls></video>
            </div>
            <div class="video_container third" ref="video-container3">
                <div class="third_container">
                    <video :src="video3" muted preload="none" ref="video3" controls></video>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import video1 from '@/static/videos/intro/intro_1.mp4'
import video2 from '@/static/videos/intro/intro_2.mp4'
import video3 from '@/static/videos/intro/intro_3.mp4'

import {TweenMax} from 'gsap'
export default {
    data() {
        return {
            video1: video1,
            video2: video2,
            video3: video3,
            extended: false
        }
    },
    mounted() {
        this.start()
    },
    methods: {
        start() {
            this.$refs.video1.load()
            this.$refs.video1.addEventListener('loadeddata',()=>{
                this.$refs.video1.play()
                this.$refs.video2.load()
            },false)

            this.$refs.video1.addEventListener('timeupdate',()=>{
                if(this.$refs.video1.currentTime > 14 && this.$refs.video2.status !== 'playing') {
                    console.log('2 play')
                    this.$refs.video2.play()
                    this.$refs.video3.load()
                }

            },false)

            this.$refs.video2.addEventListener('timeupdate',()=>{
                if(this.$refs.video2.currentTime > 11 && this.$refs.video3.status !== 'playing') {
                    console.log('3 play')
                    this.$refs.video3.play()
                }
            },false)

            this.$refs.video3.addEventListener('timeupdate',()=>{
                if(this.$refs.video3.currentTime > 5 && !this.extended) {
                    this.extended = true
                    console.log('start extends')
                    this.extends()
                }
            },false)

            this.$refs.video1.addEventListener('play',()=>{
                this.$refs.video1.status = 'playing'
                TweenMax.to(this.$refs['video-container1'],0.5, {
                    ease:Power4.easeOut,
                    opacity: 1
                })
            })

            this.$refs.video2.addEventListener('play',()=>{
                this.$refs.video2.status = 'playing'
                TweenMax.to(this.$refs['video-container2'],0.5, {
                    ease:Power4.easeOut,
                    opacity: 1
                })
            })

            this.$refs.video3.addEventListener('play',()=>{
                this.$refs.video3.status = 'playing'
                TweenMax.to(this.$refs['video-container3'],0.5, {
                    ease:Power4.easeOut,
                    opacity: 1
                })
            })
        },
        extends() {
            let box = this.$refs['video3'].getBoundingClientRect();
            let video1 = this.$refs['video1'].getBoundingClientRect()

            //create shadow div
            let shadow = document.createElement("div");
            shadow.style.width = box.width + 'px';
            shadow.style.height = box.height + 'px';
            this.$refs.container.appendChild(shadow);

            //positionning video3
            this.$refs['video-container3'].classList.add('extended')

            let right = window.innerWidth - box.right

            this.$refs['video-container3'].style.width = box.width + 'px'
            this.$refs['video-container3'].style.right = right + 'px';
            this.$refs['video-container3'].style.top = box.top + 'px';

            let width = box.right - video1.left
            
            let tl = new TimelineMax()
            tl.to(this.$refs['video-container3'],2.5, {
                width: width,
                ease: Power4.easeOut
            })
            .to(this.$refs['video-container1'],2.5, {
                opacity: 0,
                ease: Power4.easeOut
            },0)
        }
    },
}
</script>

<style lang="scss" scoped>
    #page {
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
            justify-content: space-evenly;
            // position: relative;
            .video_container {
                // max-width: 33.33333333%;
                display: flex;
                opacity: 0;
                video {
                    margin:auto;
                    max-width: unset;
                    overflow: hidden;
                    border: 3px solid #000;
                    // object-fit: cover;
                }
                &.third {
                    z-index: 2;
                    .third_container {
                        width: 400px;
                        overflow: hidden;
                        display: flex;
                        margin: auto;
                    }
                    video {
                        object-fit: cover;
                    }
                    
                    &.extended {
                        display: block;
                        position: absolute;
                        .third_container {
                            width: 100%;
                        }
                    }
                }
            }
        }
    }
</style>
