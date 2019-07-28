chrome.runtime.onInstalled.addListener(function () {
    console.log('chrome.runtime.onInstalled.addListener');
});

chrome.extension.onConnect.addListener(function (client) {
    client.onMessage.addListener(function (data) {
        console.log("client message", data);
    });
});