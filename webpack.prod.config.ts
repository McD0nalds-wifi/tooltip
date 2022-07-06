import path from 'path'
import { Configuration as WebpackConfiguration } from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration
}

const filename = (ext: string) => `${ext === 'css' ? 'css' : 'js'}/[name].[fullhash].${ext}`

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
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'public/favicon.ico'),
                    to: path.resolve(__dirname, 'build'),
                },
                {
                    from: path.resolve(__dirname, 'public/robots.txt'),
                    to: path.resolve(__dirname, 'build'),
                },
            ],
        }),
        new MiniCssExtractPlugin(),
        new ESLintPlugin({ extensions: ['js', 'jsx', 'ts', 'tsx'] }),
        new BundleAnalyzerPlugin(),
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
    mode: 'production',
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
        clean: true,
    },
    entry: './index.tsx',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: plugins(),
    devtool: false,
    devServer: {
        static: path.join(__dirname, 'build'),
        historyApiFallback: true,
        port: 7001,
        open: true,
    },
    target: 'browserslist',
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
                    },
                },
            },
        ],
    },
}

export default config
