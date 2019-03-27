<template>
  <section class="container">
    <h1>{{$route.params.level}} level</h1>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  components: {},
  data: () => {
    return {
      level: ""
    };
  },
  computed: {
    ...mapState({
      levels: state => state.global.levels
    })
  },
  created() {
    this.level = this.$route.params.level;
  }
};
</script>