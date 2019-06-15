<template>
    <div id="about" ref="about">
        <div class="scrolling">
            <div class="fill" ref="fill"></div>
        </div>
        <div class="fixed">
            <div class="title">
                <span class="first stroke skew">Learn about</span>
                <div class="kintsugi">
                    <kintsugi/>
                </div>
                <div class="jpn">
                    <span class="fill-jpn skew">リペア</span>    
                </div>
            </div>
        </div>
        <div class="container">
            <div class="blocks">
                <div class="block block_0" ref="block_0">
                    <div class="p_container">
                        <p class="skew book">
                            The Japanese art of kintsugi teaches<br>
                            that <strong>broken objects are not something<br>
                            to hide but do display with pride</strong>.
                        </p>
                    </div>
                </div>
                <div class="block block_1" ref="block_1">
                    <div class="p_container">
                        <p class="skew book">
                            We should try to repair things<br>
                            because sometimes in doing so we obtain<br>
                            <strong>more unique and beautiful objects</strong><br>
                            This is the essence of resilience.
                        </p>
                    </div>
                </div>
                <div class="block block_2" ref="block_2">
                    <div class="p_container">
                        <p class="skew book">
                            Each of us should look for a way to <strong>cope<br>
                            with traumatic events in a positive way</strong>,<br>
                            learn from negative experience, take<br>
                            the best from them and convice ourselves<br>
                            that exactly <strong>these experiences<br>
                            make each person unique, precious</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div style="display:none" ref="shadow"></div>
    </div>
</template>

<script>
import Kintsugi from '@/components/svg/kintsugi'

import voice_kintsugi_1 from "~/static/sounds/voice_kintsugi_1.mp3";
import voice_kintsugi_2 from "~/static/sounds/voice_kintsugi_2.mp3";
import voice_kintsugi_3 from "~/static/sounds/voice_kintsugi_3.mp3";

import { TweenMax } from 'gsap'
import HowlerManager from "~/assets/js/utils/HowlerManager";

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
	return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

export default {
    data() {
        return {
            current: null,
            intervalAmount: 5000
        }
    },
    mounted() {
        this.load()
        .then(()=>{
            this.init()
        })
        this.appear()
        // .then(()=>{
        //     this.init()
        // })
    },
    watch: {
        current(val, oldVal) {
            let oldBlock = this.$refs['block_' + oldVal]
            let newBlock = this.$refs['block_' + val]
            let tl = new TimelineMax()

            tl
            .to(oldBlock || this.$refs.shadow,0.25, {
                opacity:0
            })
            .to(newBlock || undefined,0.25, {
                opacity:1
            })

            TweenMax.to(this.$refs.fill,2,{
                height: this.current.map(0,2,window.innerHeight/3,window.innerHeight),
                ease:Power4.easeOut
            })
        }
    },
    methods: {
        load() {
            return new Promise((resolve,reject)=>{
                HowlerManager.add([
                    {
                        id: "voice_kintsugi_1",
                        src: voice_kintsugi_1
                    },
                    {
                        id: "voice_kintsugi_2",
                        src: voice_kintsugi_2
                    },
                    {
                        id: "voice_kintsugi_3",
                        src: voice_kintsugi_3
                    },
                ]).then(sounds => {
                    this.sounds = sounds;
                    resolve();
                });
            });
        },
        init() {
            this.sounds.voice_kintsugi_1.play()
            this.sounds.voice_kintsugi_1.on('play',()=>{
                this.current = 0
            })
            this.sounds.voice_kintsugi_1.on('end',()=>{
                this.sounds.voice_kintsugi_2.play()
            })
            this.sounds.voice_kintsugi_2.on('play',()=>{
                this.current = 1
            })
            this.sounds.voice_kintsugi_2.on('end',()=>{
                this.sounds.voice_kintsugi_3.play()
            })
            this.sounds.voice_kintsugi_3.on('play',()=>{
                this.current = 2
            })
            this.sounds.voice_kintsugi_3.on('end',()=>{
                console.log("end")
            })
            // this.current = 0
            // this.interval = setInterval(() => {
            //     this.current++
            //     if(this.current === 2) {
            //         clearInterval(this.interval)
            //     }
            // }, this.intervalAmount);
        },
        appear() {
            return new Promise((resolve,reject)=>{
                TweenMax.to(this.$refs.about,1,{
                    opacity: 1,
                    ease:Power4.easeOut,
                    onComplete: ()=>{
                        resolve()
                    }
                })
            })
        }
    },
    components: {
        Kintsugi
    }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";

#about {
    height: 100%;
    width: 100%;
    display: flex;
    opacity: 0;

    .scrolling {
        position: absolute;
        right: 0px;
        width: 16px;
        height: 100%;
        .fill {
            height: 0px;
            width: 100%;
            background: $red;
        }
    }
    
    .fixed {
        position: absolute;
        display: flex;
        width: 100%;
        .title {
            position: relative;
            margin: auto;
            transform: translateX(-150px);
            top: 60px;
            .first {
                position: relative;
                top: 16px;
            }
            .kintsugi {
                width: 550px;
            }
            .jpn {
                position: relative;
                top: -8px;
                span {
                    position: absolute;
                    right: 0px;
                }
            }
        }
    }

    .container {
        margin: auto;
        position: relative;
        
        .blocks {
            position: relative;
            width: 600px;
            height: 400px;
            top:96px;
            .block {
                opacity: 0;
                display: flex;
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
                .p_container {
                    margin: auto;
                }
            }
        }
    }
}





</style>
