const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

const config = {
  entry: {
    main: "./src/app.js",
  },
  output: {
    filename: "build.js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "img/[name][ext]",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: isProduction ? false : true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["autoprefixer"],
              },
              sourceMap: isProduction ? false : true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              sassOptions: {
                indentWidth: 2,
                outputStyle: "expanded",
              },
              sourceMap: isProduction ? false : true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Testons webpack!",
      template: path.resolve(__dirname, "src", "index.ejs"),
    }),
    new MiniCssExtractPlugin({
      filename: "css/style.css",
      chunkFilename: "[id].css",
    }),
  ],
  devServer: {
    static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
    host: "localhost",
    port: 9000,
    open: true,
  },
  watch: true,
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                "svgo",
                {
                  plugins: [
                    {
                      name: "preset-default",
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [
                                { xmlns: "http://www.w3.org/2000/svg" },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
    config.optimization = {
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin(),
    ],
    };
  } else {
    config.mode = "development";
    config.target = 'web';
    config.devtool = "inline-source-map";
    config.optimization = {
      minimize: false,
    };
  }
  return config;
};

// Excellente documentation ! https://www.armandphilippot.com/article/configurer-webpack