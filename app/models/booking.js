/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;

var BookingSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    day: {
        type: Number
    },
    month: {
        type: Number
    },
    year: {
        type: Number
    },
    fullDate: {
        type: Date
    },
    invalid: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/*
BookingSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');
*/

/**
 * Statics
 */
BookingSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('user', 'name username').exec(cb);
    }
};

mongoose.model('Booking', BookingSchema);