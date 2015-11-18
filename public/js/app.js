(function() {
angular.module('pomato', [])
.factory('SettingsSvc', [SettingsSvc])
.factory('TimerSvc', ['$timeout', 'SettingsSvc', TimerSvc])
.controller('PomCtrl', ['SettingsSvc', 'TimerSvc', PomCtrl]);

function SettingsSvc() {
  return {
    longbreak: 15,
    shortbreak: 5,
    pomodoro: 25,
    pomrun: 3
  };
}

function TimerSvc($timeout, settings) {
  var self = {};
  // Settings
  self.settings = settings;

  // Pomato state
  self.state = PomEnum.Pomodoro;
  self.poms = 0;

  // Timer
  self.counter = self.settings.pomodoro * 60;
  self.running = false;

  // Actions
  self.reset = reset;
  self.pause = pause;
  self.start = start;

  // Display
  self.remaining = remaining;

  var time;

  function countdown() {
    var now = new Date().getTime();
    var elapsed = now - time;
    self.counter -= (elapsed / second);
    time = now;

    if (self.counter > 0) {
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
        self.counter = self.settings.pomodoro;
        break;
      case PomEnum.Short:
        self.counter = self.settings.shortbreak;
        break;
      case PomEnum.Long:
        self.counter = self.settings.longbreak;
        break;
    }
    self.counter = self.counter * 60;
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
    return padzero(~~(self.counter / 60), 2) +
      ":" +
      padzero(~~(self.counter % 60), 2);
  }

  function state_update() {
    switch (self.state) {
      case PomEnum.Pomodoro:
        self.poms++;
        if ((self.poms % self.settings.pomrun) === 0) {
          self.state = PomEnum.Long;
          self.counter = self.settings.longbreak;
        } else {
          self.state = PomEnum.Short;
          self.counter = self.settings.shortbreak;
        }
        break;
      case PomEnum.Short:
      case PomEnum.Long:
        self.state = PomEnum.Pomodoro;
        self.counter = self.settings.pomodoro;
        break;
    }

    self.counter = self.counter * 60;
  }

  return self;
}

function PomCtrl(settings, timer) {
  var self = this;
  // Settings
  self.settings = settings;

  self.timer = timer;

  // Display
  self.remaining = timer.remaining;
  self.title = title;

  function title() {
    return self.remaining() + " remaing";
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
