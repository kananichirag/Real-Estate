const express = require('express');
const Listing = express.Router();
const {verifyToken} = require('../utills/VerfiyUser')
const ListingController = require('../controller/ListingController')


Listing.post('/create',verifyToken,ListingController.createListing)
Listing.delete('/delete/:id',verifyToken,ListingController.DeleteListing)
Listing.post('/update/:id',verifyToken,ListingController.UpdateListing)
Listing.get('/get/:id',ListingController.GetListing)
Listing.get('/get',ListingController.getListings)

module.exports = Listing;
