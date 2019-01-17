<template lang="html">
    <div class="nav">
        <div class="nav-bar">
            <a href="javascript:;" class="nav-icon nav-switch-link">
                <slot name="logo"></slot>
            </a>
            <div class="nav-bar-search">
                <slot name="searchBox"></slot>
            </div>
            <div class="nav-bar-menu">
                <slot name="fixedMenus"></slot>
            </div>
        </div>
        <div class="nav-menu">
            <ul class="nav-menu-list">
                <slot name="menus"></slot>
            </ul>
        </div>
    </div>
</template>

<script src="./nav.js"></script>

<style lang="scss">
    @import "./nav.scss";
</style>