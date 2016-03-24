// Make sure to include the `ui.router` module as a dependency
angular.module('app', ['ui.router'])
    // .run(
    //   [          '$rootScope', '$state', '$stateParams',
    //     function ($rootScope,   $state,   $stateParams) {

//     // It's very handy to add references to $state and $stateParams to the $rootScope
//     // so that you can access them from any scope within your applications.For example,
//     // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
//     // to active whenever 'contacts.list' or one of its decendents is active.
//     $rootScope.$state = $state;
//     $rootScope.$stateParams = $stateParams;
//     }
//   ]
// )

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
    // $urlRouterProvider
    // // Here we are just setting up some convenience urls.
    // .when('/c?id', '/contacts/:id')
    // .when('/user/:id', '/contacts/:id')
    // .otherwise('/');
    // 
    $urlRouterProvider.otherwise('/list');
    $stateProvider
        .state('list', {
            url: "/list",
            views: {
                'mainContent': {
                    templateUrl: "partials/list.html",
                    controller: "ListCtrl"
                }
            },

        })

    .state('item', {
            url: "/item/:id",
            views: {
                'mainContent': {
                    templateUrl: "partials/item.html",
                    controller: "ItemCtrl"
                }
            },

        })
        .state('form', {
            url: "/form",
            views: {
                'mainContent': {
                    templateUrl: "partials/form.html",
                    controller: "FormCtrl"
                }
            },
        });
}])

.controller('ListCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("enter list ctrl");
    $scope.books = {};
    $http({
        method: 'GET',
        url: '/api/books'
    }).then(function(res) {
        console.log(res.data.items);
        $scope.books = res.data.items;
    }, function errorCallback(res) {
        console.log("error??");
    });



}])

.controller('ItemCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
    var url = '/api/books/' + $stateParams.id;
    $http({
        method: 'GET',
        url: url
    }).then(function(res) {
        console.log(res.data);
        $scope.item = res.data;
    }, function errorCallback(res) {
        console.log("error??");
    });

}])

.directive('fileInput', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, elm, attr) {
            elm.bind('change', function() {
                $parse(attr.fileInput)
                .assign(scope, elm[0].files);
                scope.$apply();
            });
        }
    };
}])

.controller('FormCtrl', ['$scope', '$http', function($scope, $http) {
    var url = "/api/books/";
    $scope.filesChanged = function(elm) {
        $scope.files = elm.files;
        $scope.apply();
    };
    $scope.upload = function() {
        var fd = new FormData();
        angular.forEach($scope.files, function(file) {
            // console.log(file);
            fd.append('file', file);
            // console.log(fd['file']);
        });
        console.log(fd);

        // var data=$scope.book;

        $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': 'mutipart/form-data' }
            })
            .success(function(d) { console.log(d); });
    };
}]);
