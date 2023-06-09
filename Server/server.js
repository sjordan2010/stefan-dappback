import express, { json, urlencoded } from "express";
import cors from "cors";
import userController from "./userController.js";

const app = express();
const PORT = 3000;

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  console.log("tested 3000");
  return res.send(JSON.stringify("This is a test!"));
});

app.post("/login", userController.findUser, (req, res) => {
  if (res.locals.user) {
    return res.status(200).json(res.locals.user);
  } else {
    return res.status(200).json("no user");
  }
});

app.post("/register", userController.createUser, (req, res) => {
  console.log("res newUSer in server-27", res.locals.newUser);
  if (res.locals.newUser) {
    return res.status(200).json(res.locals.newUser);
  } else {
    return res.status(200).json("unable to create user");
  }
});

app.put("/streak", userController.setStreak, (req, res) => {
  res.status(200).json({ newStreak: res.locals.newStreak, lastClicked: res.locals.lastClicked });
});

// error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log("ERROR OBJ", errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// start the server
app.listen(PORT, (req, res) => {
  console.log("Listening on PORT " + PORT);
});
