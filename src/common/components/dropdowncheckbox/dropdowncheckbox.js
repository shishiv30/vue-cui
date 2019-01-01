import dropdown from '@/common/components/dropdown/dropdown.vue';
import checkbox from '@/common/components/checkbox/checkbox.vue';

export default {
    name: 'dropdownCheckbox',
    components: {
        dropdown,
        checkbox
    },
    props: {
        data: {
            type: Array,
            required: true
        },
        value: {
            type: Array
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
                placeholder: '',
                checkboxTheme: 'small',
                hoverable: 'false'
            })
        }
    },
    methods: {
        close() {
            this.$refs.dropdownList.close();
        }
    },
    computed: {
        _value: {
            get() {
                return this.value;
            },
            set(e) {
                this.$emit('input', e);
            }
        },
        selectedItemText() {
            if (this._value.length === 0) {
                return this.options.placeholder;
            } else if (this._value.length === 1) {
                return this.data.find(e => e.value == this._value[0]).text;
            } else {
                return `${this._value.length} ${this.options.placeholder}s`;
            }
        }
    }
};