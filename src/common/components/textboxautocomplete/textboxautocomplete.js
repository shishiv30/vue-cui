import textbox from '../textbox/textbox.vue';
import Fuse from 'fuse.js';

export default {
    name: 'textboxAutocompelte',
    components: {
        textbox
    },
    props: {
        placeholder: {
            type: String,
        },
        name: {
            type: String,
        },
        id: {
            type: String,
        },
        value: {
            type: String,
        },
        type: {
            type: String,
        },
        autoClean: {
            type: Boolean,
            default: true
        },
        maxCount: {
            type: Number,
            default: 10
        },
        data: {
            type: Array,
        },
        dataurl: {
            type: String,
            default: 'https://raw.githubusercontent.com/cschoi3/US-states-and-cities-json/master/data.json'
        },
        mapping: {
            type: Function,
            default: function (result) {
                var dict = [];
                for (let key in result) {
                    dict.push({
                        key: key,
                        display: `${key} State`
                    });
                    var cities = result[key];
                    if (cities && cities.length) {
                        cities.forEach(function (city) {
                            dict.push({
                                key: city,
                                value: `${city}, ${key}`
                            });
                        });
                    }
                }
                return dict;
            }
        }
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
    },
    data() {
        return {
            dict: null,
            suggestions: [],
            fuseOpt: {
                shouldSort: true,
                threshold: 0.3,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                    'key',
                ]
            },
            selectedIndex: 0,
        };
    },
    methods: {
        getValue() {
            return this._value;
        },
        setError(msg) {
            this.$refs.textbox.error = msg;
        },
        getInput() {
            return this.$refs.textbox.$refs.input;
        },
        initalDict() {
            var that = this;
            if (this.data) {
                this.dict = this.mapping ? this.mapping(data) : data;
            } else if (this.dataurl) {
                $.get(this.dataurl).then(function (data) {
                    data = data || [];
                    var temp = typeof data === 'string' ? $.parseJSON(data) : data;
                    that.dict = new Fuse(that.mapping ? that.mapping(temp) : temp, that.fuseOpt);
                });
            }
        },
        getSuggestions() {
            this.suggestions = this.dict && this.dict.search(this._value);
            this.selectedIndex = 0;
        },
        hightlight(isNext) {
            var index = (isNext ? this.index + 1 : this.index - 1);
            if (index >= 0 && index < this.suggestions.length) {
                this.selectedIndex = index;
            }
        },
        selected(index) {
            this._value = this.suggestions[index].value;
        },
        getSelected(){
            return this.suggestions[this.selectedIndex];
        }
    },
    mounted() {
        var that = this;
        var $input = $(this.getInput());
        $input.one('focus', function () {
            that.initalDict();
        });
        $input.on('keyup', $.debounce(function (e) {
            if (e.key === 'ArrowDown') {
                that.hightlight(true);
            } else if (e.key === 'ArrowUp') {
                that.hightlight(false);
            }
            that.getSuggestions();
        }, 100));
    }
};