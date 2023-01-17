"use strict";
exports.__esModule = true;
var http_errors_1 = require("http-errors");
var express_1 = require("express");
var path_1 = require("path");
var morgan_1 = require("morgan");
var passport_1 = require("passport");
var userService = require("./services/userService");
var connect_sqlite3_1 = require("connect-sqlite3");
var express_session_1 = require("express-session");
var leagues_1 = require("./routes/leagues");
var sports_1 = require("./routes/sports");
var users_1 = require("./routes/users");
var app = (0, express_1["default"])();
//createSportEvents();
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
var sqliteStore = (0, connect_sqlite3_1["default"])(express_session_1["default"]);
app.use((0, express_session_1["default"])({
    secret: "secret",
    cookie: {
        "maxAge": 300000
    },
    resave: false,
    saveUninitialized: false,
    store: (new sqliteStore({ db: "sessions.db", dir: "./session" }))
}));
userService.setUpLocalAuthStrategy();
userService.setupLoginSessionStorage();
app.use(passport_1["default"].initialize());
app.use(passport_1["default"].session());
app.use((0, morgan_1["default"])('dev'));
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express_1["default"].static(path_1["default"].join(__dirname, 'public')));
app.use(express_1["default"].static(path_1["default"].join(__dirname, '../client/build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '../client/build/index.html'));
// });
app.use('/leagues', leagues_1["default"]);
app.use('/sports', sports_1["default"]);
app.use('/users', users_1["default"]);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1["default"])(404));
});
// error handler
app.use(function (err, req, res, _next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.send(err.message);
});
app.listen(process.env.PORT || 3000);
// module.exports = app;
