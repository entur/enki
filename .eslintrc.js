module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "jest/globals": true
    },
    "extends": ["eslint:recommended", "plugin:react/recommended"],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "jest",
        "react"
    ],
    "settings": {
        react: {
            version: "detect"
        }
    },
    "rules": {
        'react/prop-types': 'off',
        'react/display-name': 'off',
    }
};
