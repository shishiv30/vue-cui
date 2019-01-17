var validation = {
    required(str) {
        return (str !== '' && str !== null && str !== 'undefined');
    },
    email(str) {
        var reg = /^([\w-]+(\.[^\s\.@]+)*@([\w-]+\.)+[\w-]{2,4})?$/;
        return reg.test(str);
    },
    float(str) {
        var reg = /^([-]){0,1}([0-9]){1,}([.]){0,1}([0-9]){0,}$/;
        return reg.test(str);
    },
    int(str) {
        var reg = /^-?\d+$/;
        return reg.test(str);
    },
    phone(str) {
        var reg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/im;
        var validAreaCodeList = [201, 202, 203, 205, 206, 207, 208, 209, 210, 212, 213, 214, 215, 216, 217, 218, 219, 220, 224, 225, 228, 229, 231, 234, 239, 240, 248, 251, 252, 253, 254, 256, 260, 262, 267, 269, 270, 272, 276, 281, 301, 302, 303, 304, 305, 307, 308, 309, 310, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 323, 325, 330, 331, 334, 336, 337, 339, 346, 347, 351, 352, 360, 361, 364, 380, 385, 386, 401, 402, 404, 405, 406, 407, 408, 409, 410, 412, 413, 414, 415, 417, 419, 423, 424, 425, 430, 432, 434, 435, 440, 442, 443, 456, 458, 469, 470, 475, 478, 479, 480, 484, 500, 501, 502, 503, 504, 505, 507, 508, 509, 510, 512, 513, 515, 516, 517, 518, 520, 530, 531, 533, 534, 539, 540, 541, 544, 551, 559, 561, 562, 563, 566, 567, 570, 571, 573, 574, 575, 580, 585, 586, 588, 601, 602, 603, 605, 606, 607, 608, 609, 610, 611, 612, 614, 615, 616, 617, 618, 619, 620, 623, 626, 628, 629, 630, 631, 636, 641, 646, 650, 651, 657, 660, 661, 662, 667, 669, 678, 681, 682, 700, 701, 702, 703, 704, 706, 707, 708, 710, 712, 713, 714, 715, 716, 717, 718, 719, 720, 724, 725, 727, 731, 732, 734, 737, 740, 743, 747, 754, 757, 760, 762, 763, 765, 769, 770, 772, 773, 774, 775, 779, 781, 785, 786, 800, 801, 802, 803, 804, 805, 806, 808, 809, 810, 812, 813, 814, 815, 816, 817, 818, 828, 830, 831, 832, 843, 844, 845, 847, 848, 850, 854, 855, 856, 857, 858, 859, 860, 862, 863, 864, 865, 866, 870, 872, 877, 878, 880, 881, 888, 900, 901, 903, 904, 906, 907, 908, 909, 910, 912, 913, 914, 915, 916, 917, 918, 919, 920, 925, 928, 929, 930, 931, 934, 936, 937, 938, 940, 941, 947, 949, 951, 952, 954, 956, 959, 970, 971, 972, 973, 978, 979, 980, 984, 985, 989];
        var userAreaCode = parseInt(str.slice(0, 3));
        var isValidAreacode = false;
        if (validAreaCodeList.indexOf(userAreaCode) > -1) {
            isValidAreacode = true;
        }
        return reg.test(str) && isValidAreacode;
    },
    zipcode(str) {
        var reg = /^\d{5}$/;
        return reg.test(str);
    },
    price(str) {
        var reg = /^(([$])?((([0-9]{1,3},)+([0-9]{3},)*[0-9]{3})|[0-9]+)(\.[0-9]+)?)$/;
        return reg.test(str);
    },
    date(str) {
        if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str)) {
            return false;
        }

        // Parse the date parts to integers
        var parts = str.split('/');
        var month = parseInt(parts[0], 10);
        var day = parseInt(parts[1], 10);
        var year = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if (year < 1000 || year > 3000 || month == 0 || month > 12)
            return false;

        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Adjust for leap years
        if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    },
    valide(validateType, value) {
        var type = validateType.split(',');
        for (let i = 0; i < type.length; i++) {
            var key = type[i];
            var validate = this[key];
            if (validate && !validate(value)) {
                return {
                    passed: false,
                    type: key
                };
            }
        }
        return {
            passed: true,
            type: validateType
        };
    }
};
export default validation;