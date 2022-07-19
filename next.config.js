require("dotenv").config();
const { i18n } = require("./next-i18next.config");

const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
  i18n,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/i,
      loader: "html-loader",
    });
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};
