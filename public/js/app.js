(function() {
angular.module('pomato', [])
.value('millisPer', { second: 1000, minute: 60 * 1000 })
.factory('SettingsSvc', [SettingsSvc])
.factory('TimerSvc', ['$timeout', 'SettingsSvc', 'millisPer', TimerSvc])
.controller('PomCtrl', ['SettingsSvc', 'TimerSvc', 'millisPer', PomCtrl]);

function SettingsSvc() {
  return {
    longbreak: 15,
    shortbreak: 5,
    pomodoro: 25,
    pomrun: 3
  };
}

function TimerSvc($timeout, settings, millisPer) {
  var self = {};

  // Pomato state
  self.state = PomEnum.Pomodoro;
  self.poms = 0;

  // Timer
  self.counter = minutesToMillis(settings.pomodoro);
  self.running = false;

  // Actions
  self.reset = reset;
  self.pause = pause;
  self.start = start;

  var time;

  function countdown() {
    var now = new Date().getTime();
    var elapsed = now - time;
    self.counter -= elapsed;
    time = now;

    if (self.counter > 0) {
      timer = $timeout(countdown, refreshInterval);
    } else {
      state_update();
      sendNotification("Time is up", { body: self.state + " time now"});
      self.running = false;
    }
  }

  var refreshInterval = 1000;
  var timer;

  function reset() {
    self.pause();
    switch (self.state) {
      case PomEnum.Pomodoro:
        self.counter = minutesToMillis(settings.pomodoro);
        break;
      case PomEnum.Short:
        self.counter = minutesToMillis(settings.shortbreak);
        break;
      case PomEnum.Long:
        self.counter = minutesToMillis(settings.longbreak);
        break;
    }
  }
  
  function pause() {
    if (self.running) {
      self.running = !$timeout.cancel(timer);
    }
  }
  
  function start() {
    if (!self.running) {
      time = new Date().getTime();
      timer = $timeout(countdown, refreshInterval);
      self.running = true;
    }
  }

  function state_update() {
    switch (self.state) {
      case PomEnum.Pomodoro:
        self.poms++;
        if ((self.poms % settings.pomrun) === 0) {
          self.state = PomEnum.Long;
          self.counter = minutesToMillis(settings.longbreak);
        } else {
          self.state = PomEnum.Short;
          self.counter = minutesToMillis(settings.shortbreak);
        }
        break;
      case PomEnum.Short:
      case PomEnum.Long:
        self.state = PomEnum.Pomodoro;
        self.counter = minutesToMillis(settings.pomodoro);
        break;
    }
  }

  function minutesToMillis(minutes) {
    return minutes * millisPer.minute;
  }

  return self;
}

function PomCtrl(settings, timer, millisPer) {
  var self = this;
  // Settings
  self.settings = settings;

  self.timer = timer;

  // Display
  self.remaining = remaining;
  self.title = title;

  function remaining() {
    var secondsRemaining = timer.counter / millisPer.second;
    return padzero(~~(secondsRemaining / 60), 2) +
      ":" +
      padzero(~~(secondsRemaining % 60), 2);
  }

  function title() {
    return remaining() + " remaing";
  }

  function padzero(number, width) {
    var str = number + "";
    while (str.length < width) {
      str = "0" + str;
    }
    return str;
  }
}

var PomEnum = {
  Pomodoro: "Pomodoro",
  Short: "Short Break",
  Long: "Long Break",
};
})();
