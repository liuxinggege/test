const path = require('path');
const pxtorem = require('postcss-pxtorem');
const autoprefixer = require('autoprefixer');
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

const postcss = {
    loader: require.resolve('postcss-loader'),
    options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebookincubator/create-react-app/issues/2677
        ident: 'postcss',
        sourceMap: true,
        plugins: () => [
            require('postcss-flexbugs-fixes'),
            autoprefixer({
                browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9' // React doesn't support IE8 anyway
                ],
                flexbox: 'no-2009'
            }),
            // disablt if react native
            pxtorem({
                rootValue: 20,
                unitPrecision: 10,
                propList: ['*'],
                selectorBlackList: [/^\.nop2r/],
                replace: true,
                mediaQuery: false,
                minPixelValue: 0
            })
        ]
    }
};

exports.postcss = postcss;

exports.less = [
    postcss,
    {
        loader: 'less-loader',
        options: {
            modifyVars: {
                'primary-color': '#1DA57A',                         // 全局主色
                'link-color': '#1DA57A',                            // 链接色
                'success-color': '#52c41a',                         // 成功色
                'warning-color': '#faad14',                         // 警告色
                'error-color': '#f5222d',                           // 错误色
                'font-size-base': '14px',                           // 主字号
                'heading-color': 'rgba(0, 0, 0, .85)',              // 标题色
                'text-color': 'rgba(0, 0, 0, .65)',                 // 主文本色
                'text-color-secondary ': 'rgba(0, 0, 0, .45)',      // 次文本色
                'disabled-color ': 'rgba(0, 0, 0, .25)',            // 失效色
                'border-radius-base': '4px',                        // 组件/浮层圆角
                'border-color-base': '#d9d9d9',                     // 边框色
                'box-shadow-base': '0 2px 8px rgba(0, 0, 0, .15)'   // 浮层阴影
            },
            javascriptEnabled: true,
        },
    }
];
const styleResources = {
    loader: 'style-resources-loader',
    options: {
        patterns: path.resolve(__dirname, '../src/styles/base.less'),
        injector: 'append'
    }
};
exports.styleResources = styleResources;

const css = {
    loader: require.resolve('css-loader'),
    options: {
        importLoaders: 1,
        minimize: true,
        sourceMap: shouldUseSourceMap
    }
};

exports.css = css;

const moduleCss = {
    loader: require.resolve('css-loader'),
    options: {
        importLoaders: 1,
        minimize: true,
        modules: true,
        localIdentName: '[folder]-[name]-[local]-[hash:base64:5]',
        sourceMap: shouldUseSourceMap
    }
};

exports.moduleCss = moduleCss;

/**
 * 生成 css extract loader
 * @param {*} tartget
 * @param {*} param1
 */
exports.extract = ({ ExtractTextPlugin, extractTextPluginOptions }) => {
    return (target, modules) => {
        return ExtractTextPlugin.extract(
            Object.assign(
                {
                    fallback: {
                        loader: require.resolve('style-loader'),
                        options: {
                            hmr: false,
                        }
                    },
                    use: [modules ? moduleCss : css].concat(target)
                },
                extractTextPluginOptions
            )
        );
    };
};

exports.auotImport = [
    { import: 'React', from: 'react' },
    {
        import: '{ IndexLink, Link }',
        from: 'react-router',
        search: 'IndexLink|Link'
    },
    {
        import: '{ push as navigateTo }',
        from: 'react-router-redux',
        search: 'navigateTo'
    }
];

exports.babel = {
    // This is a feature of `babel-loader` for webpack (not Babel itself).
    // It enables caching results in ./node_modules/.cache/babel-loader/
    // directory for faster rebuilds.
    cacheDirectory: true,
    plugins: [
        'syntax-dynamic-import',
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-object-rest-spread',
        ['import', {
            'libraryName': 'antd',
            'libraryDirectory': 'es',
            'style': true // `style: true` 会加载 less 文件
        }]
    ],
    presets: ['env']
};

exports.uglify = {
    parallel: true,
    cache: false,
    sourceMap: true,
    extractComments: {
        filename: 'LICENSES'
    },
    uglifyOptions: {
        safari10: true,
        ecma: 6,
        output: {
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebookincubator/create-react-app/issues/2488
            ascii_only: true,
            beautify: false
        },
        compress: {
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebookincubator/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false
        },
        mangle: { keep_fnames: true },
        keep_fnames: true,
        keep_classnames: true
    }
};

exports.alias = {
};
