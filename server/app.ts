import error from "http-errors";
import express from "express";
import path from "path";
import logger from "morgan";
import passport from "passport";
import * as userService from "./services/userService";
import sqlite from "connect-sqlite3";
import session, { Store } from "express-session";

import leagueRouter from "./routes/leagues";
import sportRouter from "./routes/sports";
import userRouter from "./routes/users";
import { createSportEvents } from "./db/utils/createSportEvents";

const app = express();
//createSportEvents();
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

let sqliteStore = sqlite(session);

app.use(session({
  secret: "secret",
  cookie: {
    "maxAge": 300000
  },
  resave: false,
  saveUninitialized: false,
  store: (new sqliteStore({ db: "sessions.db", dir: "./session" })) as Store
}));

userService.setUpLocalAuthStrategy();
userService.setupLoginSessionStorage();

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../client/build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '../client/build/index.html'));
// });

app.use('/leagues', leagueRouter);
app.use('/sports', sportRouter);
app.use('/users', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(error(404));
});

// error handler
app.use(function (err: any, req: express.Request, res: express.Response, _next: express.NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(process.env.PORT || 3000);

// module.exports = app;
