import Vue from 'vue';
import format from '@/common/utilities/format';

export default () => {
    Vue.filter('formatPrice', function (value) {
        if (!value) {
            return '-';
        }
        return '$' + format.formatNumberByComma(value);
    });
    Vue.filter('formatNumber', function (value) {
        if (!value) {
            return '0';
        }
        return format.formatNumberByComma(value);
    });
    Vue.filter('formatFriendlyPrice', function (value) {
        if (!value) {
            return '-';
        }
        return '$' + format.friendlyPrice(value);
    });
    Vue.filter('formatArea', function (value) {
        if (!value) {
            return '-';
        }
        return format.formatNumberByComma(value);
    });
    Vue.filter('stripNonNumeric', function (text) {
        if (typeof text === 'string') {
            return text.replace(/\D/g, '');
        } else {
            return text + '';
        }
    });
    Vue.filter('formatPhoneNumber', function (phoneNumber) {
        var phoneNumberFormatted = '(' + phoneNumber.substring(0, 3) + ')' + phoneNumber.substring(3, 6) + '-' + phoneNumber.substring(6, 10);
        return phoneNumberFormatted;
    });
};