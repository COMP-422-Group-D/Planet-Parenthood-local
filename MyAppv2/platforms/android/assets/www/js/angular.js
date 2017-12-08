angular.module("gameApp", ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when("/leaderboard", {
        templateUrl: "leaderboard.html",
        controller: "ListController",
        resolve: {
          contacts: function(Contacts) {
              return users.getUsers();
          }
        }
      })

.otherwise({
                redirectTo: "/"
            })

  })

 .service("Users", function($http) {
    this.getUsers = function() {
      return $http.get("/users").
        then(function(response) {
            return response;
        }, function(response) {
            alert("Error retrieving users.");
        });
    }
  })
  .controller("ListController", function(users, $scope) {
    $scope.users = users.data;
  });
