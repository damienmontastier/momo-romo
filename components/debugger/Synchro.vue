<template>
    <div>
        <div>SYNCHRO: {{isSynchro}}</div>
        <a :href="url">{{url}}</a>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    computed: {
        ...mapState({
            isSynchro: state => state.synchro.isSynchro,
            url: state => state.synchro.url
        })
    },
}
</script>

<style lang="scss" scoped>

</style>
