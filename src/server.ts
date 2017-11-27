import * as express         from "express";
import * as bodyParser      from "body-parser";
import * as config          from "config";
import * as mongoose        from "mongoose";
import routers              from "./routers";


/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(config.database.connection);

mongoose.connection.on("error", () => {
  console.log("MongoDB connection error. Please make sure MongoDB is running.");
  process.exit();
});
mongoose.connection.on("connected", () => {
  console.log(`MongoDB connected to ${config.database.connection}`);
});

/**
 * Express configuration.
 */
app.set("port", process.env.PORT || config.server.port || 4000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
 next();
});

app.use("/", routers);

/**
 * Start Express server.
 */
app.listen(app.get("port"), () => {
  console.log(("App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
});

module.exports = app;
