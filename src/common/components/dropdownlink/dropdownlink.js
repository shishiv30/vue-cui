import dropdown from '@/common/components/dropdown/dropdown.vue';
export default {
    name: 'dropdownLink',
    props: {
        data: {
            type: Array,
            required: true
        },
        value: {},
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
        selectedItem() {
            return this.data.find(e => e.value == this._value) || this.data[0];
        }
    }
}