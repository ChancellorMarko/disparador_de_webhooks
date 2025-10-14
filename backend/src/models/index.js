const fs = require("fs")
const path = require("path")
const { sequelize } = require("../config/database")
const basename = path.basename(__filename)

const db = {}

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file.toLowerCase() !== basename.toLowerCase() && file.slice(-3) === ".js"
  })
  .forEach((file) => {
    try {
      const modelPath = path.join(__dirname, file)
      const modelDefiner = require(modelPath)

      // Check if the export is a function before calling it
      if (typeof modelDefiner !== "function") {
        console.warn(`⚠️  Skipping ${file}: not a valid model definer function`)
        return
      }

      const model = modelDefiner(sequelize)

      // Validate that the model has a name
      if (!model || !model.name) {
        console.warn(`⚠️  Skipping ${file}: model has no name`)
        return
      }

      db[model.name] = model
    } catch (error) {
      console.error(`❌ Error loading model from ${file}:`, error.message)
    }
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    try {
      db[modelName].associate(db)
    } catch (error) {
      console.error(`❌ Error setting up associations for ${modelName}:`, error.message)
    }
  }
})

db.sequelize = sequelize

module.exports = db
