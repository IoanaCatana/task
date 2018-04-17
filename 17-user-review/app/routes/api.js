var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/user');
var Proposal       = require('../models/proposal');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// route to generate sample user
	apiRouter.post('/sample', function(req, res) {

		// look for the user named chris
		User.findOne({ 'username': 'chris' }, function(err, user) {

			// if there is no chris user, create one
			if (!user) {
				var sampleUser = new User();

				sampleUser.name = 'Chris';  
				sampleUser.username = 'chris'; 
				sampleUser.password = 'supersecret';

				sampleUser.save();
			} else {
				console.log(user);

				// if there is a chris, update his password
				user.password = 'supersecret';
				user.save();
			}
		});
	});

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {

		// find the user
		User.findOne({
		username: req.body.username
		}).select('name username password').exec(function(err, user) {

	    if (err) throw err;

			// no user with that username was found
			if (!user) {
				res.json({
					success: false,
					message: 'Authentication failed. User not found.'
				});
			} else if (user) {

				// check if password matches
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json({
						success: false,
						message: 'Authentication failed. Wrong password.'
					});
			  	} else {

				// if user is found and password is right
				// create a token
				var token = jwt.sign({
					name: user.name,
					username: user.username
				}, superSecret, {
				  //expiresInMinutes: 1440 // expires in 24 hours
				});

				// return the information including token as JSON
				res.json({
				  success: true,
				  message: 'Enjoy your token!',
				  token: token
				});
			  }
			}
		});
	});

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Somebody just came to our app!');

		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		// decode token
		if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, superSecret, function(err, decoded) {      

	    	if (err) {
	        	res.status(403).send({
	        		success: false,
	        		message: 'Failed to authenticate token.'
	    		});
	    	} else {
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;
	            
	        next(); // make sure we go to the next routes and don't stop here
	    	}
	    });

	  	} else {

	  		// if there is no token
	  		// return an HTTP response of 403 (access forbidden) and an error message
			res.status(403).send({
   	 			success: false,
   	 			message: 'No token provided.'
   	 		});
	  	}
	});

	// test route to make sure everything is working 
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });	
	});

	// ----------------------------------------------------
	// THE ROUTES FOR USERS
	// ----------------------------------------------------
	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {
			
			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else 
						return res.send(err);
				}

				// return a message
				res.json({ message: 'User created!' });
			});

		})

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {

			User.find({}, function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
		});

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'User updated!' });
				});

			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	// ----------------------------------------------------
	// THE ROUTES FOR Proposals
	// ----------------------------------------------------
	// on routes that end in /proposals
	// ----------------------------------------------------
	apiRouter.route('/proposals')

		// create a proposal (accessed at POST http://localhost:8080/proposals
		.post(function(req, res) {
			
			var proposal = new Proposal();		// create a new instance of the Proposal model
			proposal.name = req.body.name;  // set the users name (comes from the request)
			proposal.address = req.body.address; 
			proposal.ratingNum = req.body.requestNum; 
			proposal.facilities = req.body.facilities; 
			proposal.openingHours = req.body.openingHours; 
			proposal.webAdr = req.body.webAdr; 
			proposal.proposalImage = req.body.proposalImage; 
			//store.request= [{
				//author: req.body.author;
				//requestNum: req.body.requestNum;
				//requestText: req.body.requestText;
				//createdOn: req.body.createdOn;
			//}];

			proposal.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A proposal with that name already exists. '});
					else 
						return res.send(err);
				}

				// return a message
				res.json({ message: 'Proposal created!' });
			});

		})

		// get all the proposals (accessed at GET http://localhost:8080/api/proposals)
		.get(function(req, res) {

			Proposal.find({}, function(err, proposals) {
				if (err) res.send(err);

				// return the proposals
				res.json(proposals);
			});
		});

	// on routes that end in /proposals/:proposal_id
	apiRouter.route('/proposals/:proposal_id')

		// get the proposal with that id
		.get(function(req, res) {
			Proposal.findById(req.params.proposal_id, function(err, proposal) {
				if (err) res.send(err);

				// return that proposal
				res.json(proposal);
			});
		})

		// update the proposal with this id
		.put(function(req, res) {
			Proposal.findById(req.params.proposal_id, function(err, proposal) {

				if (err) res.send(err);

				// set the new store information if it exists in the request
				if (req.body.name) proposal.name = req.body.name;
				if (req.body.address) proposal.address = req.body.address;
				if (req.body.requestNum) proposal.requestNum = req.body.requestNum;
				if (req.body.facilities) proposal.facilities = req.body.facilities;
				if (req.body.openingHours) proposal.openingHours = req.body.openingHours;
				if (req.body.webAdr) proposal.webAdr = req.body.webAdr;
				if (req.body.proposalImage) proposal.proposalImage = req.body.proposalImage;
				//if (req.body.request) proposal.rating = req.body.request;
				//if (req.body.request.author) proposal.request.author = req.body.request.author; // ?????
				//if (req.body.request.ratingNum) proposal.request.requestNum = req.body.request.requestNum; // ?????
				//if (req.body.request.requestText) proposal.request.requestText = req.body.request.requestText; // ?????
				//if (req.body.request.createdOn) proposal.request.createdOn = req.body.request.createdOn; // ?????

				// save the proposal
				proposal.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'Proposal updated!' });
				});

			});
		})

		// delete the proposal with this id
		.delete(function(req, res) {
			Proposal.remove({
				_id: req.params.proposal_id
			}, function(err, proposal) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

	// ----------------------------------------------------
	// THE ROUTES FOR Requests
	// ----------------------------------------------------
	// on routes that end in /proposalss/:proposal_id/requests
	// ----------------------------------------------------
	apiRouter.route('/proposals/:proposal_id/requests')

		// create a new request (accessed at POST http://localhost:8080/proposals/:proposal_id/requests)
		.post(function(req, res) {
			
			var proposalid = req.params.proposal_id;

			if (proposalid) {
				Proposal
				.findById(proposalid)
				.select('requests')
					.exec(function(err, proposal) {
						if (err) {
							sendJsonResponse(res, 400, err);

						} else { // Like doAddRequest
	
							if (!proposal) {
								sendJsonResponse(res, 404, {
									"message": "proposal_id not found"
								});

							} else {
								proposal.requests.push({
									author: req.body.author,
									requestNum: req.body.requestNum,
									requestText: req.body.requestText,
									createdOn: req.body.createdOn
								});

								// save the request
								proposal.save(function(err) {
									if (err) res.send(err);

									// return a message
									res.json({ message: 'Request updated!' });
								});
							}

						}
					}
				);

			} else {
				sendJsonResponse(res, 404, {
					"message": "Not found, proposal_id required"
				});
			}			
		});

		// on routes that end in /proposals/:proposal_id/requests/:request_id'
		apiRouter.route('/proposals/:proposal_id/requests/:request_id') 

		// get the requestwith that id
		.get(function(req, res) {

			if (req.params && req.params.proposal_id && req.params.request_id) {
				Proposal.findById(req.params.proposal_id).select('name requests').exec(function(err, proposal) {
					
					var response, request;
					
					if (!proposal) {
						sendJsonResponse(res, 404, {
							"message": "proposalid not found"
						});
						return;
						} else if (err) {
							sendJsonResponse(res, 400, err);
							return;
						}
						if (proposal.requests && proposal.requests.length > 0) {
							request = proposal.requests.id(req.params.request_id);
							if (!request) {
								sendJsonResponse(res, 404, {
									"message": "request_id not found"
								});
							} else {
								response = {
									proposal : {
										name : proposal.name,
										id : req.params.proposal_id
									},
										request : request
								};
								sendJsonResponse(res, 200, response);
							}
						} else {
							sendJsonResponse(res, 404, {
								"message": "No requests found"
							});
						}
					}
				);
				} else {
					sendJsonResponse(res, 404, {
						"message": "Not found, proposal_id and request_id are both required"
					});
				}
			});

		// on routes that end in /proposals/:proposal_id/requests/:request_id'
		apiRouter.route('/proposals/:proposal_id/requests/:request_id') 
		// put the request with that id
		.put(function(req, res) {
			if (!req.params.proposal_id || !req.params.request_id) {
				sendJsonResponse(res, 404, {
					"message": "Not found, proposal_id and request_id are both required"
				});
			return;
			}

			Proposal.findById(req.params.proposal_id).select('requests').exec(function(err, proposal) {

				var thisRequest;

					if (!proposal) {
						sendJsonResponse(res, 404, {
							"message": "proposal_id not found"
						});
						return;
					} else if (err) {
						sendJsonResponse(res, 400, err);
						return;
					}
					if (proposal.requests && proposal.requests.length > 0) {
						thisRequest = proposal.requests.id(req.params.request_id);
						if (!thisRequest) {
							sendJsonResponse(res, 404, {
								"message": "request_id not found"
							});
						} else {
							thisRequest.author = req.body.author;
							thisRequest.request = req.body.requestgNum;
							thisRequest.requestText = req.body.requestText;
							proposal.save(function(err, store) {
							if (err) {
								sendJsonResponse(res, 404, err);
							} else {
								sendJsonResponse(res, 200, thisRequest);
							}
						});
					}
				} else {
					sendJsonResponse(res, 404, {
						"message": "No request to update"
					});
				}
			});
		});

		// on routes that end in /proposals/:proposal_id/requests/:rrequest_id'
		apiRouter.route('/proposals/:proposal_id/requests/:request_id') // TODO : Hedder det "stors" eller "stores"?

		// delete the rating with that id
		.delete(function(req, res) {

			if (!req.params.proposal_id || !req.params.request_id) {
				sendJsonResponse(res, 404, {
					"message": "Not found, proposal_id and request_id are both required"
				});
				return;
			}
			Proposal.findById(req.params.proposal_id).select('requests').exec(function(err, proposal) {
				if (!proposal) {
					sendJsonResponse(res, 404, {
						"message": "proposal_id not found"
				});
				return;
			} else if (err) {
				sendJsonResponse(res, 400, err);
				return;
			}
			if (proposal.requests && proposal.requests.length > 0) {
				if (!proposal.requests.id(req.params.request_id)) {
					sendJsonResponse(res, 404, {
						"message": "request_id not found"
					});
				} else {
					proposal.requests.id(req.params.request_id).remove();
						proposal.save(function(err) {
							if (err) {
								sendJsonResponse(res, 404, err);
							} else {
								sendJsonResponse(res, 204, null);
							}
						});
					}
				} else {
					sendJsonResponse(res, 404, {
						"message": "No rating to delete"
					});
				}
			}
		);
	});

	return apiRouter;

};