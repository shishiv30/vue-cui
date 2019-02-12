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
            minLength: 3,
            userInput: '',
            selectedIndex: -1,
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
        updateSuggestions() {
            this.suggestions = this.dict && this.dict.search(this._value);
            this.selectedIndex = -1;
        },
        nextSuggestion() {
            if (this.selectedIndex >= this.suggestions.length) {
                this.selected(-1);
            } else {
                this.selected(this.selectedIndex += 1);
            }
            this.selected(this.selectedIndex);
        },
        prevSuggestion() {
            if (this.selectedIndex < 0) {
                this.selected(this.suggestions && this.suggestions.length ? this.suggestions.length : -1);
            } else {
                this.selected(this.selectedIndex - 1);
            }
        },
        selected(index) {
            if (index >= 0 && index < this.suggestions.length && this.suggestions[index]) {
                this._value = this.suggestions[index].value;
                this.selectedIndex = index;
            } else {
                this._value = this.userInput;
                this.selectedIndex = -1;
            }
        },
        getSelected() {
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
                that.nextSuggestion();
            } else if (e.key === 'ArrowUp') {
                that.prevSuggestion();
            }
            if (this.userInput !== this._value) {
                this.userInput = this._value;
                if (this.userInput.length > that.minLength) {
                    that.updateSuggestions();
                }
            }
        }, 50));
    }
};