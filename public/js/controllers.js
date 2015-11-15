(function() {
angular.module('pomato', [])
.controller('PomCtrl', ['$timeout', PomCtrl]);

function PomCtrl($timeout) {
  var self = this;
  self.longbreak = 15;
  self.shortbreak = 5;
  self.pomodoro = 25;

  self.state = PomEnum.Pomodoro;
  self.pomrun = 3;
  self.poms = 0;

  self.counter = self.pomodoro * 60;
  self.running = false;

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
      self.running = false;
    }
  };

  var second = 1000;
  var timer;

  self.reset = function() {
    self.pause();
    switch (self.state) {
      case PomEnum.Pomodoro:
        self.counter = self.pomodoro;
        break;
      case PomEnum.Short:
        self.counter = self.shortbreak;
        break;
      case PomEnum.Long:
        self.counter = self.longbreak;
        break;
    }
    self.counter = self.counter * 60;
  };
  
  self.pause = function() {
    if (self.running)
      self.running = !$timeout.cancel(timer);
  };
  
  self.start = function() {
    if (!self.running) {
      time = new Date().getTime();
      timer = $timeout(self.countdown, second);
      self.running = true;
    }
  };

  self.remaining = function() {
    return padzero(~~(self.counter / 60), 2) +
      ":" +
      padzero(~~(self.counter % 60), 2);
  };

  self.title = function () {
    return self.remaining() + " remaing";
  };

  function state_update() {
    switch (self.state) {
      case PomEnum.Pomodoro:
        self.poms++;
        if ((self.poms % self.pomrun) === 0) {
          self.state = PomEnum.Long;
          self.counter = self.longbreak;
        } else {
          self.state = PomEnum.Short;
          self.counter = self.shortbreak;
        }
        break;
      case PomEnum.Short:
      case PomEnum.Long:
        self.state = PomEnum.Pomodoro;
        self.counter = self.pomodoro;
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
