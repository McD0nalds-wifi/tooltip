const plugins = [
    [
        '@babel/plugin-transform-runtime',
        {
            regenerator: true,
        },
    ],
]

if (process.env.NODE_ENV !== 'production') {
    plugins.push('react-refresh/babel')
}

module.exports = {
    presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }], '@babel/preset-typescript'],
    plugins: plugins,
}