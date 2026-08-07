import "dotenv/config";
import app from "./src/app.js";
import db from "./src/db/dbconn.js";

const port = Number(process.env.PORT || process.env.port) || 3000;

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Music App Backend Running",
  });
});

async function startServer() {
  try {
    await db();

    app.listen(port, () => {
      console.log("NEW app.js loaded successfully");
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server could not start:", error.message);
    process.exit(1);
  }
}

startServer();