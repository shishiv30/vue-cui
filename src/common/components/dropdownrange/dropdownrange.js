import dropdown from '../dropdown/dropdown.vue';
import textbox from '../textbox/textbox.vue';
import inputNumber from '../inputnumber/inputnumber.vue';
import format from '../../utilities/format.js';
export default {
    name: 'dropdownRange',
    props: {
        data: {
            type: Object,
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
                name: '',
                mapping: {
                    min: 'min',
                    max: 'max'
                },
                autoFocus: 'min',
                closeAfterSetMax: true,
                input: 'inputNumber',
                hoverable: false
            })
        }
    },
    components: {
        textbox,
        dropdown,
        inputNumber
    },
    data() {
        return {
            editMin: this.options.autoFocus === 'min'
        };
    },
    methods: {
        changeMin(value) {
            var newItem = {};
            if (value > this.maxValue) {
                newItem[this.options.mapping.max] = 0;
            } else {
                newItem[this.options.mapping.max] = this._value[this.options.mapping.max];
            }
            newItem[this.options.mapping.min] = value;
            this._value = newItem;
            this.$refs.max.$el.focus();
        },
        close() {
            this.$refs.dropdownList.close();
        },
        changeMax(value) {
            var newItem = {};
            if (value < this.minValue) {
                newItem[this.options.mapping.min] = 0;
            } else {
                newItem[this.options.mapping.min] = this._value[this.options.mapping.min];
            }

            newItem[this.options.mapping.max] = value;
            this._value = newItem;
            this.close();
        },
        autoFocus() {
            var target = this.$refs[this.options.autoFocus];
            target && target.$el.focus();
        },
        flipDropdownList(flag) {
            if (this.editMin != flag) {
                this.editMin = flag;
                this.$refs.list.scrollTop = 0;
            }
        },
        onEnter(key) {
            const value = this._value[key];
            this.change(this.selectedIndex(key), {
                value
            }, key);
            (key === this.options.mapping.min) && this.autoFocus();
        }
    },
    computed: {
        maxList() {
            let minValue = this.minValue;
            return this.data.max.filter(function (e) {
                return e.value > minValue || e.value === 0;
            });
        },
        minList() {
            return this.data.min;
        },
        maxValue: {
            get() {
                return this._value[this.options.mapping.max];
            },
            set(value) {
                this.changeMax(value * 1 || 0);
            }
        },
        minValue: {
            get() {
                return this._value[this.options.mapping.min];
            },
            set(value) {
                this.changeMin(value * 1 || 0);
            }
        },
        _value: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        },
        selectedItemText() {
            const name = this.options.name;
            let min = this.minValue;
            let max = this.maxValue;
            min = min ?
                parseInt(min) :
                min;
            max = max ?
                parseInt(max) :
                max;
            const formatNumber = format.formatNumberByComma;
            if (!min && !max) {
                return this.options.name;
            } else if (min && max === 0) {
                return `${formatNumber(min)}+ ${name}`;
            } else if (min && max && min === max) {
                return `${formatNumber(min)} ${name}`;
            } else {
                return `${formatNumber(min)} - ${formatNumber(max)} ${name}`;
            }
        }
    }
};