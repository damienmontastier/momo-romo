<template>
  <div id="portrait">
    <div id="portrait-container">
      <h1 class="skew fill-en">Rotate to Play</h1>
      <p class="skew book">
        Please use your phone in
        <span class="semi">landscape</span> to join the tale
      </p>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "~assets/scss/main.scss";

#portrait {
  height: 100vh;
  width: 100vw;
  z-index: 100;
  position: absolute;
  left: 0px;
  top: 0px;
  display: flex;
  div {
    margin: auto;
  }
}
@media screen and (orientation: portrait) {
  #portrait {
    background: #fbf8ee;
    display: flex;
    justify-content: center;
    align-items: center;
    &-container {
      max-width: 80%;
      h1 {
        margin-bottom: 20px;
      }
      &::before {
        content: "";
        position: absolute;
        top: 0%;
        left: 0%;
        z-index: -1;
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg);
        background: url("~static/ui/mobile/background.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        width: 100vh;
        height: 100%;
      }
    }
  }
}

@media screen and (orientation: landscape) {
  #portrait {
    display: none;
  }
}
</style>
