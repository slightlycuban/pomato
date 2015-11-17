(function() {
angular.module('pomato', [])
.controller('PomCtrl', ['$timeout', PomCtrl]);

function PomCtrl($timeout) {
  var self = this;
  // Settings
  self.longbreak = 15;
  self.shortbreak = 5;
  self.pomodoro = 25;
  self.pomrun = 3;

  // Pomato state
  self.state = PomEnum.Pomodoro;
  self.poms = 0;

  // Timer
  var counter = self.pomodoro * 60;
  self.running = false;

  // Actions
  self.reset = reset;
  self.pause = pause;
  self.start = start;

  // Display
  self.remaining = remaining;
  self.title = title;

  var time;

  function countdown() {
    var now = new Date().getTime();
    var elapsed = now - time;
    counter -= (elapsed / second);
    time = now;

    if (counter > 0) {
      timer = $timeout(countdown, second);
    } else {
      state_update();
      sendNotification("Time is up", { body: self.state + " time now"});
      self.running = false;
    }
  }

  var second = 1000;
  var timer;

  function reset() {
    self.pause();
    switch (self.state) {
      case PomEnum.Pomodoro:
        counter = self.pomodoro;
        break;
      case PomEnum.Short:
        counter = self.shortbreak;
        break;
      case PomEnum.Long:
        counter = self.longbreak;
        break;
    }
    counter = counter * 60;
  }
  
  function pause() {
    if (self.running) {
      self.running = !$timeout.cancel(timer);
    }
  }
  
  function start() {
    if (!self.running) {
      time = new Date().getTime();
      timer = $timeout(countdown, second);
      self.running = true;
    }
  }

  function remaining() {
    return padzero(~~(counter / 60), 2) +
      ":" +
      padzero(~~(counter % 60), 2);
  }

  function title() {
    return self.remaining() + " remaing";
  }

  function state_update() {
    switch (self.state) {
      case PomEnum.Pomodoro:
        self.poms++;
        if ((self.poms % self.pomrun) === 0) {
          self.state = PomEnum.Long;
          counter = self.longbreak;
        } else {
          self.state = PomEnum.Short;
          counter = self.shortbreak;
        }
        break;
      case PomEnum.Short:
      case PomEnum.Long:
        self.state = PomEnum.Pomodoro;
        counter = self.pomodoro;
        break;
    }

    counter = counter * 60;
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
