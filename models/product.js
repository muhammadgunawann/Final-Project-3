'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Category);
      this.hasMany(models.TransactionHistory);
    }
  }
  Product.init({
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "column title cannot be empty"
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "Column price cannot be empty"
        },
        isInt: {
          args: true,
          msg: "Price must be integer or number"
        },
        max: {
          args: [50000000],
          msg: "price can not be more than 50000000"
        },
        min: {
          args: [0],
          msg: "price can not be less than 0"
        }

      }
    },
    stock: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "Column stock cannot be empty"
        },
        isInt: {
          args: true,
          msg: "Stock must be integer or number"
        },
        min: {
          args: [5],
          msg: "price can not be less than 5"
        }

      }
    },
    CategoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};