/**
 * Module dependencies.
 */
var should = require('should'),
    assert = require('assert'),
    app = require('../../server'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    Booking = mongoose.model('Booking'),
    User = mongoose.model('User'),
    bookingService = require('../../app/controllers/bookingService');

//Globals
var booking;
var user;
var cur = moment();

//The tests
describe('<Unit Test>', function() {
    describe('Service booking:', function() {
        beforeEach(function(done) {
            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password'
            });

            user.save(function(err) {
                 
                 booking = new Booking({
                    month: cur.month(),
                    day: cur.date(),
                    year: cur.year(), 
                    fullDate: cur,
                    user: user
                 });
                 booking.save(function(err) {
                    done();
                 });
                
            });

        });
        
        describe('Method getAllBookings', function() {
            it('should be able get month object including 5 weeks', function(done) {
                return bookingService.getAllBookings(function(result, err) {
                    should.not.exist(err);
                    var weeks = 0;
                    for (var key in result) {
                        if (result.hasOwnProperty(key)) {
                            weeks++;
                        }
                    }
                    assert.equal(weeks, 5);
                    done();
                });
            });

            it('should exist exactly one booking created by user "Full name"', function(done) {
                return bookingService.getAllBookings(function(result, err) {
                    var expectedUsers = [];
                    for (var key in result) {
                        var list = result[key];
                        
                        for (var index in list) {
                            var curBooking = list[index];
                            if (typeof curBooking.user !== 'undefined') {
                                expectedUsers.push({bookingId: booking._id, bookedBy: curBooking.user});
                            }
                           
                        }
                        
                    }
                    expectedUsers.should.not.be.empty;
                    expectedUsers[0].bookingId.should.equal(booking._id);
                    expectedUsers.should.have.length(1);
                    done();
                });
            });
            
        });

        
        afterEach(function(done) {
            //Booking.remove({});
            //User.remove({});
            Booking.remove().exec();
            User.remove().exec();
            done();
        });
        after(function(done){
            //Booking.remove().exec();
            //User.remove().exec();
            done();
        });
        
    });
});