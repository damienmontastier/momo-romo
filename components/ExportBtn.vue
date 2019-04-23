<template>
    <div id="btns">
        <div @click="$emit('exprt',true)" id="export">Export</div>
        <div @click="$emit('save',true)" id="save">Save</div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="scss" scoped>
#btns {
    position: absolute;
    bottom: 24px;
    right: 24px;
    display: flex;

    #save {
        display: block;
        padding: 8px 24px;
        cursor: pointer;
        background: #ffffff;
    }

    #export {
        display: block;
        padding: 8px 24px;
        cursor: pointer;
        background: #ffffff;
        margin-right: 16px;
    }
}
</style>
