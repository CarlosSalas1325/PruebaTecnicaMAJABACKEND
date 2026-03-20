const { AppDataSource } = require("../dist/config/data-source");
const app = require("../dist/app").default;

let initialized = false;

module.exports = async (req, res) => {
  if (!initialized && !AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    initialized = true;
  }
  return app(req, res);
};
