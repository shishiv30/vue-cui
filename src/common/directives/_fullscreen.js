import Vue from 'vue'
export default() => {
    Vue.directive('fullscreen', {
        bind(el, binding) {
            $(document).off('dom.scroll.fullscreen').on('dom.scroll.fullscreen', function() {
                var status = $.winStatus;
                if (status.isScrollDown) {
                    if (status.scrollTop > 200) {
                        $('#body').addClass('fullscreen');
                    }
                } else {
                    $('#body').removeClass('fullscreen');
                }
            });
        }
    });
}
