#!/usr/bin/env node
'use strict';
/*
 * Builds the browser bundle into ./public:
 *   vendor.js  – AngularJS + libraries + clmtrackr, concatenated in load order
 *   main.js    – app code (browser/js) + every template preloaded into $templateCache
 *   style.css  – vendor CSS + compiled SCSS
 *
 * Flags: --dev (no minification, inline sourcemaps), --watch (rebuild on change)
 *
 * App code is minified WITHOUT renaming identifiers: the AngularJS code relies
 * on implicit dependency injection (parameter names), so mangling would break it.
 */
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const sass = require('sass');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'public');
const BROWSER = path.join(ROOT, 'browser');
const JS_DIR = path.join(BROWSER, 'js');
const dev = process.argv.includes('--dev');
const watch = process.argv.includes('--watch');

const nm = (p) => path.join(ROOT, 'node_modules', p);

const VENDOR_JS = [
    nm('angular/angular.min.js'),
    nm('angular-animate/angular-animate.min.js'),
    nm('angular-aria/angular-aria.min.js'),
    nm('angular-material/angular-material.min.js'),
    nm('angular-ui-router/release/angular-ui-router.min.js'),
    nm('angular-svg-round-progressbar/build/roundProgress.min.js'),
    path.join(BROWSER, 'vendor/clmtrackr.min.js'),
    path.join(BROWSER, 'vendor/model_pca_20_svm.js'),
];

const VENDOR_CSS = [
    nm('bootstrap/dist/css/bootstrap.min.css'),
    nm('angular-material/angular-material.min.css'),
];

function walk(dir, ext) {
    return fs.readdirSync(dir, { withFileTypes: true })
        .sort((a, b) => a.name.localeCompare(b.name))
        .flatMap((d) => {
            const full = path.join(dir, d.name);
            if (d.isDirectory()) return walk(full, ext);
            return full.endsWith(ext) ? [full] : [];
        });
}

function size(file) {
    return (fs.statSync(file).size / 1024).toFixed(0) + ' KB';
}

function buildVendor() {
    const js = VENDOR_JS.map((f) => {
        let src = fs.readFileSync(f, 'utf8').replace(/\/\/# sourceMappingURL=.*$/gm, '');
        if (f.endsWith('clmtrackr.min.js')) {
            // clmtrackr calls getImageData on its working canvases every frame; telling
            // the browser up front keeps those canvases in CPU memory and avoids a GPU
            // readback stall per frame.
            src = src.split('getContext("2d")').join('getContext("2d",{willReadFrequently:!0})');
        }
        return src;
    }).join(';\n');
    fs.writeFileSync(path.join(OUT, 'vendor.js'), js);
}

// Every template is registered under both 'js/x.html' and '/js/x.html' because
// the app references them both ways; this removes ~40 HTTP requests at runtime.
function templatesModule() {
    const entries = walk(JS_DIR, '.html').map((file) => {
        const rel = 'js/' + path.relative(JS_DIR, file).split(path.sep).join('/');
        const html = JSON.stringify(fs.readFileSync(file, 'utf8'));
        return `t.put(${JSON.stringify(rel)},${html});t.put(${JSON.stringify('/' + rel)},${html});`;
    });
    return `angular.module('core').run(['$templateCache',function(t){${entries.join('')}}]);\n`;
}

async function buildApp() {
    // lib/ first (plain helpers), then app.js (declares the modules), then the rest.
    const libs = walk(path.join(JS_DIR, 'lib'), '.js');
    const appJs = path.join(JS_DIR, 'app.js');
    const rest = walk(JS_DIR, '.js').filter((f) => f !== appJs && !libs.includes(f));
    const source = [...libs, appJs, ...rest]
        .map((f) => `// ${path.relative(ROOT, f)}\n${fs.readFileSync(f, 'utf8')}`)
        .join('\n;\n') + '\n' + templatesModule();

    const result = await esbuild.transform(source, {
        loader: 'js',
        target: 'es2020',
        sourcemap: dev ? 'inline' : false,
        sourcefile: 'main.js',
        minifyWhitespace: !dev,
        minifySyntax: !dev,
        minifyIdentifiers: false,
        legalComments: 'none',
    });
    fs.writeFileSync(path.join(OUT, 'main.js'), result.code);
}

function buildCss() {
    const compiled = sass.compile(path.join(BROWSER, 'scss/main.scss'), {
        style: dev ? 'expanded' : 'compressed',
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'slash-div'],
    }).css;
    const vendor = VENDOR_CSS.map((f) => fs.readFileSync(f, 'utf8').replace(/\/\*# sourceMappingURL=.*?\*\//g, ''));
    fs.writeFileSync(path.join(OUT, 'style.css'), [...vendor, compiled].join('\n'));
}

// index.html references each bundle with a content hash so the server can cache them forever.
function buildIndex() {
    const hash = (f) => require('crypto').createHash('sha1').update(fs.readFileSync(path.join(OUT, f))).digest('hex').slice(0, 10);
    const html = fs.readFileSync(path.join(ROOT, 'server/views/index.html'), 'utf8')
        .replace('__VENDOR__', hash('vendor.js'))
        .replace('__MAIN__', hash('main.js'))
        .replace('__STYLE__', hash('style.css'));
    fs.writeFileSync(path.join(OUT, 'index.html'), html);
}

async function build() {
    const t = Date.now();
    fs.mkdirSync(OUT, { recursive: true });
    buildVendor();
    await buildApp();
    buildCss();
    buildIndex();
    const files = ['vendor.js', 'main.js', 'style.css'].map((f) => `${f} ${size(path.join(OUT, f))}`).join(', ');
    console.log(`[build] ${dev ? 'dev' : 'prod'} ${Date.now() - t}ms → ${files}`);
}

build().catch((err) => {
    console.error(err);
    if (!watch) process.exit(1);
});

if (watch) {
    let timer;
    fs.watch(BROWSER, { recursive: true }, () => {
        clearTimeout(timer);
        timer = setTimeout(() => build().catch((err) => console.error(err.message)), 100);
    });
}
