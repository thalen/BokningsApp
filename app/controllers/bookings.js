/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    bookingService = require('../controllers/bookingService'),
    Booking = mongoose.model('Booking'),
    _ = require('underscore');


exports.booking = function(req, res, next, id) {
    Booking.load(id, function(err, booking) {
        if (err) return next(err);
        if (!booking) return next(new Error('Failed to load booking ' + id));
        req.booking = booking;
        next();
    });
};

exports.all = function(req, res) {
    bookingService.getAllBookings(function(result, err) {
        res.jsonp(result);
    });
};

exports.destroy = function(req, res) {
    var booking = req.booking;

    booking.remove(function(err) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(booking);
        }
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
