<template lang="html">
    <div class="dialog" :class="{active:active, hoverable:hoverable}">
        <slot></slot>
    </div>
</template>
<script src="./dialog.js"></script>
<style lang="scss">
    @import "./dialog.scss";

</style>
