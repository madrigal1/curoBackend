import mongoose from "mongoose";
import Logger from "../core/Logger";
import { db, environment } from "../config";
import { RoleModel, RoleCode } from "./model/Role";

// Build the connection string
const dbURI: string = environment === "development" ? db.devUrl : db.prodUrl;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: true,
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

// Create the database connection
mongoose
  .connect(dbURI, options)
  .then(() => {
    Logger.info("Mongoose connection done");
  })
  .catch((e) => {
    Logger.info("Mongoose connection error");
    Logger.error(e);
  });

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on("connected", () => {
  Logger.info("Mongoose default connection open to " + dbURI);
  mongoose.connection.collection("roles").countDocuments(async (err, count) => {
    if (count == 0) {
      const roles = Object.values(RoleCode).map((role) => {
        return {
          role,
        };
      });
      RoleModel.insertMany(roles).catch((err) => Logger.info(err));
      Logger.info("Roles db init successful");
    }
  });
});

// If the connection throws an error
mongoose.connection.on("error", (err) => {
  Logger.error("Mongoose default connection error: " + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
  Logger.info("Mongoose default connection disconnected");
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    Logger.info(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});
