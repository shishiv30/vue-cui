<template lang="html">
    <div class="radio" :class="[theme, disabled]">
        <label v-for="item in data">
            <input type="radio" :value="item.value" :disabled="item.disabled" :checked="checked(item.value)" @change="changed" />
            <i></i>
            <span>{{item.text}}</span>
        </label>
    </div>
</template>
<script src="./radio.js"></script>
<style lang="scss">
    @import "./radio.scss";
</style>