module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    config.node = {
      child_process: "empty",
      fs: "empty",
      net: "empty",
      tls: "empty",
    };
    // config.module.rules.push({
    //   node: {
    //     child_process: "empty",
    //     fs: "empty", // if unable to resolve "fs"
    //   },
    // });

    // Important: return the modified config
    return config;
  },
};
