export default {
    inital: function () {
        $.localStorage = {};
        if (window.localStorage) {
            try {
                $.localStorage = JSON.parse(window.localStorage.getItem('movotoLocalStorage')) || {};
            } catch (e) {
                return e;
            }
        }
    },
    setItem: function (key, value) {
        if (!$.localStorage) {
            $.inital();
            if (key === 'inital') {
                return;
            }
        }
        $.localStorage[key] = value;
        if (window.localStorage) {
            try {
                window.localStorage.setItem('movotoLocalStorage', JSON.stringify($.localStorage));
            } catch (e) {
                return e;
            }
        }
    },
    getItem: function (key) {
        if (!$.localStorage) {
            $.setItem('inital');
        }
        return $.localStorage[key];
    }
};