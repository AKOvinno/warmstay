const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync');
const {isLoggedIn, isReviewAuthor, validateReview} = require('../middleware.js');
const reviewController = require("../controllers/review.js");

// POST Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync (reviewController.createReview));
// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync (reviewController.destroyReview));
module.exports = router;