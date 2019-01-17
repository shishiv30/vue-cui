import textbox from '../textbox/textbox.vue';

export default {
    name: 'textboxAutocompelte',
    components: {
        textbox,
    },
    props: {
        name: {},
        value: {},
        validateType: {},
        placeholder: {},
        data: {},
        url: {},
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
        _value: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        },
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
        this.url = 'https://raw.githubusercontent.com/cschoi3/US-states-and-cities-json/master/data.json';
        if (this.data) {
            this.dict = this.mapping ? this.mapping(data) : data;
        } else if (this.url) {
            $.get(url).then(function (data) {
                this.dict = this.mapping ? this.mapping(data) : data;
            }).error(function () {
                this.dict = null;
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