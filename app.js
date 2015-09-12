(function() {
  var myApp = angular.module('myApp', []);

  myApp.controller('MainController', ['$scope', '$interval', function($scope, $interval){

    var defaultBreakLength = 300        // 5:00 min
    var defaultSessionLength = 1500     // 25:00 min

    // Variables for the amount of pomodoro sessions left/completed.
    $scope.displayPomodoroSetCount = 0
    $scope.displayTimerStarted = false
    $scope.displaySessionOver = false
    $scope.pomodoroSessionsArray = []
    var pomodoroSessionsCompleted = 0

    // Variables for highlighting pomodoros
    $scope.elPomodoroOneImage = document.getElementById('pomodoroOneImage')
    $scope.elPomodoroTwoImage = document.getElementById('pomodoroTwoImage')
    $scope.elPomodoroThreeImage = document.getElementById('pomodoroThreeImage')
    $scope.elPomodoroFourImage = document.getElementById('pomodoroFourImage')

    $scope.displayTomatoOneIsClicked = false
    $scope.displayTomatoTwoIsClicked = false
    $scope.displayTomatoThreeIsClicked = false
    $scope.displayTomatoFourIsClicked = false

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
      }
    }

    $scope.sessionLengthChange = function(time) {
      if(!sessionTimer.isRunning) {
        sessionTimer.incrementSessionLength(time)
        $scope.displaySessionLength = sessionTimer.display(sessionTimer.sessionLength)
        $scope.colorFillTime = currentTimer.sessionLength
      }
    }

    $scope.setSessionsAndHighlight = function(number) {
      $scope.displayPomodoroSetCount = number
      $scope.pomodoroSessionsArray = makeArray()

      resetHighlights()
      switch (number) {
          case 1:
            $scope.displayTomatoOneIsClicked = true
            $scope.elPomodoroOneImage.src = "images/tomatoHighlightOne.png"
            break;

          case 2:
            $scope.displayTomatoTwoIsClicked = true
            $scope.elPomodoroTwoImage.src = "images/tomatoHighlightTwo.png"
            break;

          case 3:
            $scope.displayTomatoThreeIsClicked = true
            $scope.elPomodoroThreeImage.src = "images/tomatoHighlightThree.png"
            break;

          default:
            $scope.displayTomatoFourIsClicked = true
            $scope.elPomodoroFourImage.src = "images/tomatoHighlightFour.png"
            break;
      }
      console.log($scope.displayPomodoroSetCount)
    }

    function resetHighlights() {
        $scope.elPomodoroOneImage.src = "images/tomatoOne.png"
        $scope.elPomodoroTwoImage.src = "images/tomatoTwo.png"
        $scope.elPomodoroThreeImage.src = "images/tomatoThree.png"
        $scope.elPomodoroFourImage.src = "images/tomatoFour.png"
        $scope.displayTomatoOneIsClicked = false
        $scope.displayTomatoTwoIsClicked = false
        $scope.displayTomatoThreeIsClicked = false
        $scope.displayTomatoFourIsClicked = false

    }

    $scope.hoverAndHighlight = function(number) {
        switch (number) {
            case 1:
              $scope.elPomodoroOneImage.src='images/tomatoHighlightOne.png'
              $scope.elPomodoroOneImage.addEventListener('mouseout', function() {
                  if(!($scope.displayTomatoOneIsClicked)) {
                      $scope.elPomodoroOneImage.src='images/tomatoOne.png'
                  }
              })
              break;

            case 2:
              $scope.elPomodoroTwoImage.src='images/tomatoHighlightTwo.png'
              $scope.elPomodoroTwoImage.addEventListener('mouseout', function() {
                  if(!($scope.displayTomatoTwoIsClicked)) {
                      $scope.elPomodoroTwoImage.src='images/tomatoTwo.png'
                  }
              })
              break;

            case 3:
              $scope.elPomodoroThreeImage.src='images/tomatoHighlightThree.png'
              $scope.elPomodoroThreeImage.addEventListener('mouseout', function() {
                  if(!($scope.displayTomatoThreeIsClicked)) {
                      $scope.elPomodoroThreeImage.src='images/tomatoThree.png'
                  }
              })
              break;

            default:
              $scope.elPomodoroFourImage.src='images/tomatoHighlightFour.png'
              $scope.elPomodoroFourImage.addEventListener('mouseout', function() {
                  if(!($scope.displayTomatoFourIsClicked)) {
                      $scope.elPomodoroFourImage.src='images/tomatoFour.png'
                  }
              })
              break;
        }
    }

    $scope.toggleTimer = function() {               // Pause and start Timer.
      if (!$scope.displayPomodoroSetCount) return;
      if (currentTimer.isRunning) {
        $interval.cancel(currentTimer.intervalId)
        currentTimer.isRunning = false
      } else {
        $scope.displayTimerStarted = true
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

    function makeArray() {
      var arr = []
      for (var i = 0; i < $scope.displayPomodoroSetCount; i++ ) {
        arr.push(false)
      }
      return arr
    }

    function switchTimer() {
      $interval.cancel(currentTimer.intervalId)
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
      currentTimer.intervalId = $interval(updateTimer, 1000)
    }

    function crossOutPomodoro() {
      $scope.pomodoroSessionsArray[pomodoroSessionsCompleted] = true
      pomodoroSessionsCompleted++
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


    //Ignore this nonsense
/*
    $scope.elPomodoroOneImage.addEventListener('mouseover', function() {
        $scope.elPomodoroOneImage.src='images/tomatoHighlightOne.png'
    })

    $scope.elPomodoroOneImage.addEventListener('mouseout', function() {
        $scope.elPomodoroOneImage.src='images/tomatoOne.png'
    })

    $scope.elPomodoroTwoImage.addEventListener('mouseover', function() {
        $scope.elPomodoroTwoImage.src='images/tomatoHighlightTwo.png'
    })

    $scope.elPomodoroTwoImage.addEventListener('mouseout', function() {
        $scope.elPomodoroTwoImage.src='images/tomatoTwo.png'
    })

    $scope.elPomodoroThreeImage.addEventListener('mouseover', function() {
        $scope.elPomodoroThreeImage.src='images/tomatoHighlightThree.png'
    })

    $scope.elPomodoroThreeImage.addEventListener('mouseout', function() {
        $scope.elPomodoroThreeImage.src='images/tomatoThree.png'
    })

    $scope.elPomodoroFourImage.addEventListener('mouseover', function() {
        $scope.elPomodoroFourImage.src='images/tomatoHighlightFour.png'
    })

    $scope.elPomodoroFourImage.addEventListener('mouseout', function() {
        $scope.elPomodoroFourImage.src='images/tomatoFour.png'
    })
*/

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
