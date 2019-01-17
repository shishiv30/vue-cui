<template>
    <textbox type="text" :name="name" v-model="_value" :validateType="validateType" :placeholder="placeholder">
        <a slot="right" href="javascript:;" class="btn orange active"><i class="icon-search"></i></a>
    </textbox>
</template>
<script scr="./textboxautocomplete.js"></script>
<style lang="scss">
    @import './textboxautocomplete.scss';
</style>