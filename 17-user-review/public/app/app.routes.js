angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'app/views/pages/home.html'
		})
		
		// login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    			controllerAs: 'login'
		})
		
		// show all users
		.when('/users', {
			templateUrl: 'app/views/pages/users/all.html',
			controller: 'userController',
			controllerAs: 'user'
		})

		// form to create a new user
		// same view as edit page
		.when('/users/create', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userCreateController',
			controllerAs: 'user'
		})

		// page to edit a user
		.when('/users/:user_id', {
			templateUrl: 'app/views/pages/users/single.html',
			controller: 'userEditController',
			controllerAs: 'user'
		})

		// show all proposals
		.when('/proposals', {
			templateUrl: 'app/views/pages/proposals/all.html',
			controller: 'proposalController',
			controllerAs: 'proposal'
		})

		// form to create a new proposal
		// same view as edit page
		.when('/proposals/create', {
			templateUrl: 'app/views/pages/proposals/single.html',
			controller: 'proposalCreateController',
			controllerAs: 'proposal'
		})

		// page to edit a proposal
		.when('/proposals/:proposal_id', {
			templateUrl: 'app/views/pages/proposals/single.html',
			controller: 'proposalEditController',
			controllerAs: 'proposal'
		})

		// page to edit a proposal
		.when('/proposals/:proposal_id/requests', {
			templateUrl: 'app/views/pages/proposals/detail.html',
			controller: 'proposalEditController',
			controllerAs: 'proposal'
		})

