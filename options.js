function restoreOptions() {
  chrome.storage.sync.get({
    softRefreshMinutes: 5,
    hardRefreshMinutes: 120
  }, function (options) {
    document.getElementById('soft-interval').value = options.softRefreshMinutes;
    document.getElementById('hard-interval').value = options.hardRefreshMinutes;
  });
}

function saveOptions() {
  var softInterval = document.getElementById('soft-interval').value;
  var hardInterval = document.getElementById('hard-interval').value;

  chrome.storage.sync.set({
    softRefreshMinutes: softInterval,
    hardRefreshMinutes: hardInterval
  }, function () {
    // inform user that settings were saved
    var statusPar = document.getElementById('status-par');
    statusPar.textContent = 'Options saved.';
    setTimeout(function () {
      statusPar.textContent = '';
    }, 750);
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save-button').addEventListener('click', saveOptions);
