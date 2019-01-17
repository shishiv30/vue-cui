import textbox from '../textbox/textbox.vue';

export default {
    name: 'textboxAutocompelte',
    extends: textbox,
    props: {
        data: {},
        dataurl: {
            type: String,
            default: 'https://raw.githubusercontent.com/cschoi3/US-states-and-cities-json/master/data.json'
        },
        mapping: {
            type: 'function'
        }
    },
    data() {
        return {
            dict: null,
            keyword: '',
        };
    },
    computed: {
        suggestion() {
            var reg = new reg(`${this.keyword}`);
            if (this.dict && this.dict.length) {
                return this.dict.filter(function () {
                    return reg.test(e);
                });
            } else {
                return [];
            }
        }
    },
    mounted() {
        var that = this;
        if (this.data) {
            this.dict = this.mapping ? this.mapping(data) : data;
        } else if (this.dataurl) {
            $.get(this.dataurl).then(function (data) {
                that.dict = that.mapping ? that.mapping(data) : data;
            }, function () {
                that.dict = null;
            });
        } else {
            return;
        }
        var $input = $(this.$el).find('input');
        $input.on('keydown', function (e) {
            that.keyword = $(this).val();
        });

    }
};