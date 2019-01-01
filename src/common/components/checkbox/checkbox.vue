<template lang="html">
    <div class="checkbox" :class="[theme, {'active': active, 'disabled': disabled}]">
        <label v-for="item in data">
            <input type="checkbox" :value="item.value" :disabled="item.disabled" :checked="checked(item.value)" @change="changed" />
            <i></i>
            <span>{{item.text}}</span>
        </label>
    </div>
</template>
<script src="./checkbox.js"></script>
<style lang="scss">
    @import "./checkbox.scss";
</style>