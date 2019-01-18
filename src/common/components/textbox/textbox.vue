<template lang="html">
    <div class="textbox" :class="textboxClass">
        <div class="input" :class="inputClass">
            <label>{{placeholder}}</label>
            <slot name="left"></slot>
            <input ref="input" v-model="_value" />
            <slot name="right"></slot>
            <div class="input-info" v-show="error||info">{{error||info}}</div>
        </div>
        <ul v-if="suggestion" class="textbox-list">
            <li v-for="item in suggestion">{{item.display}}</li>
        </ul>
    </div>
</template>

<script src="./textbox.js"></script>

<style lang="scss">
    @import "./textbox.scss";
</style>