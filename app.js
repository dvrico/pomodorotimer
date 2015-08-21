(function() {
  var myApp = angular.module('myApp', []);

  myApp.controller('MainController', function(){
    this.breakLength = 5
    this.sessionLength = 25

    this.breakLengthChange = function(time) {
      this.breakLength += time
      if (this.breakLength < 0) {
        this.breakLength = 0
      }
    }

    this.sessionLengthChange = function(time) {
      this.sessionLength += time
      if (this.sessionLength < 0) {
        this.sessionLength = 0
      }
    }

  }) // End of MainController

}()); // End of IIFE
