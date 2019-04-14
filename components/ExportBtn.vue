<template>
    <div @click="$emit('exprt',true)" id="btn">Export</div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss" scoped>
#btn {
    position: absolute;
    bottom: 24px;
    right: 24px;
    display: block;
    padding: 8px 24px;
    cursor: pointer;
    background: #ffffff;
}
</style>
