function PomCtrl($scope, $timeout) {
  $scope.counter = 25;

  $scope.countdown = function() {
    $scope.counter--;

    if ($scope.counter > 0) {
      timer = $timeout($scope.countdown, 1000);
    } 
  }

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
      timer = $timeout($scope.countdown, 1000);
      running = true;
    }
  }
}
