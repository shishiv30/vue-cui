function fixedThreeDigits(value) {
    var num = Math.round(value);
    if (num < 10) {
        return Math.round(value * 100) / 100;
    } else if (num < 100) {
        return Math.round(value * 10) / 10;
    }
    return num;
};

function formatNumberByComma(amount) {
    if (amount === null || amount === undefined) {
        return '';
    }
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function friendlyPrice(amount) {
    if (!amount)
        return '';
    if (amount >= 10000 && amount < 1000000) {
        return fixedThreeDigits(amount / 1000) === 1000 ? '1M' : fixedThreeDigits(amount / 1000) + 'K';
    } else if (amount >= 1000000 && amount < 1000000000) {
        return fixedThreeDigits(amount / 1000000) === 1000 ? '1B' : fixedThreeDigits(amount / 1000000) + 'M';
    } else if (amount >= 1000000000) {
        return fixedThreeDigits(amount / 1000000000) + 'B';
    }
    return formatNumberByComma(amount);
}

function fomatPhoneNumber(number) {
    var display = number + '';
    var rawNumber = display.replace(/[^0-9]/g, '');
    if (rawNumber.length > 10) {
        rawNumber = rawNumber.substring(rawNumber.length - 10, rawNumber.length);
    } else {
        rawNumber = (Array(10).join(0) + rawNumber).slice(-10);
    }
    rawNumber = rawNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1)-$2-$3');
    return rawNumber;
}

function dateGetString(timestamp) {
    var p = new Date(timestamp);
    return p.getMonth() + 1 + '/' + p.getDate() + '/' + ('' + p.getFullYear()).substr(2);
}
export default {
    fixedThreeDigits,
    formatNumberByComma,
    friendlyPrice,
    fomatPhoneNumber,
    dateGetString

};