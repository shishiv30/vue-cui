module.exports = {
    root: true,
    "env": {
        "browser": true,
        "es6": true,
        "jquery": true,
        "node": true,
    },
    "globals": {
        "browser": true,
        "console": true,
        "importScripts":true,
    },
    "extends": [
        'standard',
        'plugin:vue/recommended'
    ],
    "rules": {
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
