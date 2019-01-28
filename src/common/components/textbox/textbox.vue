<template lang="html">
    <div class="textbox" :class="textboxClass">
        <div class="input" :class="inputClass">
            <label>{{placeholder}}</label>
            <slot name="left"></slot>
            <input ref="input" v-model="_value" />
            <slot name="right"></slot>
            <div class="input-info" v-show="error">{{error}}</div>
        </div>
         <slot name="extention"></slot>
    </div>
</template>

<script src="./textbox.js"></script>

<style lang="scss">
    @import "./textbox.scss";
</style>