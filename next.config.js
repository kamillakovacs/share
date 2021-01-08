require("dotenv").config();

const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
  webpack: (config) => {
    config.plugins = config.plugins || [];
    config.plugins = [
      ...config.plugins,
      new Dotenv({
        path: path.join(__dirname, ".env"),
        systemvars: true,
      }),
    ];
    config.node = {
      child_process: "empty",
      dns: "empty",
      fs: "empty",
      net: "empty",
      tls: "empty",
    };
    return config;
  },
};
