import { Sequelize, DataTypes } from "sequelize";
import db_config from "../../config/database.js";
import admin_user from "./users/index.js";
import omen_nav from "./omen_nav.js";

const sequelize = new Sequelize(
  db_config.DB,
  db_config.USER,
  db_config.PASSWORD,
  {
    host: db_config.HOST,
    logging: db_config.LOGGING,
    dialect: "mysql",
    pool: {
      max: 10000,
      min: 0,
      acquire: 60000,
      idle: 1000,
    },

    define: {
      underscored: true,
      freezeTableName: true,
      timestamps: true,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(`DB connected to [${db_config.HOST}]`);
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db_connection = {};

db_connection.Sequelize = Sequelize;
db_connection.sequelize = sequelize;

/* User Models */
db_connection.admin_user_model = admin_user(sequelize, DataTypes);
db_connection.omen_nav_model = omen_nav(sequelize, DataTypes);

db_connection.sequelize.sync({ alter: true }).then(() => {
  console.log("re-sync done!");
});

export default db_connection;
