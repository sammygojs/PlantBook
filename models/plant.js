const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    // Basic Plant Info
    plantid: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    createdby: { type: String },
    createddate: { type: Date, default: Date.now },
    plantIdentificationStatus: { type: Boolean, default: "false" },

    // Plant Details
    height: { type: Number },
    spread: { type: Number },
    has_flowers: { type: Boolean },
    has_leaves: { type: Boolean },
    has_fruitsorseeds: { type: Boolean },
    flower_color: { type: String },
    date_time_plant_seen: { type: Date, default: Date.now },

    // Plant Comments
    comments: [{
        commentid: { type: Number },
        commentedby: { type: String },
        comment: { type: String }
    }],

    // Plant Identifications
    identifications: [{
        plantidentificationid: { type: Number },
        suggestedname: { type: String },
        identifiedby: { type: String },
        status: { type: String, default: "Not Approved" },
        approved: { type: Boolean, default: false }
    }],

    likes: { type: Number, default: 0 }
});

// Pre-save hook to auto-increment commentid and plantidentificationid
plantSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('comments') || this.isModified('identifications')) {
        if (this.comments.length > 0) {
            this.comments.forEach((comment, index) => {
                if (!comment.commentid) {
                    comment.commentid = index + 1;
                }
            });
        }
        if (this.identifications.length > 0) {
            this.identifications.forEach((identification, index) => {
                if (!identification.plantidentificationid) {
                    identification.plantidentificationid = index + 1;
                }
            });
        }
    }
    next();
});

const Plant = mongoose.model('Plant', plantSchema);
module.exports = Plant;
