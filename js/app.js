'use strict';

var app = angular.module('ChirperApp', ['firebase']);

app.controller('ChirperCtrl', ['$scope', '$firebaseAuth', '$firebaseObject', '$firebaseArray', function($scope, $firebaseAuth, $firebaseObject, $firebaseArray) {
	$scope.newUser = {};
	$scope.chirppad = {};
	var Auth = $firebaseAuth();
	var baseRef = firebase.database().ref();
	var usersRef = baseRef.child('users');
	$scope.users = $firebaseObject(usersRef);
	var padRef = baseRef.child('chirppad');
	var chirpPadObj = $firebaseObject(padRef);
	chirpPadObj.$bindTo($scope, 'chirppad'); 
	var chirpsRef = baseRef.child('chirps');
	$scope.chirps = $firebaseArray(chirpsRef);
	$scope.newChirp = {};
	console.log($scope.chirps);
	//your code goes here
	
	$scope.like = function(tweet) {
		tweet.likes++;
		$scope.chirps.$save(tweet);
	};

	$scope.postChirp = function() {
		var chirpData = {
			text: $scope.newChirp.text,
			userId: $scope.userId,
			likes: 0,
			time: firebase.database.ServerValue.TIMESTAMP
		};
		$scope.chirps.$add(chirpData)
			.then(function(data) {
				$scope.newChirp.text = '';
			});
	};

	
	$scope.signUp = function() {
		Auth.$createUserWithEmailAndPassword($scope.newUser.email, $scope.newUser.password)
			.then(function(firebaseUser) {
				console.log('user created: ' + firebaseUser.uid);
				$scope.userId = firebaseUser.uid;
				
				var userData = {
					handle: $scope.newUser.handle,
					avatar: $scope.newUser.avatar
				};
				
				var newUserRef = usersRef.child(firebaseUser.uid);
				newUserRef.set(userData);
			})
			
			.catch(function(error) {
				console.log(error);
			});
	}
	
	Auth.$onAuthStateChanged(function(firebaseUser) {
   		if(firebaseUser){
			  $scope.userId = firebaseUser.uid;
      	//assign firebaseUser.uid to $scope.userId
   		}
   		else {
      		$scope.userId = undefined;
   		}
	});

	//respond to "Sign Out" button
	$scope.signOut = function() {
   		Auth.$signOut(); //AngularFire method
	};

	//respond to "Sign In" button
	$scope.signIn = function() {
   		Auth.$signInWithEmailAndPassword($scope.newUser.email, $scope.newUser.password); //AngularFire method
	};

}]);