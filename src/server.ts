import "module-alias/register";
import "dotenv/config";
import app from "./app";
init();

async function init() {
  try {
    app.listen(process.env.PORT || 3001, () => {
      console.log(`Express App Listening on ${process.env.PORT || 3001}`);
    });
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}
