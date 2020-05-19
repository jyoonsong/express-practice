// requires
const express = require("express")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash")
require("dotenv").config();

// app setup
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.set("port", process.env.PORT || 8001);

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false
    }
}))
app.use(flash());

// router setup
const pageRouter = require("./routes/page");
app.use("/", pageRouter)

// 404 middleware
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err); // 흐름이 끊기지 않도록 next를 반드시 해줘야 함.
})

// error handler
app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
})

app.listen(app.get("port"), () => {
    console.log(app.get("port"), "port waiting...")
})