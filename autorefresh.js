var softAlarmName = 'com.ondrahosek.webext.autorefresh-on-demand.soft';
var hardAlarmName = 'com.ondrahosek.webext.autorefresh-on-demand.hard';
var tabContents = {};

function updateAlarms()
{
  // clear the old alarms
  chrome.alarms.clear(softAlarmName, function (wasCleared) {
    chrome.alarms.clear(hardAlarmName, function (wasCleared) {
      // load the properties
      chrome.storage.sync.get({
        softRefreshMinutes: 5,
        hardRefreshMinutes: 120
      }, function (options) {
        // set up the new alarms
        chrome.alarms.create(softAlarmName, {'periodInMinutes': options.softRefreshMinutes});
        chrome.alarms.create(hardAlarmName, {'periodInMinutes': options.hardRefreshMinutes});
      });
    }
  });
}

chrome.alarms.onAlarm.addListener(function (elapsedAlarm) {
  if (elapsedAlarm.name == softAlarmName) {
    // for each tab
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(function (tab) {
        // get the URL
        var tabUrl = tab.url;

        // fetch the page
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', function () {
          if (xhr.response == tabContents[tab.id]) {
            // nothing to reload
            return;
          }

          // store for next time
          tabContents[tab.id] = xhr.response;

          // reload the tab
          chrome.tabs.reload(tab.id);
        );
        xhr.open('get', tabUrl, true);
        xhr.send();
      });
    });
  } else if (elapsedAlarm.name == hardAlarmName) {
    // for each tab
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(function (tab) {
        // reload the tab
        chrome.tabs.reload(tab.id);
      });
    });
  }
});
