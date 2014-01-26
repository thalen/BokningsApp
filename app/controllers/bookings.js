/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    bookingService = require('../controllers/bookingService'),
    Booking = mongoose.model('Booking'),
    _ = require('underscore');


exports.all = function(req, res) {
    bookingService.getAllBookings(function(result, err) {
        res.jsonp(result);
    });
};

exports.addBooking = function(req, res) {
    var booking = new Booking(req.body);
    booking.user = req.user;
    booking.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                booking: booking
            });
        } else {
            res.jsonp(booking);
        }
    });
};
