core.factory("User", ($http, $rootScope, AuthService, AUTH_EVENTS) => {
    // function User(props) {
    //     angular.extend(this, props);
    // }

    let User = {};

    User.fetch = function() {
        AuthService.getLoggedInUser((user) => {
        	console.log("User Factory user: ", user);
        	if(user) {
        		console.log("logged in user");
        		return user;
        	}
        	else {
        		console.log("currently guest");
        	}
        });
    };

    // User.url = '/api/users/';

    // User.prototype.getUrl = function() {
    //     return User.url + this._id;
    // };

    // User.prototype.isNew = function() {
    //     return !this._id
    // };

    // User.prototype.fetch = function() {
    //     return $http.get(this.getUrl())
    //         .then(function(res) {
    //             var user = new User(res.data);
    //             user.stories = user.stories.map(function(obj) {
    //                 return new Story(obj);
    //             });
    //             return user;
    //         });
    // };

    // User.fetchAll = function() {
    //     return $http.get(User.url)
    //         .then(function(res) {
    //             return res.data.map(function(obj) {
    //                 return new User(obj);
    //             });
    //         });
    // };

    // User.prototype.save = function() {
    //     var verb;
    //     var url;
    //     if (this.isNew()) {
    //         verb = 'post';
    //         url = User.url;
    //     } else {
    //         verb = 'put';
    //         url = this.getUrl();
    //     }
    //     return $http[verb](url, this)
    //         .then(function(res) {
    //             return new User(res.data);
    //         });
    // };

    // User.prototype.destroy = function() {
    //     return $http.delete(this.getUrl());
    // };

    return User;
});