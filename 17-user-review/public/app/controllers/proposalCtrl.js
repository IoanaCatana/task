angular.module('proposalCtrl', ['proposalService'])

.controller('proposalController', function(Proposal) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the proposals at page load
	Proposal.all()
		.success(function(data) {

			// when all the proposals come back, remove the processing variable
			vm.processing = false;

			// bind the proposals that come back to vm.proposals
			vm.proposals = data;
		});

	// function to delete a proposal
	vm.deleteProposal = function(id) {
		vm.processing = true;

		Proposal.delete(id)
			.success(function(data) {

				// get all proposals to update the table
				// you can also set up your api 
				// to return the list of stores with the delete call
				Proposal.all()
					.success(function(data) {
						vm.processing = false;
						vm.proposals = data;
					});

			});
	};

})

// controller applied to proposal creation page
.controller('proposalCreateController', function(Proposal) {
	
	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a proposal
	vm.saveProposal = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the proposalService
		Proposal.create(vm.proposalData)
			.success(function(data) {
				vm.processing = false;
				vm.proposlData = {};
				vm.message = data.message;
			});
			
	};	

})

// controller applied to proposal edit page
.controller('proposalEditController', function($routeParams, Proposal) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the proposal data for the store you want to edit
	// $routeParams is the way we grab data from the URL
	Proposal.get($routeParams.proposal_id)
		.success(function(data) {
			vm.proposalData = data;
		});

	// function to save the proposal
	vm.saveProposal = function() {
		vm.processing = true;
		vm.message = '';

		// call the proposalService function to update 
		Proposal.update($routeParams.proposal_id, vm.proposalData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.proposalData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

});