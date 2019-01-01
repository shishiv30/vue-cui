export default {
    name: 'checkbox',
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
    created() {
        //check it's mupltilpe checkbox
        this.isSingle = this.data.length === 1;
    },
    computed: {
        active() {
            return this.isSingle && this.value === this.data[0].value;
        }
    },
    methods: {
        checked(value) {
            if (this.isSingle) {
                return (this.value === value) ?
                    1 :
                    0;
            } else {
                return this.value.indexOf(value) > -1 ?
                    1 :
                    0;
            }
        },
        changed(e) {
            if (this.isSingle) {
                this.$emit(
                    'input', e.target.checked ?
                        this.data[0].value :
                        this.data[0].defaultValue);
            } else {
                var checkList = this.value.concat([]);
                if (e.target.checked) {
                    checkList.push(e.target._value);
                } else {
                    checkList.splice(checkList.indexOf(e.target._value), 1);
                }
                this.$emit('input', checkList);
            }
        }
    }
};