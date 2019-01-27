import textbox from '../textbox/textbox.vue';

export default {
    name: 'textboxAutocompelte',
    extends: textbox,
    props: {
        data: {},
        maxCount: {
            type: Number,
            default: 10
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
                        key: [key],
                        value: {
                            type: 'state'
                        },
                        display: `${key} State`
                    });
                    var cities = result[key];
                    if (cities && cities.length) {
                        cities.forEach(function (city) {
                            dict.push({
                                key: [city, key],
                                value: {
                                    type: 'city'
                                },
                                display: `${city}, ${key}`
                            });
                        });
                    }
                }
                return dict;
            }
        }
    },
    data() {
        return {
            stopWords: ['a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because',
                'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t',
                'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has',
                'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him',
                'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its',
                'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
                'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s',
                'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
                'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too',
                'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what',
                'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
                'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
            ],
            dict: [],
            suggestion: [],
        };
    },
    methods: {
        participle(value) {
            var that = this;
            if (!value) {
                return null;
            }
            var keywords = value.split(/\W/).reduce(function (prev, next) {
                if (next && that.stopWords.indexOf(next) === -1) {
                    prev.push(next);
                    return prev;
                } else {
                    return prev;
                }
            }, []);
            if (keywords && keywords.length) {
                return new RegExp(`^(${keywords.join('|')})`, 'i');
            } else {
                return null;
            }
        },
        getSuggestion() {
            var maxCount = this.maxCount;
            var keywords = this.participle(this._value);
            if (keywords && this.dict && this.dict.length) {
                var limitSuggest = [];
                for (let i = 0; i < this.dict.length; i++) {
                    var item = this.dict[i];
                    if (item && item.display) {
                        var result = item.display.match(keywords);
                        if (result && result.length) {
                            // console.log(`${result.index} ${result[0]}`);
                            limitSuggest.push(item);
                        }
                    }
                    if (limitSuggest.length > maxCount) {
                        break;
                    }
                }
                this.suggestion = limitSuggest;
            } else {
                this.suggestion = [];
            }
        },
        initalDict() {
            var that = this;
            if (this.data) {
                this.dict = this.mapping ? this.mapping(data) : data;
            } else if (this.dataurl) {
                $.get(this.dataurl).then(function (data) {
                    if (!data) {
                        that.dict = [];
                    }
                    var temp;
                    if (typeof data === 'string') {
                        temp = $.parseJSON(data);
                    } else {
                        temp = data;
                    }

                    if (that.mapping) {
                        that.dict = that.mapping(temp);
                    } else {
                        that.dict = temp;
                    }
                }, function () {
                    that.dict = [];
                });
            } else {
                return;
            }
        }
    },
    mounted() {
        var that = this;
        var $input = $(this.$refs.input);
        $input.one('focus', function () {
            that.initalDict();
        });
        $input.on('keyup', $.throttle(function () {
            that.getSuggestion();
        }, 50));
    }
};