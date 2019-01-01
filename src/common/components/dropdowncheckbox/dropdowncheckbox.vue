<template lang="html">
    <dropdown :class="[theme, disabled]" :hoverable="options.hoverable" :autoclose="false" ref="dropdownList">
        <a href="javascript:void(0);" v-html="selectedItemText"></a>
        <div class="dropdown-list list-checkbox">
            <checkbox :data="data" v-model="_value" :theme="options.checkboxTheme"></checkbox>
        </div>
    </dropdown>

</template>
<script src="./dropdowncheckbox.js"></script>
<style lang="scss">
    @import "./dropdowncheckbox.scss";
</style>