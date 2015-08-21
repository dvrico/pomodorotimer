(function() {
  var myApp = angular.module('myApp', []);

  myApp.controller('MainController', ['$scope', '$interval', function($scope, $interval){
    $scope.breakLength = 5
    $scope.sessionLength = 25
    $scope.timeLeft = $scope.sessionLength
    $scope.sessionName = 'Session'

    var timerIsRunning = false
    var secs = 60 * $scope.timeLeft

    $scope.breakLengthChange = function(time) {
      $scope.breakLength += time
      if ($scope.breakLength < 0) {
        $scope.breakLength = 0
      }
    }

    $scope.sessionLengthChange = function(time) {
      if(!timerIsRunning) {
        $scope.sessionLength += time
        if ($scope.sessionLength < 0) {
          $scope.sessionLength = 0
        }
        if ($scope.seesionLength > 59) {
          $scope.sessionLength = 59
        }
        $scope.timeLeft = $scope.sessionLength
      }
    }

    $scope.toggleTimer = function() {
      if (!timerIsRunning) {
        if ($scope.currentName === 'Session') {
          $scope.currentLength = $scope.sessionLength
        } else {
          $scope.currentLength = $scope.breakLength
        }

        updateTimer()
        timerIsRunning = $interval(updateTimer, 1000)
      }
    }

    function updateTimer() {
      secs -= 1
      console.log(secs)
      $scope.timeLeft = timeConverter(secs)
      console.log($scope.timeLeft)
    }

    function timeConverter(seconds) {
      var d = Number(seconds)
      var m = Math.floor(d % 3600 / 60)
      var s = Math.floor(d % 3600 % 60)
      return m + ":" + s
    }

  }]) // End of MainController

}()); // End of IIFE
