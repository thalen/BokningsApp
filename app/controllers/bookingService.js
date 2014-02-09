/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    moment = require('moment'),
    Booking = mongoose.model('Booking'),
    User = mongoose.model('User'),
    _ = require('underscore');


exports.getAllBookings = function(selectedMonth, resultCb) {
    console.log("selectedMonth: " + selectedMonth);
    var tmpDate = moment();
    if (selectedMonth !== null) {
        tmpDate.set('month', parseInt(selectedMonth));
        console.log("month set");    
    }
    var days = tmpDate.daysInMonth();
    console.log("days in month: " + days);
    var result = [];
    Booking.find({year: tmpDate.year(), month: tmpDate.month()}).populate('user', 'name username').exec(function(err, bookings) {
        var daysList = _.range(1, days);
        console.log("bookings from db: " + bookings);
        var bookingList = _.map(daysList, function(num) {
            var result = _.findWhere(bookings, {day: num});
            return typeof result === 'undefined' ? {} : result;
        });
        for (var i = 1; i<= parseInt(days); i++) {
            tmpDate.date(i);
            if (i == 1) {
                console.log("tmpdate.day: " + tmpDate.day());
                for (var j = 0; j < tmpDate.day(); j++) {
                    var days2Subtract = tmpDate.day() - j;
                    var tmpDate2 = moment(tmpDate);
                    tmpDate2.date(i);
                    tmpDate2.subtract('days', days2Subtract);
                    result.push(new Booking({day: tmpDate2.date(), month: tmpDate2.month(), year: tmpDate2.year(), fullDate: tmpDate2, invalid: true}));
                }
            }
            var oldBooking = bookingList[i-1];
            
            if (_.isEmpty(oldBooking)) {
                result.push(new Booking({day: i, month: tmpDate.month(), fullDate: tmpDate, year: tmpDate.year()}));
            } else {
                result.push(oldBooking);
            }
        }
        var i = 1;
        for (var j = tmpDate.day()+1; j <= 6; j++) {
            tmpDate.add('days', 1);
            result.push(new Booking({day: i++, month: tmpDate.month(), year: tmpDate.year(), fullDate: tmpDate, invalid: true}));
        }
    
        var transform = function(booking) {
            var momentDate = moment(booking.fullDate);
            return parseInt(momentDate.week());
        };

        resultCb(_.groupBy(result, transform), null); 
        
    });   
};

