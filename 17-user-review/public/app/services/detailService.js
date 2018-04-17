angular.module('detailService', [])

.factory('Proposal', function($http) {

	// create a new object
	var detailFactory = {};

	// get a single proposal
	detailFactory.get = function(id, detailData) {
		return $http.get('/api/proposal/' + id '/requests/', detailData);
	};

	

	// return our entire proposalFactory object
	return detailFactory;

});