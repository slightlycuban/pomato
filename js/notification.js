// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

function sendNotification (title, options) {
  // Memoize based on feature detection.
  if ("Notification" in window) {
    sendNotification = function (title, options) {
      new Notification(title, options);
    };
  } else if ("mozNotification" in navigator) {
    sendNotification = function (title, options) {
      // Gecko < 22
      navigator.mozNotification
               .createNotification(title, options.body, options.icon)
               .show();
    };
  } else {
    sendNotification = function (title, options) {
      alert(title + ": " + options.body);
    };
  }
  sendNotification(title, options);
};

