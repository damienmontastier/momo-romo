<template>
  <div id="default">
    <portrait v-if="this.$device.isMobile"/>
    <nuxt/>
    <debugger id="debugger" v-if="$route.name != 'editor'"></debugger>
  </div>
</template>

<script>
import Debugger from "@/components/debugger/Debugger";
import Portrait from "@/components/Portrait";
export default {
  components: {
    Debugger,
    Portrait
  },
  mounted() {}
};
</script>


<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
}

#__nuxt,
#__layout,
#default {
  height: 100%;
  width: 100%;
}

body {
  height: 100%;
  width: 100%;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

#debugger {
  position: absolute;
  right: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  padding: 16px;
  z-index: 10000;
}
</style>

