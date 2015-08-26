(function() {
  var myApp = angular.module('myApp', []);

  myApp.controller('MainController', ['$scope', '$interval', function($scope, $interval){

    // Variables for HTML
    $scope.breakLength = 1
    $scope.sessionLength = 1
    $scope.timeLeft = $scope.sessionLength
    $scope.sessionName = 'Session'

    // Variables for Timer and Angular/CSS fill effects
    var timerIsRunning = false
    var secs = 60 * $scope.timeLeft
    $scope.fillHeight = '0%'
    $scope.originalTime = $scope.sessionLength        // This is needed here for the
                                                      // first round of css fill effects.

    $scope.breakLengthChange = function(time) {       // Change timer length only
      if (!timerIsRunning) {                          // when Timer is not running.
        $scope.breakLength += time
        if ($scope.breakLength < 1) {
          $scope.breakLength = 1
        }
        if ($scope.sessionName === 'Break!') {
          $scope.timeLeft = $scope.breakLength
          secs = 60 * $scope.breakLength
        }
      }
    }

    $scope.sessionLengthChange = function(time) {     // Change timer length only
      if(!timerIsRunning) {                           // when Timer is not running.
        if($scope.sessionName === 'Session') {
          $scope.sessionLength += time
          if ($scope.sessionLength < 1) {
            $scope.sessionLength = 1
          }
          if ($scope.seesionLength > 59) {
            $scope.sessionLength = 59
          }
          $scope.timeLeft = $scope.sessionLength
          $scope.originalTime = $scope.sessionLength
          secs = 60 * $scope.sessionLength
        }
      }
    }

    $scope.toggleTimer = function() {
      if (!timerIsRunning) {                          // Start timer.
        updateTimer()
        timerIsRunning = $interval(updateTimer, 100)
      } else {                                        // Pause and resume Timer.
        $interval.cancel(timerIsRunning)
        timerIsRunning = false
      }
    }

    function updateTimer() {
      secs -= 1
      if ( secs < 0) {

        if ($scope.sessionName === 'Break!') {        // Switch over to Session Time.
          $scope.sessionName = 'Session'
          $scope.timeLeft = 60 * $scope.sessionLength
          $scope.originalTime = $scope.sessionLength
          secs = 60 * $scope.sessionLength
        } else {                                      // Switch over to Break Time.
          $scope.sessionName = 'Break!'
          $scope.timeLeft = 60 * $scope.breakLength
          $scope.originalTime = $scope.breakLength
          secs = 60 * $scope.breakLength
        }
      } else {
        console.log($scope.sessionName)
        if ($scope.sessionName === 'Break!') {
          $scope.fillColor = '#fff'
        } else {
          $scope.fillColor = '#fff'
        }
        $scope.timeLeft = timeConverter(secs)         // Guts of the Timer.
                                                      // And Angular/CSS fill effects.
        var denom = 60 * $scope.originalTime
        var perc = Math.abs((secs / denom) * 100 - 100)
        console.log(denom)
        console.log(perc)
        $scope.fillHeight = perc + '%'
      }
    }

    function timeConverter(seconds) {
      var d = Number(seconds)
      var m = Math.floor(d % 3600 / 60)
      var s = Math.floor(d % 3600 % 60)
      return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    }

  }]) // End of MainController

}()); // End of IIFE
