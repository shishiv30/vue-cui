import cuiMap from '../common/components/map/map.vue';
import textbox from '../common/components/textbox/textbox.vue';
export default {
    name: 'doc',
    asyncData({
        store,
        route
    }) {
        //do async api call to get more data about spetial page, and update store.state
    },
    components: {
        cuiMap,
        textbox
    },
    methods: {
        initalMap() {}
    },
    computed: {

    },
    beforeMount() {
        const {
            asyncData
        } = this.$options;
        if (asyncData) {
            this.dataPromise = asyncData({
                store: this.$store,
                route: this.$route
            });
        }
    },
    beforeRouteUpdate(to, from, next) {
        const {
            asyncData
        } = this.$options;
        if (asyncData) {
            asyncData({
                store: this.$store,
                route: to
            }).then(next).catch(next);
        } else {
            next();
        }
    },
    mounted() {

    },
    data() {
        return {
            phone: '',
            email: '',
            password: '',
            time: '',
            search: '',
            comment: '',
            phone1: '',
            email1: '',
            password1: '',
            time1: '',
            search1: '',
            comment1: ''
        };
    }
};