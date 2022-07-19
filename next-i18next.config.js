const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "en-US",
    locales: ["en-US", "hu-HU"],
    localePath: path.resolve("./public/locales"),
  },
};
