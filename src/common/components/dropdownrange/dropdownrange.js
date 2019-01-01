import dropdown from '@/common/components/dropdown/dropdown.vue';
import textbox from '@/common/components/textbox/textbox.vue';
import inputCurrency from '@/common/components/inputcurrency/inputcurrency.vue';
import inputNumber from '@/common/components/inputnumber/inputnumber.vue';
import format from '@/common/vutilities/format';
export default {
    name: 'dropdownRange',
    props: {
        data: {
            type: Object,
            required: true
        },
        value: {},
        dropdown: {
            type: Boolean,
            default: true
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
        inputCurrency,
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
            }
            newItem[this.options.mapping.min] = value;
            this._value = newItem;
            this.$refs.max.$el.focus();
        },
        close() {
            this.dropdown && this.$refs.dropdownList.close();
        },
        changeMax(value) {
            var newItem = {};
            if (this.options.type === 'inputCurrency') {
                var digitalCount = value.toString().length;
                switch (digitalCount) {
                case 1:
                    value = value * Math.pow(10, 6);
                    break;
                case 2:
                case 3:
                case 4:
                    value = value * Math.pow(10, 3);
                    break;
                }
            }
            if (value < this.minValue) {
                newItem[this.options.mapping.min] = 0;
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
            if (this.dropdown && this.editMin != flag) {
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
            if (this.options.input === 'inputCurrency') {
                const formatPrice = format.friendlyPrice;
                if (!min && !max) {
                    return name;
                } else if (min && max === 0) {
                    return `$${formatPrice(min)}+`;
                } else if (min && max && min === max) {
                    return formatPrice(min);
                } else {
                    return `$${formatPrice(min)|| min} - $${formatPrice(max)||max}`;
                }
            } else {
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
    }
};