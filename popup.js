chrome.storage.local.get(['enabled', 'totalDeleted'], function(data) {
  document.getElementById('enableToggle').checked = data.enabled !== false; // default true
  updateStats(data.totalDeleted || 0);
});

document.getElementById('enableToggle').addEventListener('change', function() {
  chrome.storage.local.set({ enabled: this.checked });
});

document.getElementById('manualDelete').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'deleteNow' });
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updateStats') {
    chrome.storage.local.get(['totalDeleted'], function(data) {
      const newTotal = (data.totalDeleted || 0) + request.count;
      chrome.storage.local.set({ totalDeleted: newTotal });
      updateStats(newTotal);
    });
  }
});

function updateStats(total) {
  document.getElementById('stats').textContent = `Total deleted: ${total} posts`;
}