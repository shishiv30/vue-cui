import Vue from 'vue'
export default() => {
    Vue.directive('scrollerX', {
        bind(el, binding) {
            var $this = $(el);
            var timer = null;
            $this.on('mouseenter touchstart', '> *', function() {
                if (timer) {
                    clearTimeout(timer);
                }
                $this.addClass('active');
            });
            $this.on('mouseleave', '> *', function() {
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function() {
                    $this.removeClass('active');
                }, 500);
            });
        }
    })
}
