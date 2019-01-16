export default {
    name: 'dropdown',
    props: {
        hoverable: {
            type: Boolean,
            default: false
        },
        autoclose: {
            type: Boolean,
            default: true
        },
        closestate: {
            type: Boolean,
            default: false
        },
        isSmall: {
            type: Boolean,
            default: false
        },
        isDisabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            active: false
        };
    },
    watch: {
        closestate: {
            immediate: true,
            handler(newVaule, oldValue) {
                this.close();
            }
        }
    },
    methods: {
        open() {
            var that = this;
            if (!this.active) {
                this.active = true;
                var $this = $(this.$el);
                setTimeout(function () {
                    var $root = $this.closest('.dropdown-list, body');
                    if ($root.is('.dropdown-list')) {
                        $('#body').addClass('body-dropdown-show');
                    }
                    $root.one(('click.dropdown' + that._uid), function () {
                        that.close();
                    });
                }, 100);
                $this.closest('[scroller]').trigger('opened');
            }
        },
        close() {
            if (this.active) {
                this.active = false;
                var $this = $(this.$el);
                var $root = $this.closest('.dropdown-list, body');
                $root.off(('click.dropdown' + this._uid));
                $('#body').removeClass('body-dropdown-show');
                setTimeout(function () {
                    $this.closest('[scroller]').trigger('closed');
                }, 500);
            }
        }
    },
    mounted: function () {
        var that = this;
        var $this = $(this.$el);
        var $link = $this.children('a');
        var $list = $this.children('.dropdown-list');

        if (!this.autoclose) {
            $list.on('click', function (e) {
                e.stopPropagation();
            });
        } else if (this.hoverable) {
            $list.on('click', function (e) {
                $this.addClass('animating');
                setTimeout(function () {
                    $this.removeClass('animating');
                }, 500);
            });
        }
        $link.on('click', function (e) {
            if (!$this.hasClass('active')) {
                that.open();
            }
        });
    }
};