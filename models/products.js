"use strict";
const { Model } = require("sequelize");
const PROTECTED_ATTRIBUTES = ["deleted"];
var USD,CAD,EUR,GBP = 0;

module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }


    toJSON() {     
      // hide protected fields
      let attributes = Object.assign({}, this.get());
      
      for (let a of PROTECTED_ATTRIBUTES) {
        delete attributes[a];
      }
      return attributes;
    }
  }
  Products.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.STRING,
      description: DataTypes.STRING,
      view_count: DataTypes.INTEGER,
      deleted: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Products",
    }
  );
  return Products;
};
