"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
// import fiber                from 'fibers';
const gulp_1 = require("gulp");
const gulp_util_1 = __importDefault(require("gulp-util"));
const gulp_if_1 = __importDefault(require("gulp-if"));
const gulp_sass_1 = __importDefault(require("gulp-sass"));
const sassCompiler = __importStar(require("sass-embedded"));
const gulp_postcss_1 = __importDefault(require("gulp-postcss"));
const cssnano_1 = __importDefault(require("cssnano"));
const postcss_merge_rules_plus_1 = __importDefault(require("postcss-merge-rules-plus"));
const sassProcessor = (0, gulp_sass_1.default)(sassCompiler);
function compile(options) {
    // if (!options.fiber) options.fiber = fiber;
    if (!options.importer)
        options.importer = (url, prev) => {
            return ((url[0] === '~') ? {
                file: path_1.default.join(process.cwd(), "node_modules", url.replace('~', ''))
            } : null);
        };
    let postcssPlugins = [
        // re-compress using postcss+cssnano if --outputStyle compressed
        (options.outputStyle === 'compressed') ? (0, cssnano_1.default)() : null,
        // merges selectors having the same properties
        options.mergeSelectors ? (0, postcss_merge_rules_plus_1.default)() : null,
    ].filter(p => p !== null);
    let processSass = () => (0, gulp_1.src)(options.file)
        .pipe(sassProcessor(options)
        .on('error', sassProcessor.logError))
        // re-compile using postcss if postcss have any plugins
        .pipe((0, gulp_if_1.default)(postcssPlugins.length > 0, (0, gulp_postcss_1.default)(postcssPlugins)))
        .on('error', gulp_util_1.default.log)
        .pipe((0, gulp_1.dest)(options.outFile));
    // compile the sass now:
    processSass();
    // compile the sass in the future: (if --watch option set)
    if (options.watch)
        (0, gulp_1.watch)(options.file, processSass);
}
exports.default = compile;
