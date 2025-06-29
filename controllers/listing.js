const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
};
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new") 
};
module.exports.trendingListing = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
};
module.exports.roomsListing = async (req, res) => {
    const allListings = await Listing.find({category:'rooms'});
    res.render("listings/index", {allListings});
};
module.exports.iconic_citiesListing = async (req, res) => {
    const allListings = await Listing.find({category:'iconic cities'});
    res.render("listings/index", {allListings});
};
module.exports.mountainListing = async (req, res) => {
    const allListings = await Listing.find({category:'mountains'});
    res.render("listings/index", {allListings});
};
module.exports.castlesListing = async (req, res) => {
    const allListings = await Listing.find({category:'castles'});
    res.render("listings/index", {allListings});
};
module.exports.poolsListing = async (req, res) => {
    const allListings = await Listing.find({category:'pools'});
    res.render("listings/index", {allListings});
};
module.exports.campingListing = async (req, res) => {
    const allListings = await Listing.find({category:'camping'});
    res.render("listings/index", {allListings});
};
module.exports.farmsListing = async (req, res) => {
    const allListings = await Listing.find({category:'farms'});
    res.render("listings/index", {allListings});
};
module.exports.arcticListing = async (req, res) => {
    const allListings = await Listing.find({category:'arctic'});
    res.render("listings/index", {allListings});
};
module.exports.ancientListing = async (req, res) => {
    const allListings = await Listing.find({category:'ancient'}); 
    res.render("listings/index", {allListings});
};
module.exports.iglooListing = async (req, res) => {
    const allListings = await Listing.find({category:'igloo'}); 
    res.render("listings/index", {allListings});
};
module.exports.othersListing = async (req, res) => {
    const allListings = await Listing.find({category:'others'});
    res.render("listings/index", {allListings});
};
module.exports.searchListing = async (req, res) => {
  const { q } = req.query;
  let allListings = [];
  if (q) {
    // Search by title, location, or country (case-insensitive)
    allListings = await Listing.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i"} },
      ]
    });
  }
  res.render("listings/index", { allListings });
};
module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", 
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for doesn't exist!")
        return res.redirect("/listings");
    }
    //console.log(listing);
    res.render("listings/show.ejs", {listing});
};
module.exports.createListing =  async (req, res) => {
    // let {title, description, image, price, country, location} = req.body;
    let url = req.file.path;
    let filename = req.file.filename;
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};
module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for doesn't exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing is Updated!");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is deleted!");
    res.redirect("/listings");
};