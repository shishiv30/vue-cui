<template lang="html">
    <div class="popover" :class="classObject">
        <div class="popover-overlay"></div>
        <div class="popover-panel">
            <slot></slot>
        </div>
    </div>
</template>
<script src="./popover.js">
</script>
<style lang="scss">
    @import "./popover.scss";
</style>