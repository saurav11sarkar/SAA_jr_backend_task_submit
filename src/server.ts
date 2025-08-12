import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";

const port = config.port;

const main = async () => {
  try {
    await mongoose.connect(config.db_url as string);
    console.log("database is connect");
    app.listen(port, () => {
      console.log(`server is running on port http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

main();
