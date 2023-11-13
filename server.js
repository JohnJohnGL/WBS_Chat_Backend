const express = require("express");
const cors = require("cors");
const connectDB = require("./dbinit");
const userRoutes = require("./routes/user");
require("dotenv").config();
require("colors");
const PORT = process.env.PORT || 8002;

const app = express();
connectDB();

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
app.use("/auth", userRoutes);

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`.rainbow);
});
