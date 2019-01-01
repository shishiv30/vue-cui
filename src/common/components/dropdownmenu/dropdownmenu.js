import dropdown from '@/common/components/dropdown/dropdown.vue';
export default {
    name: 'dropdownMenu',
    props: {
        data: {
            type: Array,
            required: true
        },
        value: {
            default: null
        },
        theme: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        options: {
            type: Object,
            default: () => ({
                hoverable: false
            })
        }
    },
    components: {
        dropdown
    },
    methods: {
        change(index, item) {
            if (this._value != item.value) {
                this._value = item.value;
            }
        },
        close() {
            this.$refs.dropdownList.close();
        }
    },
    computed: {
        _value: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        },
    }
}