/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    moment = require('moment'),
    Booking = mongoose.model('Booking'),
    _ = require('underscore');


exports.all = function(req, res) {
    var days = moment().daysInMonth();
    var tmpDate = moment();
    var result = [];
    for (var i = 1; i<= parseInt(days); i++) {
        tmpDate.date(i);
        if (i == 1) {
            for (var j = 0; j < tmpDate.day(); j++) {
                var days2Subtract = tmpDate.day() - j;
                var tmpDate2 = moment();
                tmpDate2.date(i);
                tmpDate2.subtract('days', days2Subtract);
                result.push(new Booking({day: tmpDate2.date(), month: 1, fullDate: tmpDate2, invalid: true}));
            }
        }
        result.push(new Booking({day: i, month: 1, fullDate: tmpDate}));
    }
    var i = 1;
    for (var j = tmpDate.day()+1; j <= 6; j++) {
        tmpDate.add('days', 1);
        result.push(new Booking({day: i++, month: 1, fullDate: tmpDate, invalid: true}));
    }
    
    var transform = function(booking) {
        var momentDate = moment(booking.fullDate);
        return momentDate.week();
    };

    res.jsonp(_.groupBy(result, transform));
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
