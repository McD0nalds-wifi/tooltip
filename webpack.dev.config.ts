import path from 'path'
import { Configuration as WebpackConfiguration, HotModuleReplacementPlugin } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration
}

const plugins = () => {
    const base = [
        new HTMLWebpackPlugin({
            template: '../public/index.html',
            minify: {
                collapseWhitespace: false,
            },
            favicon: '../public/favicon.ico',
        }),
        new ForkTsCheckerWebpackPlugin({
            async: false,
            typescript: {
                configFile: '../tsconfig.json',
            },
        }),
        new HotModuleReplacementPlugin(),
        // new CleanWebpackPlugin({
        //     cleanOnceBeforeBuildPatterns: [path.join(__dirname, 'src/**/*')],
        // }),
        new MiniCssExtractPlugin(),
        new ESLintPlugin({ extensions: ['js', 'jsx', 'ts', 'tsx'] }),
        new ReactRefreshWebpackPlugin(),
    ]

    return base
}

const cssLoaders = (isScss: boolean, isModule: boolean) => {
    const loaders: any = [
        {
            loader: MiniCssExtractPlugin.loader,
        },
        isModule
            ? {
                  loader: 'css-loader',
                  options: {
                      modules: {
                          mode: 'local',
                          localIdentName: '[name]__[local]--[hash:base64:5]',
                      },
                  },
              }
            : 'css-loader',
    ]

    if (isScss) {
        loaders.push({
            loader: 'sass-loader',
            options: {
                implementation: require('sass'),
            },
        })
    }

    return loaders
}

const config: Configuration = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    output: {
        publicPath: '/',
        clean: true,
    },
    entry: './index.tsx',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: plugins(),
    devtool: 'source-map',
    target: 'web',
    devServer: {
        historyApiFallback: true,
        port: 7001,
        open: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                exclude: /\.module\.css$/i,
                use: cssLoaders(false, false),
            },
            {
                test: /\.s[ac]ss$/i,
                use: cssLoaders(true, true),
            },
            {
                test: /\.(png|jpg|svg|gif|mp4)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'img',
                    },
                },
            },
            {
                test: /\.(ts|js)x?$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                        cacheDirectory: true,
                    },
                },
            },
        ],
    },
}

export default config
