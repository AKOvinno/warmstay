const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const {isLoggedIn, isOwner, validateListing, geocodeListing} = require('../middleware.js');
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
// Reformatting using router.route
router.route("/")
    .get(wrapAsync (listingController.index)) //index-route
    .post(isLoggedIn, validateListing, upload.single('listing[image]'), geocodeListing, wrapAsync (listingController.createListing)) //create-route

// Icons Routes
router.get("/search", wrapAsync(listingController.searchListing));
router.get("/trending", wrapAsync (listingController.trendingListing));
router.get("/rooms", wrapAsync (listingController.roomsListing));
router.get("/iconic_cities", wrapAsync (listingController.iconic_citiesListing));
router.get("/mountain", wrapAsync (listingController.mountainListing));
router.get("/castles", wrapAsync (listingController.castlesListing));
router.get("/pools", wrapAsync (listingController.poolsListing));
router.get("/camping", wrapAsync (listingController.campingListing));
router.get("/farms", wrapAsync (listingController.farmsListing));
router.get("/arctic", wrapAsync (listingController.arcticListing));
router.get("/ancient", wrapAsync (listingController.ancientListing));
router.get("/igloo", wrapAsync (listingController.iglooListing));
router.get("/others", wrapAsync (listingController.othersListing));
// New Route 
router.get("/new", isLoggedIn, listingController.renderNewForm);
// We have to keep new route otherwise browser will think /new is like /:id
router.route("/:id")
    .get(wrapAsync (listingController.showListing))//show-route
    .put(isLoggedIn, isOwner, validateListing, upload.single('listing[image]'), geocodeListing, wrapAsync (listingController.updateListing))//Update-route
    .delete(isLoggedIn, isOwner, wrapAsync (listingController.destroyListing))//destroy-route
// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync (listingController.renderEditForm));

module.exports = router;