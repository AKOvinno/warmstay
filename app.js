if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');

const listingRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

//const MONGO_URL = "mongodb://127.0.0.1:27017/warmstay";
const dbURL = process.env.ATLASDB_URL;

// calling the main function to connect to MongoDB
main().then(() => {
    console.log("connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    })
// writing async function to connect to MongoDB
async function main() {
    await mongoose.connect(dbURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});
store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});
const sessionOptions = {
    store, // Now we have passed it here
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24* 60 * 60 * 1000, // we have to pass millisecond amount
        maxAge: 7 * 24* 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// basic home route
app.get("/", (req, res) => {
    res.redirect("/listings");
});
// Middleware for flash message
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})
// listing routes, reviews routes, User routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
// This will catch all unmatched routes, regardless of method or path, and is the most robust and future-proof way in Express.
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});
// If you throw or pass an error like this: next(new ExpressError(404, "Page Not Found!")); This middleware will catch it and respond with - Status: 404, Body: "Page Not Found!"
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("errors/error", {message});
});
app.listen(3000, () => {
    console.log('http://localhost:3000/');
})