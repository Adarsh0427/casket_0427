import express from "express";
import { userRouter } from "./router/user";
import { zapRouter } from "./router/zap";
import cors from "cors";
import  session from "express-session";

const port = process.env.PORT || 4001;

const app = express();  
app.use(session({secret : "your-secret-key", "saveUninitialized" : false, "resave" : false}));
app.use(express.json());
app.use(cors());


app.use("/api/v1/user", userRouter);


app.use("/api/v1/zap", zapRouter);

app.listen(port, () => {
    console.log("Server started at http://localhost:" + port + "/api/v1/user \n Server started at http://localhost:" + port + "/api/v1/zap");

})
