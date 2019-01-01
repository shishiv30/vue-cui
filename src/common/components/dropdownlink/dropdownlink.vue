<template>
    <dropdown :class="[theme, disabled]" :hoverable="options.hoverable" :autoclose="true" ref="dropdownList">
        <a href="javascript:void(0);" v-html="selectedItem.labelText || selectedItem.text"></a>
        <div class="dropdown-list list-link">
            <a href="javascript:void(0);" :class="item.className" v-for="(item,index) in data" @click="change(index, item)" v-html="item.text"></a>
        </div>
    </dropdown>
</template>

<script src="./dropdownlink.js"></script>