<template>
  <div id="level">
    <desktop-stage v-if="$device.isDesktop"></desktop-stage>
    <mobile-stage v-else-if="$device.isMobileOrTablet"></mobile-stage>
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
