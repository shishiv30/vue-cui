export default {
    name: 'textbox',
    props: {
        autoClean: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        var autoClean = this.autoClean;
        var defaultText = '';
        var $this = $(this.$el);
        var $input = $this.find('input');
        var _switchLabel = function () {
            if ($input.val()) {
                $this.addClass('focus');
            } else {
                $this.removeClass('focus');
            }
        };
        if (!$input.length) {
            $input = $this.find('textarea');
        }
        $input.on('focusin', function () {
            $this.addClass('focus');
        });
        $input.on('focusout', function () {
            if (!$input.val() && !defaultText) {
                $this.removeClass('focus');
            }
        });
        if (autoClean) {
            $input.on('focusin.autoClean', function () {
                defaultText = $input.val();
                $input.val('');
                $input.one('keydown', function () {
                    defaultText = '';
                    $input.off('focusout.autoClean');
                });
                $input.one('focusout.autoClean', function () {
                    $input.val(defaultText);
                    defaultText = '';
                });
            });
        }

        $input.on('change', _switchLabel);
        setTimeout(function () {
            _switchLabel();
        }, 10);
    }
};