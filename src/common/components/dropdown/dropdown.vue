<template lang="html">
    <div class="dropdown" :class="{active:active, hoverable:hoverable}">
        <slot></slot>
    </div>
</template>
<script src="./dropdown.js"></script>
<style lang="scss">
    @import "./dropdown.scss";
</style>