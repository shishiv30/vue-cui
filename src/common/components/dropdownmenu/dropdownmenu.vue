<template>
    <dropdown :class="[theme, disabled]" :hoverable="options.hoverable" :autoclose="true" ref="dropdownList">
        <template>
            <a href="javascript:void(0);" v-html="value"></a>
            <div class="dropdown-list list-link">
                <a :href="item.value" :class="item.className" v-for="(item,index) in data" @click="change(index, item)" v-html="item.text"></a>
            </div>
        </template>
    </dropdown>
</template>

<script src="./dropdownmenu.js"></script>