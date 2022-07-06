module.exports = {
    parser: '@typescript-eslint/parser',
    // Specifies the ESLint parser
    extends: ['plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
    parserOptions: {
        ecmaVersion: 2018,
        // Allows for the parsing of modern ECMAScript features
        sourceType: 'module',
        // Allows for the use of imports
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    rules: {
        'no-console': 'warn',
        'no-alert': 'error',
        quotes: ['warn', 'single'],
        // indent: ['warn', 4],
        'max-len': [
            'warn',
            {
                code: 120,
            },
        ],
        'comma-dangle': ['error', 'always-multiline'],
        // semi: ['warn', 'always'],
        '@typescript-eslint/no-var-requires': 0,
    },
    settings: {
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
}
