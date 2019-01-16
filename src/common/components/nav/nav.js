export default {
    name: 'navigation',
    methods: {},
    components: {},
    mounted: function () {
        var $body = $('#body');
        var $this = $(this.$el);
        var $list = $this.find('.nav-menu-list');
        var $dropdown = $list.find('.list');
        var $overlay = $('<div class="nav-overlay"></div>');
        var $swtichLink = $this.find('.nav-switch-link');
        $this.prepend($overlay);
        var _show = function () {
            $body.addClass('body-nav-expand');
        };
        var _hide = function () {
            $body.removeClass('body-nav-expand');
        };
        $overlay.on('click', _hide);
        $dropdown.each(function () {
            var $arrow = $('<a src="javascript:;" class="nav-expand"><i class="icon-angle-left"></i></a>');
            $arrow.on('click', function () {
                var $li = $(this).closest('li');
                var $prev = $li.siblings('.hover');
                $prev.removeClass('hover');
                $prev.css('height', '');
                if ($li.hasClass('hover')) {
                    $li.removeClass('hover');
                    $li.css('height', '');
                } else {
                    $li.addClass('hover');
                    $li.css('height', $li.prop('scrollHeight') + 1);
                }
            });
            $(this).append($arrow);
        });
        $swtichLink.on('click', function () {
            if ($body.hasClass('body-nav-expand')) {
                _hide();
            } else {
                _show();
            }
        });
        $(document).on('dom.resize', function () {
            _hide();
        });
    }
};