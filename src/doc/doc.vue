<template>
<div class="search">
    <i class="icon-plus"></i>
    <cuiMap></cuiMap>
</div>
</template>

<script>
import cuiMap from '../common/components/map.vue';
export default {
    name: 'doc',
    components: {
        cuiMap
    },
    asyncData({
        store,
        route
    }) {
        return {

        }
    },
    computed: {

    },
    beforeMount() {
        const {
            asyncData
        } = this.$options
        if (asyncData) {
            this.dataPromise = asyncData({
                store: this.$store,
                route: this.$route
            })
        }
    },
    beforeRouteUpdate(to, from, next) {
        const {
            asyncData
        } = this.$options
        if (asyncData) {
            asyncData({
                store: this.$store,
                route: to
            }).then(next).catch(next)
        } else {
            next()
        }
    }
};
</script>

<style lang="scss">
@import "~@src/common/scss/ui.scss";
</style>
