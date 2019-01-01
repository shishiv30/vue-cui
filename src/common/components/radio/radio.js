export default {
    name: 'radio',
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
            default: () => ({})
        }
    },
    methods: {
        checked(value) {
            return value == this.value;
        },
        changed(e) {
            this.$emit('input', e.target._value);
        }
    }
};