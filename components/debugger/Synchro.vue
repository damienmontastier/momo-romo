<template>
    <div>
        SYNCHRO: {{isSynchro}}
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    computed: {
        ...mapState({
            isSynchro: state => state.synchro.isSynchro
        })
    },
}
</script>

<style lang="scss" scoped>

</style>
