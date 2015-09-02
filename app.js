(function() {
  var myApp = angular.module('myApp', []);

  myApp.controller('MainController', ['$scope', '$interval', function($scope, $interval){

    var defaultBreakLength = 60
    var defaultSessionLength = 60

    // Variables for the amount of pomodoro sessions left/completed.
    $scope.displayPomodoroSetCount = 0
    $scope.displayTimerStarted = false
    $scope.displaySessionOver = false
    $scope.pomodoroSessionsArray = []
    var pomodoroSessionsCompleted = 0

    //Timer Objects and their display equivalents.
    var sessionTimer = new Timer('Session', defaultSessionLength)
    $scope.displaySessionLength = sessionTimer.display(defaultSessionLength)

    var breakTimer = new Timer('Break!', defaultBreakLength)
    $scope.displayBreakLength = breakTimer.display(defaultBreakLength)

    var currentTimer = sessionTimer
    $scope.displaySessionName = currentTimer.name

    // Variables for Timer and Angular/CSS fill effects
    $scope.fillHeight = '0%'
    $scope.colorFillTime = currentTimer.sessionLength


    $scope.breakLengthChange = function(time) {
      if (!breakTimer.isRunning) {
        breakTimer.incrementSessionLength(time)
        $scope.displayBreakLength = breakTimer.display(breakTimer.sessionLength)
        $scope.colorFillTime = currentTimer.sessionLength
        console.log(breakTimer.sessionLength)
      }
    }

    $scope.sessionLengthChange = function(time) {
      if(!sessionTimer.isRunning) {
        sessionTimer.incrementSessionLength(time)
        $scope.displaySessionLength = sessionTimer.display(sessionTimer.sessionLength)
        $scope.colorFillTime = currentTimer.sessionLength
        console.log(sessionTimer.sessionLength)
      }
    }

    $scope.setSessions = function(n) {
      $scope.displayPomodoroSetCount = n
      console.log($scope.displayPomodoroSetCount)
    }

    $scope.toggleTimer = function() {                 // Pause and start the timer.
      if (!$scope.displayPomodoroSetCount) return;
      if (currentTimer.isRunning) {
        $interval.cancel(currentTimer.intervalId)
        currentTimer.isRunning = false
      } else {
        console.log(currentTimer.name)
        $scope.displayTimerStarted = true
        $scope.pomodoroSessionsArray = Array($scope.displayPomodoroSetCount)
        //updateTimer()
        resetAndRun()
      }
    }

    function updateTimer() {
      currentTimer.tick()
      if (currentTimer.timeLeft < 0) {
        if (currentTimer.name === 'Session') crossOutPomodoro();
        if (pomodoroSessionsCompleted === $scope.displayPomodoroSetCount) finish();

        switchTimer()
        $scope.colorFillTime = currentTimer.sessionLength
        resetAndRun()

      } else {
        $scope.displayTimeLeft = currentTimer.display(currentTimer.timeLeft)
        displayColorFill(currentTimer.timeLeft)
      }
    }

    function switchTimer() {
      if (currentTimer === sessionTimer) {
        currentTimer = breakTimer
      } else {
        currentTimer = sessionTimer
      }
      $scope.displaySessionName = currentTimer.name
      currentTimer.timeLeft = currentTimer.sessionLength
    }

    function resetAndRun() {
      if (currentTimer.intervalId) $interval.cancel(currentTimer.intervalId);
      currentTimer.isRunning = true
      currentTimer.intervalId = $interval(updateTimer, 100)
    }

    function crossOutPomodoro() {
      $scope.pomodoroSessionsArray[pomodoroSessionsCompleted] = true
      pomodoroSessionsCompleted++
      console.log(pomodoroSessionsCompleted)
    }

    function displayColorFill(secs) {
      var denom = $scope.colorFillTime
      var perc = Math.abs((secs / denom) * 100 - 100)
      $scope.fillColor = '#E3E356'
      $scope.fillHeight = perc + '%'
    }

    function finish() {
      console.log(pomodoroSessionsCompleted === $scope.displayPomodoroSetCount)
      $scope.displayTimerStarted = false
      $scope.displaySessionOver = true
      $interval.cancel(currentTimer.intervalId)
      currentTimer.isRunning = false
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

  Timer.prototype.format = function(seconds) {
    var d = Number(seconds)
    var m = Math.floor(d % 3600 / 60)
    var s = Math.floor(d % 3600 % 60)
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  Timer.prototype.display = function(secs) {
    return this.format(secs)
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
