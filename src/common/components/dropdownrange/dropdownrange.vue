<template lang="html">
    <dropdown :class="[theme, disabled]" :hoverable="options.hoverable" :autoclose="false" ref="dropdownList">
        <a href="javascript:void(0);" v-text="selectedItemText" @click="autoFocus"></a>
        <div class="dropdown-list list-range" ref="list">
            <div class="texboxt-range">
                <textbox>
                    <div class="input small">
                        <label>Min {{options.name}}</label>
                        <component :is="options.input" ref="min" v-model="minValue" @actived="flipDropdownList(true)" :placeholder="minList[0].text"></component>
                    </div>
                </Textbox>
                <span>-</span>
                <textbox>
                    <div class="input small">
                        <label>Max {{options.name}}</label>
                        <component :is="options.input" ref="max" v-model="maxValue" @actived="flipDropdownList(false)" :placeholder="maxList[0].text"></component>
                    </div>
                </Textbox>
            </div>
            <a href="javascript:void(0);" v-for="item in minList" @click="changeMin(item.value)" v-show="editMin" v-text="item.text"></a>
            <a class="text-right" href="javascript:void(0);" v-for="item in maxList" @click="changeMax(item.value)" v-show="!editMin" v-text="item.text"></a>
        </div>
    </dropdown>
</template>

<script src="./dropdownrange.js"></script>

<style lang="scss">
    @import "./dropdownrange.scss";
</style>