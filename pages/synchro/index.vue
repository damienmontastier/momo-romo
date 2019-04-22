<template>
    <div>
        synchro
    </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
export default {
    mounted() {
        this.init({device: this.$device.isMobile,roomID: this.$device.isMobile ? this.$route.query.id : null})
    },
    methods: {
        ...mapActions({
            'init':'synchro/init'
        }),
        ...mapMutations({
        })
    },
}
</script>

<style lang="scss" scoped>

</style>
