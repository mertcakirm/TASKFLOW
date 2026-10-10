const express = require('express');
const cors = require('cors');
const app = express();
const corsOptions = require('./config/cors');

app.use(cors(corsOptions));          
app.use(express.json());  

app.use("/api/auth", require("./routes/AuthRoute"));
//app.use("/api/users", require("./routes/UserRoutes"));
// app.use("/api/projects", require("./routes/ProjectRoutes"));
// app.use("/api/tasks", require("./routes/TaskRoutes"));

module.exports = app;