angular.module("seriesOrganizer").controller("seriesOrganizerController", function($scope, $http) {
  $scope.app = "Series Organizer";
  $scope.input;
  $scope.busca = [];
  $scope.watchlist = [];
  $scope.profile = [];
  
  // SEARCH SUB-CONTROLLER

  $('#search-button').on('click', function() {
    $('#search').prop('checked', true);
  });

  $scope.enviarInput = function () {
    if($scope.input === undefined || $scope.input.length === 0) {
      alert('Type your search on the search box');
    } else {
      var promise = $http.get("https://omdbapi.com/?s=" + $scope.input + "&type=series&apikey=93330d3c").then(function (response) {
        if(response.data.Response === "False") {
          alert('Your search has no results, try another one');
        } else {
          $scope.busca = response.data.Search;
        }
      }, function error (error) {
        console.log(error);
      });
      return promise;
    }
  };

  // PROFILE SUB-CONTROLLER

  // WATCHLIST SUB-CONTROLLER

  $scope.addProfile = function (serie) {
    if ($scope.contains($scope.profile, serie)) {
      alert('"' + serie.Title + '" is already on your profile!')
    } else {
      var promise = $http.get("https://omdbapi.com/?i=" + serie.imdbID + "&plot=full&apikey=93330d3c").then(function(response) {
        serie = response.data;
        serie.myRating = "N/A"
        serie.lastEpisode = "N/A"
        $scope.profile.push(serie);
      }).catch(function(error){
        console.log(error);
      });
    }
  };

  $scope.removeProfile = function (serie) {
    if(confirm('Are you sure you want to remove "' + serie.Title + '" from your catalog?') === true) {
      var index = $scope.profile.indexOf(serie);
      $scope.profile.splice(index, 1);
    }
  }

  $scope.addWatchlist = function (serie) {
    if ($scope.contains($scope.watchlist, serie)) {
      alert('"' + serie.Title + '" is already on your watchlist!')
    } else if ($scope.contains($scope.profile, serie)) {
      alert('"' + serie.Title + '" is already on your profile!')
    } else {
      $scope.watchlist.push(angular.copy(serie));
    }
  };

  $scope.removeWatchlistNoWarning = function (serie) {
    var index = $scope.watchlist.indexOf(serie);
    $scope.watchlist.splice(index, 1);
  };

  $scope.removeWatchlist = function (serie) {
    if (confirm('Are you sure you want to remove "' + serie.Title + '" from your watchlist?') === true) {
      var index = $scope.watchlist.indexOf(serie);
      $scope.watchlist.splice(index, 1);
    }
  };

  $scope.contains = function (array, serie) {
    for (var i = 0; i < array.length; i++) {
      if(array[i].imdbID === serie.imdbID) {
        return true;
      }
    }
    return false;
  };

  $scope.enviarRating = function (serie, rating) {
    serie.myRating = rating;
  };

  $scope.enviarLastEpisode = function (serie, episode) {
    serie.lastEpisode = episode;
  };

});
