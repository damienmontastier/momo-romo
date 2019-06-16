<template>
  <div id="level">
    <DesktopStage v-if="$device.isDesktop"></DesktopStage>
    <MobileStage v-else-if="$device.isMobileOrTablet"></MobileStage>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import DesktopStage from "@/components/stage/DesktopStage";
import MobileStage from "@/components/stage/MobileStage";

export default {
  components: {
    DesktopStage,
    MobileStage
  },
  computed: {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
