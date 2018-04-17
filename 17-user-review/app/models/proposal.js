var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// request sub-schema 
var RequestSchema = new mongoose.Schema({
	author: String,
	requestNum: {type: Number, required: true, min: 0, max: 5},
	requestText: String,
	createdOn: {type: Date, default: Date.now}
});

// proposal schema 
var ProposalSchema = new Schema({
	name: {type: String, required: true},
	address: String,
	requestNum: {type: Number, "default": 0, min: 0, max: 5},
	facilities: String,
	openingHours: String,
	webAdr: String,
	mailAdr: String,
	proposalImage: String,
	requests: [RequestSchema]
});

module.exports = mongoose.model('Proposal', ProposalSchema);