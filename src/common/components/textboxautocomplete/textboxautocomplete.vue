<template>
    <textbox ref="textbox" :placeholder="placeholder" :name="name" :id="id" v-model="_value" :type="type" :autoClean="autoClean">
        <ul slot="extention" ref="list" v-if="suggestions" class="textbox-list">
            <li v-for="(item,index) in suggestions" :key="item.key + index" :class="{ hover: selectedIndex === (index+1)}"><a
                    @click="selected(index)">{{item.value}} <i class="icon-search"></i></a></li>
        </ul>
    </textbox>
</template>

<script src="./textboxautocomplete.js">

</script>

<style lang="scss">
    @import './textboxautocomplete.scss';

</style>
