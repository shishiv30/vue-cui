export default {
    name: 'popover',
    props: {
        data: {},
        type: {
            type: String,
            default: ''
        },
        target: {},
        container: {},
        autoClose: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            classObject: {
                open: false,
                left: false,
                right: false,
                top: false,
                bottom: false
            }
        };
    },
    methods: {
        open() {
            var that = this;
            setTimeout(function () {
                var $this = $(that.$el).find('.popover-panel');
                that.classObject.open = true;
                var $container = $(that.container);
                var $target = $(that.target);
                var width = $this.outerWidth();
                var height = $this.outerHeight();
                var cWidth = $container.outerWidth();
                var tOffset = $target.offset();
                var cOffset = $container.offset();
                var cWidth = $container.outerWidth();
                var x = tOffset.left - cOffset.left;
                var y = tOffset.top - cOffset.top;
                if (x < width / 2) {
                    x = width / 2;
                } else if (x > (cWidth - width / 2)) {
                    x = cWidth - width / 2;
                }
                if (y < height * 1.3) {
                    that.classObject.bottom = true;
                    that.classObject.top = false;
                } else {
                    that.classObject.bottom = false;
                    that.classObject.top = true;
                }
                var css = {
                    left: x,
                    top: y
                };
                $this.css(css);
                that.$emit('open');
            }, 200);
        },
        close: function () {
            this.classObject.open = false;
            this.$emit('close');
        }
    },
    mounted: function () {
        var that = this;
        var $popover = $(this.$ele).find('.popover-panel');
        $popover.click(function (e) {
            e.stopPropagation();
        });
    }
};