import validation from '../../utilities/validation';

export default {
    name: 'textbox',
    props: {
        placeholder: {
            type: String,
        },
        name: {
            type: String,
        },
        id: {
            type: String,
        },
        value: {
            type: String,
        },
        type: {
            type: String,
        },
        autoClean: {
            type: Boolean,
            default: false
        },
        validateType: {}
    },
    data() {
        return {
            error: '',
            info: ''
        };
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
        textboxClass() {
            return {
                focus: this._value
            };
        },
        inputClass() {
            return {
                left: this.$slots.left,
                right: this.$slots.right,
                'has-error': this.error
            };
        },
    },
    methods: {
        checkError() {
            if (this.validateType) {
                if (typeof this.validateType === 'function') {
                    this.error = this.validateType(this._value);
                } else {
                    this.error = this.validateMessage(this.validateType, this._value);
                }
            } else {
                this.error = '';
            }
        },
        validateMessage() {
            var result = validation.valide(this.validateType, this._value);
            if (result.passed) {
                return '';
            }
            if (result.type === 'required') {
                if (this.name) {
                    return `The ${name} is ${result.type}`;
                } else {
                    return `The input is ${result.type}`;
                }
            }
            if (this.name) {
                return `The ${name} is invalide ${result.type}`;
            } else {
                return `The input is invalide ${result.type}`;
            }
        }
    },
    mounted() {
        var that = this;
        var autoClean = this.autoClean;
        var $this = $(this.$el);
        var $input = $this.find('input');

        if (!$input.length) {
            $input = $this.find('textarea');
        }

        $input.on('focusin', function () {
            $this.addClass('focus');
        });
        $input.on('focusout', function () {
            if (!this._value) {
                $this.removeClass('focus');
            }
            that.checkError();
        });

        if (autoClean) {
            $input.on('focusin.autoClean', function () {
                $input.val('');
                $input.one('keydown', function () {
                    $input.off('focusout.autoClean');
                });
                $input.one('focusout.autoClean', function () {
                    $input.val(this._value);
                });
            });
        }
    }
};