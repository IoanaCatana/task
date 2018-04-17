angular.module('detailCtrl', ['detailService'])

// controller applied to proposal view page
.controller('detailController', function($routeParams, Proposal) {

	var vm = this;

	vm.proposal_id = $routeParams.proposal_id;

	// get the proposal data for the proposalyou want to edit
	// $routeParams is the way we grab data from the URL
	Proposal.get($routeParams.proposal_id)
		.success(function(data) {
			vm.detailData = data;
		});

/*	
		// call the proposalService function to update 
		Proposal.update($routeParams.proposalid, vm.proposalData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.proposalData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
*/

	};

});