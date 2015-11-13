(function() {
angular.module('pomato', [])
.controller('PomCtrl', ['$scope', '$timeout', PomCtrl]);

function PomCtrl($scope, $timeout) {
  var self = this;
  $scope.longbreak = 15;
  $scope.shortbreak = 5;
  $scope.pomodoro = 25;

  self.state = PomEnum.Pomodoro;
  $scope.pomrun = 3;
  $scope.poms = 0;

  self.counter = $scope.pomodoro * 60;
  $scope.running = false;

  var time;

  self.countdown = function() {
    var now = new Date().getTime();
    var elapsed = now - time;
    self.counter -= (elapsed / second);
    time = now;

    if (self.counter > 0) {
      timer = $timeout(self.countdown, second);
    } else {
      state_update();
      sendNotification("Time is up", { body: self.state + " time now"});
      $scope.running = false;
    }
  };

  var second = 1000;
  var timer;

  self.reset = function() {
    self.pause();
    switch (self.state) {
      case PomEnum.Pomodoro:
        self.counter = $scope.pomodoro;
        break;
      case PomEnum.Short:
        self.counter = $scope.shortbreak;
        break;
      case PomEnum.Long:
        self.counter = $scope.longbreak;
        break;
    }
    self.counter = self.counter * 60;
  };
  
  self.pause = function() {
    if ($scope.running)
      $scope.running = !$timeout.cancel(timer);
  };
  
  self.start = function() {
    if (!$scope.running) {
      time = new Date().getTime();
      timer = $timeout(self.countdown, second);
      $scope.running = true;
    }
  };

  self.minutes = function() {
    //return Math.floor(self.counter / 60)
    return padzero(~~(self.counter / 60), 2);
  };

  self.seconds = function() {
    return padzero(~~(self.counter % 60), 2);
  };

  function state_update() {
    switch (self.state) {
      case PomEnum.Pomodoro:
        $scope.poms++;
        if (($scope.poms % $scope.pomrun) === 0) {
          self.state = PomEnum.Long;
          self.counter = $scope.longbreak;
        } else {
          self.state = PomEnum.Short;
          self.counter = $scope.shortbreak;
        }
        break;
      case PomEnum.Short:
      case PomEnum.Long:
        self.state = PomEnum.Pomodoro;
        self.counter = $scope.pomodoro;
        break;
    }

    self.counter = self.counter * 60;
  }
}

var PomEnum = {
  Pomodoro: "Pomodoro",
  Short: "Short Break",
  Long: "Long Break",
};

function padzero(number, width) {
  var str = number + "";
  while (str.length < width) {
    str = "0" + str;
  }
  return str;
}
})();
