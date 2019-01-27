(function ($) {
    $.fn.autocomplete = function (options) {
        var defaultOpt = {
            // dataurl: 'https://raw.githubusercontent.com/cschoi3/US-states-and-cities-json/master/data.json',
            dataurl: context.appUrl + 'api/common/geo/autosearch',
            data: null,
            maxCount: 100,
            dict: null,
            mapping: function (result) {
                var dict = [];
                for (var key in result) {
                    dict.push({
                        key: key,
                        value: [key],
                        type: 'state',
                        display: key
                    });
                    var cities = result[key];
                    if (cities && cities.length) {
                        for (var i = 0; i < cities.length; i++) {
                            var city = cities[i];
                            dict.push({
                                key: city,
                                type: 'city',
                                value: [city, key],
                                display: (city + ', ' + key)
                            });
                        }
                    }
                }
                return dict;
            }
        };
        var opt = $.extend({}, defaultOpt, options);
        var $this = $(this);
        var $target = $('<ul class="textbox-list">dropdown</ul>');
        $this.closest('.input').append($target);
        var render = function (data) {
            if (data && data.length) {
                var html = data.reduce(function (prev, next) {
                    return prev + ('<li>' + next + '</li>');
                }, '');
                $target.html(html);
                $target.addClass('active');
            } else {
                $target.html('');
                $target.removeClass('active');
            }
        };
        var value = '';
        var getSuggestion = function () {
            if (value === $this.val()) {
                return;
            } else {
                value = $this.val();
            }

            if (value.length > 3) {
                return $.get(opt.dataurl, { key: value }).then(function (data) {
                    var temp;
                    if (typeof data === 'string') {
                        temp = $.parseJSON(data);
                    } else {
                        temp = data;
                    }
                    render(temp);
                });
            }
        };
        var jqXHR = null;
        var data = {
            inputValue: '',
            index: 0,
        };
        var hightlight = function (isNext) {
            var $active = $target.find('.hover');
            if ($active.length === 0) {
                $target.find('li:eq(0)').addClass('hover');
            } else {
                $active.removeClass('hover');
                if (isNext) {
                    if ($active.next().length > 0) {
                        $active.next().addClass('hover');
                    } else {
                        $target.find('li').first().addClass('hover');
                    }
                } else {
                    if ($active.prev().length > 0) {
                        $active.prev().addClass('hover');
                    } else {
                        $target.find('li').last().addClass('hover');
                    }
                }
            }
        }
        $this.on('keyup', $.debounce(function (e) {
            if (e.key === 'ArrowDown') {
                return hightlight(true);
            } else if (e.key === 'ArrowUp') {
                return hightlight(false);
            }
            if (jqXHR && jqXHR.state() === 'pending') {
                jqXHR.abort();
            }
            jqXHR = getSuggestion();
        }, 100));
    };
    $(document).on('dom.load', function () {
        $('[data-autocomplete]').each(function (index, item) {
            var $item = $(item);
            $item.autocomplete($item.data());
            $item.removeAttr('data-autocomplete');
            $item.attr('data-autocomplete-load');
        });
    });
}(jQuery))