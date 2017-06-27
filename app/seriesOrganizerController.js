angular.module("seriesOrganizer")
  .controller("seriesOrganizerController", function($scope, $http) {
    
    // ATRIBUTES
    $scope.app = "Series Organizer";
    $scope.input;
    $scope.searchRequest = [];
    $scope.watchlist = [];
    $scope.profile = [];

    // CONSTANTS
    var ARGS = "&type=series";
    var APIKEY = "&apikey=93330d3c&";
    var BASEURL = "https://omdbapi.com/?s=";
    var BASEURLID = "https://omdbapi.com/?i=";
    
    // SEARCH SUB-CONTROLLER
    $scope.enviarInput = function () {
      if ($scope.input.length > 0) {
        return $http
          .get(BASEURL + $scope.input + ARGS + APIKEY)
          .then(function (response) {
            if (response.data.Response === "True") {
              $scope.searchRequest = response.data.Search;
            }
          }, function error (error) {
            console.log(error);
          });
      }
    };

    // PROFILE SUB-CONTROLLER
    $scope.addSerieOnProfile = function (serie) {
      if ($scope.containsById($scope.profile, serie)) {
        alert('"' + serie.Title + '" já está adicionada em seu perfil!');
      } else {
        return $http
          .get(BASEURLID + serie.imdbID + "&plot=full" + APIKEY)
          .then(function (response) {
            serie = response.data;
            serie.myRating = "N/A";
            serie.lastEpisode = "N/A";
            $scope.profile.push(serie);
          })
          .catch(function (error) {
            console.log(error);
          });
        }
    };

    $scope.removeSerieFromProfile = function (serie) {
      if (confirm('Você tem certeza que deseja remover "' + serie.Title + '" do seu perfil?') === true) {
        $scope.profile.splice($scope.profile.indexOf(serie), 1);
      }
    };

    $scope.addRatingOnProfile = function (serie, rating) {
      serie.myRating = rating;
    };

    $scope.addLastEpisodeOnProfile = function (serie, episode) {
      serie.lastEpisode = episode;
    };

    // WATCHLIST SUB-CONTROLLER
    $scope.addSerieOnWatchlist = function (serie) {
      if ($scope.containsById($scope.watchlist, serie)) {
        alert('"' + serie.Title + '" já está adicionada em sua lista de desejos!')
      } else if ($scope.containsById($scope.profile, serie)) {
        alert('"' + serie.Title + '" já está adicionada em seu perfil!')
      } else {
        $scope.watchlist.push(angular.copy(serie));
      }
    };

    $scope.removeWatchlistToProfile = function (serie) {
      $scope.watchlist.splice($scope.watchlist.indexOf(serie), 1);
    };

    $scope.removeWatchlist = function (serie) {
      if (confirm('Você tem certeza que deseja remover "' + serie.Title + '" da sua lista de desejos?') === true) {
        $scope.watchlist.splice($scope.watchlist.indexOf(serie), 1);
      }
    };

    // UTILS
    $scope.containsById = function (array, serie) {
      var result = false;
      for (var i = 0; i < array.length; i++) {
        if (array[i].imdbID === serie.imdbID) {
          result = true;
          break;
        }
      }
      return result;
    };

});
