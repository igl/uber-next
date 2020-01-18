const TARGET_SOURCE_DIR = {
    default: './src',
    nextjs: '.',
}

const PRESET_ENV_TARGETS = {
    default: '> 5%, not dead',
    node: { node: 'current' },
}

const COREJS = {
    default: 3,
    nextjs: 3,
}

const getOption = (o, k) => o[k] || o.default

exports.presetEnv = (options = {}, target) => {
    const defaultConfig = {
        useBuiltIns: 'usage',
        corejs: String(getOption(COREJS, target)),
        targets: getOption(PRESET_ENV_TARGETS, target),
        modules: 'commonjs',
    }

    const userConfig =
        options['@babel/preset-env'] || options['preset-env'] || options['presetEnv'] || {}

    return {
        ...defaultConfig,
        ...userConfig,
    }
}

exports.transformRuntime = (options = {}, target) => {
    const presetEnvConfig = exports.presetEnv(options, target)
    const defaultConfig = {
        corejs: Number(COREJS[target]),
        helpers: true,
        regenerator: true,
        useESModules: presetEnvConfig.modules !== 'commonjs',
    }

    const userConfig =
        options['@babel/plugin-transform-runtime'] ||
        options['transform-runtime'] ||
        options['transformRuntime'] ||
        {}

    return {
        ...defaultConfig,
        ...userConfig,
    }
}

exports.transformDefine = (options = {}, _target) => {
    const defaultConfig = {
        __DEV__: process.env.NODE_ENV !== 'production',
        __TEST__:
            Boolean(process.env.TEST) ||
            Boolean(process.env.JEST_WORKER_ID) ||
            process.env.NODE_ENV === 'test',
    }

    const userConfig =
        options['babel-plugin-transform-define'] ||
        options['babelPluginTransformDefine'] ||
        options['transform-define'] ||
        options['transformDefine'] ||
        {}

    return {
        ...defaultConfig,
        ...userConfig,
    }
}

exports.moduleResolver = (options = {}, target) => {
    const defaultConfig = {
        root: getOption(TARGET_SOURCE_DIR, target).split(';'),
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.es', '.es6', '.mjs', 'json', 'md', 'mdx'],
    }

    const userConfig =
        options['babel-plugin-module-resolver'] ||
        options['babelPluginModuleResolver'] ||
        options['module-resolver'] ||
        options['moduleResolver'] ||
        {}

    // interpret a string-only configuration as 'root' key value
    if (typeof userConfig === 'string' && userConfig /* no empty string */) {
        return {
            ...defaultConfig,
            root: userConfig.split(';'),
        }
    }

    if (typeof userConfig.root === 'string' && userConfig.root && userConfig.root.includes(';')) {
        return {
            ...defaultConfig,
            ...userConfig,
            root: userConfig.root.split(';'),
        }
    }

    return {
        ...defaultConfig,
        ...userConfig,
    }
}

exports.typescript = (options = {}, _target) => {
    const defaultConfig = {
        isTSX: true,
        allExtensions: true,
    }

    const userConfig =
        options['@babel/preset-typescript'] ||
        options['preset-typescript'] ||
        options['presetTypescript'] ||
        {}

    return {
        ...defaultConfig,
        ...userConfig,
    }
}

exports.styledComponents = (options = {}, _target) => {
    const defaultConfig = {
        ssr: true,
        displayName: true,
        minify: process.env.NODE_ENV === 'production',
    }

    const userConfig =
        options['babel-plugin-styled-components'] ||
        options['babelPluginStyledComponents'] ||
        options['styled-components'] ||
        options['styledComponents'] ||
        {}

    return {
        ...defaultConfig,
        ...userConfig,
    }
}

exports.semanticUIImports = (options = {}, target) => {
    const presetEnvConfig = exports.presetEnv(options, target)

    const defaultConfig = {
        convertMemberImports: true,
        importType: presetEnvConfig.modules === 'commonjs' ? 'commonjs' : 'es',
        addCssImports: target === 'nextjs',
        importMinifiedCssFiles: false,
        addLessImports: false,
        addDuplicateStyleImports: false,
    }

    const userConfig =
        options['babel-plugin-transform-semantic-ui-react-imports'] ||
        options['babelPluginTransformSemanticUIReactImports'] ||
        options['semantic-ui-react-imports'] ||
        options['semanticUIReactImports'] ||
        options['semantic-ui'] ||
        {}

    return {
        ...defaultConfig,
        ...userConfig,
    }
}
