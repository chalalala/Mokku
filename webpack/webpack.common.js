const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const srcDir = "../src/";

module.exports = {
  entry: {
    options: path.join(__dirname, srcDir + "options.ts"),
    background: path.join(__dirname, srcDir + "background.ts"),
    content_script: path.join(__dirname, srcDir + "content_script.ts"),
    devtool: path.join(__dirname, srcDir + "devtool.ts"),
    panel: path.join(__dirname, srcDir + "panel/index.tsx"),
    inject: path.join(__dirname, srcDir + "inject.ts"),
  },
  output: {
    path: path.join(__dirname, "../dist/js"),
    filename: "[name].js",
  },
  // optimization: {
  //   splitChunks: {
  //     name: "vendor",
  //     chunks: "initial",
  //   },
  // },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif|ttf)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    // exclude locale files in moment
    new webpack.IgnorePlugin({ resourceRegExp: /moment\/locale\// }),
    new CopyPlugin([{ from: ".", to: "../" }], { context: "public" }),
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/microsoft/monaco-editor/blob/main/webpack-plugin/README.md#options
      languages: ["json"],
      features: [
        // "anchorSelect",
        "bracketMatching",
        // "browser",
        // "caretOperations",
        // "clipboard",
        "codeAction",
        // "codeEditor",
        // "codelens",
        // "colorPicker",
        // "comment",
        // "contextmenu",
        // "cursorUndo",
        // "diffEditor",
        // "diffEditorBreadcrumbs",
        // "dnd",
        // "documentSymbols",
        // "dropOrPasteInto",
        "find",
        // "folding",
        // "fontZoom",
        // "format",
        // "gotoError",
        // "gotoLine",
        // "gotoSymbol",
        // "hover",
        // "iPadShowKeyboard",
        // "inPlaceReplace",
        // "indentation",
        // "inlayHints",
        // "inlineCompletions",
        // "inlineEdit",
        // "inlineEdits",
        // "inlineProgress",
        // "inspectTokens",
        // "lineSelection",
        // "linesOperations",
        // "linkedEditing",
        // "links",
        // "longLinesHelper",
        "multicursor",
        // "parameterHints",
        // "placeholderText",
        // "quickCommand",
        // "quickHelp",
        // "quickOutline",
        // "readOnlyMessage",
        // "referenceSearch",
        // "rename",
        // "sectionHeaders",
        // "semanticTokens",
        // "smartSelect",
        // "snippet",
        "stickyScroll",
        // "suggest",
        // "toggleHighContrast",
        // "toggleTabFocusMode",
        // "tokenization",
        // "unicodeHighlighter",
        // "unusualLineTerminators",
        // "wordHighlighter",
        // "wordOperations",
        // "wordPartOperations",
      ],
    }),
  ],
};
