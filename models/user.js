'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helper/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.TransactionHistory)
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Column full_name cannot be empty"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: "email already registered"
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "Column email cannot be empty"
        },
        isEmail: {
          args: true,
          msg: "Format of email address is incorrect"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Column password cannot be empty"
        },
        len: {
          args: [6, 10],
          msg: "please enter password 6 or 10"
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Column gender cannot be empty"
        },
        isIn: {
          args: [["male", "female"]],
          msg: "Enter male or female"
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "Column role cannot be empty"
        }
      }
    },
    balance: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "Column balance cannot be empty"
        },
        isInt: {
          args: true,
          msg: "please enter numbers"
        },
        max: 100000000,
        min: 0
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user, opt) => {
        const hashedPassword = hashPassword(user.password)

        user.password = hashedPassword
      },
    }
  });
  return User;
};