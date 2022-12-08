require("dotenv").config()
const express = require("express");
const cors = require("cors");
const router = require("./routes/index")
const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(router)


app.listen(PORT, () => {
    console.info(`Running at port http://localhost:${PORT}`);
})