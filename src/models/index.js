'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

console.log('Loading models from:', __dirname);

fs
  .readdirSync(__dirname)
  .filter(file => {
    console.log('Checking file:', file);
    const isValid = (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
    console.log('File valid:', isValid);
    return isValid;
  })
  .forEach(file => {
    console.log('Loading model from file:', file);
    try {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      console.log('Model loaded:', model.name);
      db[model.name] = model;
    } catch (error) {
      console.error('Error loading model from', file, ':', error);
    }
  });

console.log('Loaded models:', Object.keys(db));

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
