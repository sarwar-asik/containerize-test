import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
import { errorlogger, logger } from "./app/src/shared/logger";
import "colors";
let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    logger.info("Connected to database");


    server = app.listen(process.env.PORT, () => {
      console.log('\x1b[1m\x1b[34m%s\x1b[0m', `🚀 Server running on port ${process.env.PORT}`.green.bold);
      logger.info(`🚀 Server running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
    errorlogger.error(err);
  }
}

main();

process.on("unhandledRejection", (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  errorlogger.error(err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  errorlogger.error("uncaughtException is detected");
  process.exit(1);
});
