<template>
<div class="search">
    API Page
</div>
</template>

<script>
export default {
    name: 'doc',
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
</style>
