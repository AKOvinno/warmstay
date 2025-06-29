const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup");
};
module.exports.signup = async (req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        // automatically login after signup
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to WarmStay!");
            res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error", error.message);
        return res.redirect("/signup");ss
    }
};
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};
module.exports.login = async(req, res) => {
    let {username} = req.body;
    req.flash("success", `Welcome back to WarmStay, ${username}! You are logged in!`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};
module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "logged you out!");
        res.redirect("/listings");
    })
};