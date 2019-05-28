<template>
    <div>
        <div>
            <div>liens</div>
            <nuxt-link to="/">Home</nuxt-link>
            <nuxt-link to="/synchro">synchro</nuxt-link>
            <nuxt-link :to="{name: 'level', params: {level: 'kintsugi'}}">kintsugi</nuxt-link>
            <nuxt-link :to="{name: 'level', params: {level: 'kanso'}}">kanso</nuxt-link>
        </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
a {
    margin-right: 16px;
    color: #fff;
}
</style>
