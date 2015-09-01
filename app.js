(function() {
  var myApp = angular.module('myApp', []);

  myApp.controller('MainController', ['$scope', '$interval', function($scope, $interval){

    // Variables for HTML
    // $scope.breakLength = 1
    // $scope.sessionLength = 1
    var defaultBreakLength = 60
    var defaultSessionLength = 60
    //$scope.timeLeft = $scope.sessionLength
    $scope.sessionName = 'Session'
    // Variables for the amount of pomodoro sessions left/completed.
    $scope.sessionCount = 0
    $scope.sessionsCompleted = 0
    $scope.sessions = []
    $scope.displayTimerStarted = false
    $scope.displaySessionOver = false

    //Timer Objects and their display equivalents.
    var sessionTimer = new Timer('Session', defaultSessionLength)
    $scope.displaySessionLength = sessionTimer.display(defaultSessionLength)

    var breakTimer = new Timer('Break!', defaultBreakLength)
    $scope.displayBreakLength = breakTimer.display(defaultBreakLength)

    var currentTimer = sessionTimer

    // Variables for Timer and Angular/CSS fill effects
    //var timerIsRunning = false
    //var secs = 60 * $scope.timeLeft
    $scope.fillHeight = '0%'
    $scope.originalTime = $scope.sessionLength        // This is needed here for the
                                                      // first round of css fill effects.

    $scope.breakLengthChange = function(time) {       // Change timer length only
      if (!breakTimer.isRunning) {
        breakTimer.incrementSessionLength(time)
        $scope.displayBreakLength = breakTimer.display(breakTimer.sessionLength)
        console.log(breakTimer.sessionLength)
        // if ($scope.breakLength < 1) {
        //   $scope.breakLength = 1
        // }
        // if ($scope.sessionName === 'Break!') {
        //   $scope.timeLeft = $scope.breakLength
        //   secs = 60 * $scope.breakLength
        // }
      }
    }

    $scope.sessionLengthChange = function(time) {     // Change timer length only
      if(!sessionTimer.isRunning) {
        sessionTimer.incrementSessionLength(time)
        $scope.displaySessionLength = sessionTimer.display(sessionTimer.sessionLength)
        console.log(sessionTimer.sessionLength)
        // if($scope.sessionName === 'Session') {
        //   $scope.sessionLength += time
        //   if ($scope.sessionLength < 1) {
        //     $scope.sessionLength = 1
        //   }
        //   if ($scope.seesionLength > 59) {
        //     $scope.sessionLength = 59
        //   }
        //   $scope.timeLeft = $scope.sessionLength
        //   $scope.originalTime = $scope.sessionLength
        //   secs = 60 * $scope.sessionLength
        // }
      }
    }

    $scope.setSessions = function(n) {
      $scope.sessionCount = n
      console.log($scope.sessionCount)
    }

    $scope.toggleTimer = function() {                 // Start timer.
      if (!$scope.sessionCount) return;
      if (currentTimer.isRunning) {
        $interval.cancel(currentTimer.intervalId)
        currentTimer.isRunning = false
      } else {
        $scope.displayTimerStarted = true
        $scope.sessions = Array($scope.sessionCount)
        updateTimer()
        currentTimer.isRunning = true
        currentTimer.intervalId = $interval(updateTimer, 100)
      }


      //if (!breakTimer.isRunning &&)

      //else {                                      // Pause and resume Timer.
      //   if (!$scope.displaySessionOver) {
      //     $interval.cancel(timerIsRunning)
      //     timerIsRunning = false
      //   }
      // }
    }

    function updateTimer() {
      //secs -= 1
      currentTimer.tick()
      if (currentTimer.timeLeft < 0) {
          //if no time left, did we finish?
        //if (currentTimer.name === 'Break!') {        // Switch over to Session Time.
          //Method switchTimer function out of the class
          //Juggle states = application level functions
          //Data for single objects/etc, use methods

          $scope.sessionName = 'Session'
          $scope.timeLeft = 60 * $scope.sessionLength
          $scope.originalTime = $scope.sessionLength
          secs = 60 * $scope.sessionLength
        //} else {                                      // Switch over to Break Time.

          // Cross out a tomato in the current set.
          $scope.sessions[$scope.sessionsCompleted] = true
          $scope.sessionsCompleted++
          console.log($scope.sessionsCompleted)

          // Ends the session.
          if ($scope.sessionsCompleted === $scope.sessionCount) {
            console.log($scope.sessionsCompleted === $scope.sessionCount)
            $scope.displayTimerStarted = false
            $scope.displaySessionOver = true
            $interval.cancel(timerIsRunning)
            timerIsRunning = false
          }

          $scope.sessionName = 'Break!'
          $scope.timeLeft = 60 * $scope.breakLength
          $scope.originalTime = $scope.breakLength
          secs = 60 * $scope.breakLength
      
      } else {
        $scope.fillColor = '#E3E356'
        $scope.timeLeft = timeConverter(secs)         // Guts of the Timer.
                                                      // And Angular/CSS fill effects.
        var denom = 60 * $scope.originalTime
        var perc = Math.abs((secs / denom) * 100 - 100)
        // console.log(denom)
        // console.log(perc)
        $scope.fillHeight = perc + '%'
      }
    }

  }]) // End of MainController

  function Timer(name, sessionLength) {
    this.name = name
    this.sessionLength = sessionLength
    this.timeLeft = sessionLength
    this.isRunning = false
    this.intervalId = null
  }

  Timer.prototype.tick = function() {
    if (this.isRunning) {
      this.timeLeft--
    }
  }

  Timer.prototype.pause = function() {
    this.isRunning = false
  }

  Timer.prototype.reset = function() {
    this.timeLeft = this.sessionLength
  }

  Timer.prototype.format = function(seconds) {
    var d = Number(seconds)
    var m = Math.floor(d % 3600 / 60)
    var s = Math.floor(d % 3600 % 60)
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }

  Timer.prototype.display = function(timeOfSession) {
    return this.format(timeOfSession)
  }

  Timer.prototype.incrementSessionLength = function(time) {
    this.sessionLength += (time * 60)
    if (this.sessionLength <= 0)  {
      this.sessionLength = 60
    }
    if (this.sessionLength >= 3540) {
      this.sessionLength = 3540
    }
    this.timeLeft = this.sessionLength
  }

}()); // End of IIFE
