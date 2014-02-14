function PomCtrl($scope, $timeout) {
  $scope.longbreak = 15 * 60;
  $scope.shortbreak = 5 * 60;
  $scope.pomodoro = 25 * 60;

  $scope.state = PomEnum.Pomodoro;
  $scope.pomrun = 3;
  $scope.poms = 0;

  $scope.counter = $scope.pomodoro;

  $scope.countdown = function() {
    $scope.counter--;

    if ($scope.counter > 0) {
      timer = $timeout($scope.countdown, second);
    } else {
      state_update();
      sendNotification("Time is up", { body: $scope.state + " time now"});
      running = false;
    }
  }

  var second = 1000;
  var timer;
  var running = false;

  $scope.reset = function() {
    $scope.pause();
    switch ($scope.state) {
      case PomEnum.Pomodoro:
        $scope.counter = $scope.pomodoro;
        break;
      case PomEnum.Short:
        $scope.counter = $scope.shortbreak;
        break;
      case PomEnum.Long:
        $scope.counter = $scope.longbreak;
        break;
    }
  }
  
  $scope.pause = function() {
    if (running)
      running = !$timeout.cancel(timer);
  }
  
  $scope.start = function() {
    if (!running) {
      timer = $timeout($scope.countdown, second);
      running = true;
    }
  }

  $scope.minutes = function() {
    //return Math.floor($scope.counter / 60)
    return padzero(~~($scope.counter / 60), 2);
  }

  $scope.seconds = function() {
    return padzero($scope.counter % 60, 2);
  }

  function state_update() {
    switch ($scope.state) {
      case PomEnum.Pomodoro:
        $scope.poms++;
        if (($scope.poms % $scope.pomrun) === 0) {
          $scope.state = PomEnum.Long;
          $scope.counter = $scope.longbreak;
        } else {
          $scope.state = PomEnum.Short;
          $scope.counter = $scope.shortbreak;
        }
        break;
      case PomEnum.Short:
      case PomEnum.Long:
        $scope.state = PomEnum.Pomodoro;
        $scope.counter = $scope.pomodoro;
        break;
    }
  }
}

var PomEnum = {
  Pomodoro: "Pomodoro",
  Short: "Short Break",
  Long: "Long Break",
}

function padzero(number, width) {
  var str = number + "";
  while (str.length < width) {
    str = "0" + str;
  }
  return str;
}
