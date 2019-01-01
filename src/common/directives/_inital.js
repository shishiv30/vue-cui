import Vue from 'vue';
export default () => {
    $.winStatus = {
        originalScrollTop: $(window).scrollTop(),
        isLandscape: $(window).width() > $(window).height(),
        scrollTop: $(window).scrollTop(),
        scrollLeft: $(window).scrollLeft(),
        causeByKeyboard: false,
        isScrollDown: false,
        height: $(window).height(),
        width: $(window).width()
    };
    var _isMobile = function () {
        var $body = $('body');
        if ($.isMobile()) {
            $body.addClass('mobile');
        } else {
            $body.addClass('desktop');
        }
    };
    var _isLandscap = function () {
        var $body = $('body');
        $.winStatus.width = $(window).width();
        $.winStatus.height = $(window).height();
        $.winStatus.isLandscape = $.winStatus.width > $.winStatus.height;
        if ($.winStatus.isLandscape) {
            $body.addClass('landscape');
            $body.removeClass('portrait');
        } else {
            $body.addClass('portrait');
            $body.removeClass('landscape');
        }
    };
    var _isScrollDown = function () {
        $.winStatus.scrollTop = $(window).scrollTop();
        if ($.winStatus.scrollTop > $.winStatus.originalScrollTop) {
            $.winStatus.isScrollDown = true;
        } else if ($.winStatus.scrollTop < $.winStatus.originalScrollTop) {
            $.winStatus.isScrollDown = false;
        }
        $.winStatus.originalScrollTop = $.winStatus.scrollTop;
    };
    var _updateByResize = function () {
        _isScrollDown();
        _isLandscap();
    };
    var _updatebyScroll = function () {
        _isScrollDown();
    };
    var _updateWindowStatus = function (type) {
        $.winStatus.causeByKeyboard = $('input, select, textarea').is(':focus');
        switch (type) {
        case 'resize':
        case 'inital':
            _updateByResize();
            break;
        case 'scroll':
            _updatebyScroll();
            break;
        case 'load':
            break;
        default:
            break;
        }
        return status;
    };
    Vue.directive('inital', {
        bind: function () {
            _isMobile();
            _updateWindowStatus('inital');
            $(window).on('scroll', $.throttle(function () {
                _updateWindowStatus('scroll');
                $(document).trigger('dom.scroll');
            }, 200));
            $(window).on('resize', $.debounce(function () {
                _updateWindowStatus('resize');
                $(document).trigger('dom.resize');
            }, 500));
        },
        unbind: function () {
            $(window).off('scroll');
            $(window).off('resize');
        }
    });
};