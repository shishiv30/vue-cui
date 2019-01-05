<template lang="html">
    <input type="text" v-model="displayValue" v-restrict.number @change="updated" @blur="setActive(false)" @focus="setActive(true)" />
</template>

<script>
    import format from '../../utilities/format';
    export default {
        name: 'inputCurrency',
        props: {
            value: {
                required: true
            },
            placeholder: {
                type: String,
                default: ''
            }
        },
        data: function () {
            return {
                actived: false,
                val: this.value || 0
            }
        },
        watch: {
            value() {
                this.val = this.value;
            }
        },
        methods: {
            setActive(actived) {
                this.actived = actived;
                if (this.actived) {
                    this.$emit('actived');
                }
            },
            updated() {
                this.$emit('input', this.val);
            }
        },
        computed: {
            displayValue: {
                get: function () {
                    if (this.actived) {
                        return format.formatNumberByComma(this.val);
                    } else {
                        return format.friendlyPrice(this.val) || this.placeholder;
                    }
                },
                set: function (modifiedValue) {
                    let newValue = parseFloat(modifiedValue.replace(/[^\d\.]/g, ''))
                    if (isNaN(newValue)) {
                        newValue = 0
                    }
                    this.val = newValue;
                }
            }
        }
    }
</script>

<style lang="css">
</style>