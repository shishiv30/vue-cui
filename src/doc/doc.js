import cuiMap from '@/common/components/map/map.vue';
import textbox from '@/common/components/textbox/textbox.vue';
import dropdownLink from '@/common/components/dropdownlink/dropdownlink.vue';
import dropdownMenu from '@/common/components/dropdownmenu/dropdownmenu.vue';
import checkbox from '@/common/components/checkbox/checkbox.vue';
import radio from '@/common/components/radio/radio.vue';
import dropdown from '@/common/components/dropdown/dropdown.vue';
import dropdownCheckbox from '@/common/components/dropdowncheckbox/dropdowncheckbox.vue';
import dropdownRange from '@/common/components/dropdownrange/dropdownrange.vue';
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
        textbox,
        dropdownLink,
        checkbox,
        radio,
        dropdown,
        dropdownCheckbox,
        dropdownRange,
        dropdownMenu
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
            hotlead: {
                mail: null,
                phonenumber: null,
                name: null,
                comments: null,
            },
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
            comment1: '',
            beds: {
                data: [{
                    text: 'Any',
                    labelText: 'Beds',
                    value: 0
                }, {
                    text: '1+',
                    labelText: '1+ Beds',
                    value: 1
                }, {
                    text: '2+',
                    labelText: '2+ Beds',
                    value: 2
                }, {
                    text: '3+',
                    labelText: '3+ Beds',
                    value: 3
                }, {
                    text: '4+',
                    labelText: '4+ Beds',
                    value: 4
                }, {
                    text: '5+',
                    labelText: '5+ Beds',
                    value: 5
                }],
                model: 0
            },
            agreed: {
                data: [{
                    text: 'agreed',
                    value: 0,
                    defaultValue: 1
                }],
                model: 0
            },
            fav: {
                data: [{
                    text: 'music',
                    value: 0,
                },
                {
                    text: 'sport',
                    value: 1,
                },
                {
                    text: 'reading',
                    value: 3,
                }
                ],
                model: []
            },
            tags: {
                data: [{
                    text: 'Hot',
                    value: 'hot'
                }, {
                    text: 'Cool',
                    value: 'cool'
                }, {
                    text: 'Spetial',
                    value: 'spetial'
                }, {
                    text: 'Nice',
                    value: 'nice'
                }, {
                    text: 'Awesome',
                    value: 'awesome'
                }, {
                    text: 'Cheap',
                    value: 'cheap'
                }, ],
                model: [],
                options: {
                    placeholder: 'Tag'
                }
            },
            gender: {
                data: [{
                    text: 'Female',
                    value: 1,
                },
                {
                    text: 'Male',
                    value: 2,
                },
                {
                    text: 'secret',
                    value: 0,
                }
                ],
                model: 0
            },
            priceRange: {
                data: {
                    min: [{
                        text: '0',
                        value: 0
                    }, {
                        text: '$100K+',
                        value: 100000
                    }, {
                        text: '$125K+',
                        value: 125000
                    }, {
                        text: '$150K+',
                        value: 150000
                    }, {
                        text: '$175K+',
                        value: 175000
                    }, {
                        text: '$200K+',
                        value: 200000
                    }, {
                        text: '$225K+',
                        value: 225000
                    }, {
                        text: '$250K+',
                        value: 250000
                    }, {
                        text: '$275K+',
                        value: 275000
                    }, {
                        text: '$300K+',
                        value: 300000
                    }, {
                        text: '$325K+',
                        value: 325000
                    }, {
                        text: '$350K+',
                        value: 350000
                    }, {
                        text: '$375K+',
                        value: 375000
                    }, {
                        text: '$400K+',
                        value: 400000
                    }, {
                        text: '$450K+',
                        value: 450000
                    }, {
                        text: '$500K+',
                        value: 500000
                    }, {
                        text: '$550K+',
                        value: 550000
                    }, {
                        text: '$600K+',
                        value: 600000
                    }, {
                        text: '$650K+',
                        value: 650000
                    }, {
                        text: '$700K+',
                        value: 700000
                    }, {
                        text: '$800K+',
                        value: 800000
                    }, {
                        text: '$900K+',
                        value: 900000
                    }, {
                        text: '$1M+',
                        value: 1000000
                    }, {
                        text: '$1.25M+',
                        value: 1250000
                    }, {
                        text: '$1.5M+',
                        value: 1500000
                    }, {
                        text: '$1.75M+',
                        value: 1750000
                    }, {
                        text: '$2M+',
                        value: 2000000
                    }, {
                        text: '$2.25M+',
                        value: 2250000
                    }, {
                        text: '$2.5M+',
                        value: 2500000
                    }, {
                        text: '$2.75M+',
                        value: 2750000
                    }, {
                        text: '$3M+',
                        value: 3000000
                    }, {
                        text: '$4M+',
                        value: 4000000
                    }, {
                        text: '$5M+',
                        value: 5000000
                    }, {
                        text: '$10M+',
                        value: 10000000
                    }],
                    max: [{
                        text: 'Any Price',
                        value: 0
                    }, {
                        text: '$100K',
                        value: 100000
                    }, {
                        text: '$125K',
                        value: 125000
                    }, {
                        text: '$150K',
                        value: 150000
                    }, {
                        text: '$175K',
                        value: 175000
                    }, {
                        text: '$200K',
                        value: 200000
                    }, {
                        text: '$225K',
                        value: 225000
                    }, {
                        text: '$250K',
                        value: 250000
                    }, {
                        text: '$275K',
                        value: 275000
                    }, {
                        text: '$300K',
                        value: 300000
                    }, {
                        text: '$325K',
                        value: 325000
                    }, {
                        text: '$350K',
                        value: 350000
                    }, {
                        text: '$375K',
                        value: 375000
                    }, {
                        text: '$400K',
                        value: 400000
                    }, {
                        text: '$450K',
                        value: 450000
                    }, {
                        text: '$500K',
                        value: 500000
                    }, {
                        text: '$550K',
                        value: 550000
                    }, {
                        text: '$600K',
                        value: 600000
                    }, {
                        text: '$650K',
                        value: 650000
                    }, {
                        text: '$700K',
                        value: 700000
                    }, {
                        text: '$800K',
                        value: 800000
                    }, {
                        text: '$900K',
                        value: 900000
                    }, {
                        text: '$1M',
                        value: 1000000
                    }, {
                        text: '$1.25M',
                        value: 1250000
                    }, {
                        text: '$1.5M',
                        value: 1500000
                    }, {
                        text: '$1.75M',
                        value: 1750000
                    }, {
                        text: '$2M',
                        value: 2000000
                    }, {
                        text: '$2.25M',
                        value: 2250000
                    }, {
                        text: '$2.5M',
                        value: 2500000
                    }, {
                        text: '$2.75M',
                        value: 2750000
                    }, {
                        text: '$3M',
                        value: 3000000
                    }, {
                        text: '$4M',
                        value: 4000000
                    }, {
                        text: '$5M',
                        value: 5000000
                    }, {
                        text: '$10M',
                        value: 10000000
                    }]
                },
                model: {
                    minPrice: 0,
                    maxPrice: 0,
                },
                options: {
                    name: 'Price',
                    mapping: {
                        min: 'minPrice',
                        max: 'maxPrice'
                    },
                    autoFocus: 'max',
                    input: 'inputNumber'
                }
            }
        };
    }
};