const { connectDataBase } = require("./config/database");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const teacherRoutes = require('./routes/teacherRoutes')

const app = express();

app.use(express.json());

app.use(cors({ credentials: true, origin: true }));

dotenv.config();
connectDataBase();

app.use("/api/v1/teacher", teacherRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is Started on ${process.env.PORT} port`);
});
