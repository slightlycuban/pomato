function PomCtrl($scope, $timeout) {
  $scope.longbreak = 15;
  $scope.shortbreak = 5;
  $scope.pomodoro = 25;

  $scope.state = 0;
  $scope.pomrun = 3;
  $scope.poms = 0;

  $scope.counter = 25;

  $scope.countdown = function() {
    $scope.counter--;

    if ($scope.counter > 0) {
      timer = $timeout($scope.countdown, second);
    } else {
      state_update();
      running = false;
    }
  }

  var second = 10;
  var timer;
  var running = false;

  $scope.reset = function() {
    $scope.pause();
    $scope.counter = 25;
    $scope.start();
  }
  
  $scope.pause = function() {
    if (running)
      running = $timeout.cancel(timer);
  }
  
  $scope.start = function() {
    if (!running) {
      timer = $timeout($scope.countdown, second);
      running = true;
    }
  }

  function state_update() {
    switch ($scope.state) {
      case 0:
        $scope.poms++;
        if (($scope.poms % $scope.pomrun) === 0) {
          $scope.state = 2;
          $scope.counter = $scope.longbreak;
        } else {
          $scope.state = 1;
          $scope.counter = $scope.shortbreak;
        }
        break;
      case 1:
      case 2:
        $scope.state = 0;
        $scope.counter = $scope.pomodoro;
        break;
    }
  }
}
