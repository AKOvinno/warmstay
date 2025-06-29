const Listing = require("./models/listing");
const Review = require("./models/review.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require('./utils/ExpressError');
const axios = require('axios');

// Schema validation into middleware for hotel form
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}
// Schema validation into middleware for review form
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => { 
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in for this operation!");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.geocodeListing = async function (req, res, next) {
  const apiKey = process.env.MAP_TOKEN;
  const { location, country } = req.body.listing;
  const address = `${location}, ${country}`;

  try {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data;
    let coords = [0, 0];
    if (data.features && data.features.length > 0) {
      // Ensure both longitude and latitude are numbers
      coords = [
        Number(data.features[0].geometry.coordinates[0]),
        Number(data.features[0].geometry.coordinates[1])
      ];
    }
    req.body.listing.geometry = { type: "Point", coordinates: coords };
    next();
  } catch (err) {
    req.body.listing.geometry = { type: "Point", coordinates: [0, 0] };
    next();
  }
};