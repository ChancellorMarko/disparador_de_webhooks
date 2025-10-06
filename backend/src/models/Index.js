const fs = require("fs")
const path = require("path")
const { sequelize } = require("../config/database")
const basename = path.basename(__filename)

const db = {}

// Carregar todos os models
fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js" && file.indexOf(".test.js") === -1
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize)
    db[model.name] = model
  })

// Configurar associações
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize

module.exports = db
