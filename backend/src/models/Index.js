const fs = require("fs");
const path = require("path");
const { sequelize } = require("../config/database"); // Verifique se este caminho está correto
const basename = path.basename(__filename);

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    // CORREÇÃO: Comparamos em minúsculas para evitar problemas
    // e garantimos que o nome do arquivo seja diferente de 'index.js'
    return (
      file.indexOf(".") !== 0 &&
      file.toLowerCase() !== basename.toLowerCase() &&
      file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const modelDefiner = require(path.join(__dirname, file));
    const model = modelDefiner(sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

module.exports = db;