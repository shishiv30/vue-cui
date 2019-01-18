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
        }
    },
    data() {
        return {
            error: '',
            info: '',
            suggestion: [],
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
        getValue() {
            return this._value;
        },
        setError(msg) {
            this.error = msg;
        },
        setInfo(msg) {
            this.info = 'msg';
        },
        getInput() {
            return this.$refs.input;
        }
    },
    mounted() {
        var that = this;
        var autoClean = this.autoClean;
        var $this = $(this.$el);
        var $input = $(this.$refs.input);

        $input.on('focusin', function () {
            $this.addClass('focus');
        });
        $input.on('focusout', function () {
            if (!that._value) {
                $this.removeClass('focus');
            }
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