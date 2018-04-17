angular.module('proposalService', [])

.factory('Proposal', function($http) {

	// create a new object
	var proposalFactory = {};

	// get a single proposal
	proposalFactory.get = function(id) {
		return $http.get('/api/proposals/' + id);
	};

	// get all proposals
	proposalFactory.all = function() {
		return $http.get('/api/proposals/');
	};

	// create a proposal
	proposalFactory.create = function(proposalData) {
		return $http.post('/api/proposals/', proposalData);
	};

	// update a proposal
	storeFactory.update = function(id, proposalata) {
		return $http.put('/api/proposals/' + id, proposalData);
	};

	// delete a proposal
	proposalFactory.delete = function(id) {
		return $http.delete('/api/proposals/' + id);
	};

	// return our entire proposalFactory object
	return proposalFactory;

});