// create the module and name it monosmithApp
// also include ngRoute for all our routing needs
var monosmithApp = angular.module('monosmithApp', ['ngRoute']);

// configure our routes
monosmithApp.config(function($routeProvider) {
	$routeProvider

		// route for the home page
		.when('/', {
			templateUrl : 'pages/home.html',
			controller  : 'mainController'
		})

		// route for the flameo page
		.when('/flameo', {
			templateUrl : '/private/pages/flameo.html',
			controller  : 'flameoController'
		})

		// route for the dreams page
		.when('/dreams', {
			templateUrl : 'pages/dreams.html',
			controller  : 'dreamsController'
		})

		// route for the portfolio page
		.when('/portfolio', {
			templateUrl : 'pages/portfolio.html',
			controller  : 'portfolioController'
		})

		// route for the resume page
		.when('/resume', {
			templateUrl : 'pages/resume.html',
			controller  : 'resumeController'
		})

		// route for the about page
		.when('/about', {
			templateUrl : 'pages/about.html',
			controller  : 'aboutController'
		})

		// route for the login page
		.when('/admin', {
			templateUrl : '/private/admin/admin.html',
			controller  : 'adminController'
		})

		// route for logout
		.when('/logout', {
			templateUrl : 'pages/home.html',
			controller  : 'logoutController'
		});
});

monosmithApp.factory('loginFactory', function() {
    return {
        login: function($scope, $http, $route) {
            var json_data = JSON.stringify($scope.formData);
            $http.post('/login', json_data, {
                withCredentials: true,
                headers: {'Content-Type': 'application/json'},
                transformRequest: angular.identity
            }).success(function() {
                $route.reload();
            }).error(function() {
                jQuery('#error').html('these are not valid credentials you have tried to use...');
            });
        }
    };
});

monosmithApp.controller('loginController', ['$scope', '$http', '$route', 'loginFactory', function($scope, $http, $route, loginFactory) {
    $scope.login = function() {
        $scope.formFactory = loginFactory.login($scope, $http, $route);
    };
}]);

// create the controller and inject Angular's $scope
monosmithApp.controller('mainController', function($scope, $http) {
    $http.get('/api/blogs')
		.success(function(data) {
            angular.forEach(data, function(value,index) {
                value.timestamp = moment(value.timestamp).format('dddd MMMM DD, YYYY [at] h:mm a');
            });
			$scope.blogs = data;
		})
		.error(function(data) {
			// ?
		});
});

monosmithApp.controller('flameoController', function($scope, $http) {
    $http.get('/api/chart')
		.success(function(data) {
            $scope.dates = '';
            $scope.totals = '';
            $scope.actuals = '';
            angular.forEach(data, function(value,index) {
                $scope.title = value.title;
                angular.forEach(value.data, function(value2,index2) {
                    $scope.dates += ($scope.dates != '' ? '^' : '') + moment(value2.date).format('MM/DD/YYYY');
                    $scope.totals += ($scope.totals != '' ? '^' : '') + value2.total;
                    $scope.actuals += ($scope.actuals != '' ? '^' : '') + value2.actual;
                });
            });
		})
		.error(function(data) {
			// ?
		});
});

monosmithApp.controller('adminController', function($scope, $http) {
    $http.get('/api/users')
		.success(function(data) {
            $scope.users = data;
		})
		.error(function(data) {
			// ?
		});
});

monosmithApp.controller('logoutController', function($scope, $http) {
    $http.post('/logout');
    $http.get('/api/blogs')
		.success(function(data) {
            angular.forEach(data, function(value,index) {
                value.timestamp = moment(value.timestamp).format('dddd MMMM DD, YYYY [at] h:mm a');
            });
			$scope.blogs = data;
		})
		.error(function(data) {
			// ?
		});
});

monosmithApp.controller('dreamsController', function($scope, $http) {
	$scope.message = 'gonna create a page to peruse dreams i\'ve had. need to transcribe a lot of them and get them in the database...';
});

monosmithApp.controller('portfolioController', function($scope, $http) {
	$http.get('/api/projects')
		.success(function(data) {
			angular.forEach(data, function(value,index) {
                value.timestamp = moment(value.timestamp).format('dddd MMMM DD, YYYY [at] h:mm a');
            });
			$scope.projects = data;
		})
		.error(function(data) {
			// ?
		});
});

monosmithApp.controller('resumeController', function($scope) {
	// nothing needed here
});

monosmithApp.controller('aboutController', function($scope) {
	// nothing needed here
});

// antipattern here, basically disable cache to accomplish dynamic route for login/flameo
monosmithApp.run(function($rootScope, $templateCache) {
   $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
   });
});