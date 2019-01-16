export default {
    _scrollWidth: null,
    scrollWidth: function () {
        if (this._scrollWidth != null) {
            this._scrollWidth;
        }
        var outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.width = '100px';
        outer.style.msOverflowStyle = 'scrollbar';
        document.body.appendChild(outer);
        var widthNoScroll = outer.offsetWidth;
        outer.style.overflow = 'scroll';
        var inner = document.createElement('div');
        inner.style.width = '100%';
        outer.appendChild(inner);
        var widthWithScroll = inner.offsetWidth;
        outer.parentNode.removeChild(outer);
        this._scrollWidth = widthNoScroll - widthWithScroll;
        return this._scrollWidth;
    }
};