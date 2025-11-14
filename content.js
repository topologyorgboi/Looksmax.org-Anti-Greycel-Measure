(function() {
  let deletedThisPage = 0;
  
  function deleteGrayUsers() {
    const targetColor = 'rgb(158, 158, 158)'; 
    let deletedCount = 0;
    
    const usernames = document.querySelectorAll('span[class*="username--style"]');
    
    usernames.forEach(username => {
      const color = window.getComputedStyle(username).color;
      
      if (color === targetColor || color === 'rgb(158, 158, 158)') {
        const post = username.closest('article.message');
        
        if (post && !post.hasAttribute('data-deleted')) {
          post.setAttribute('data-deleted', 'true');
          post.remove();
          deletedCount++;
          console.log('Deleted post from gray user:', username.textContent);
        }
      }
    });
    
    if (deletedCount > 0) {
      deletedThisPage += deletedCount;
      console.log(`Deleted ${deletedCount} posts from gray users on this page`);
      
      // Update stats in popup
      chrome.runtime.sendMessage({ 
        action: 'updateStats', 
        count: deletedCount 
      });
    }
    
    return deletedCount;
  }

  function checkAndRun() {
    chrome.storage.local.get(['enabled'], function(data) {
      if (data.enabled !== false) { // default to enabled
        deleteGrayUsers();
      }
    });
  }
  
  setTimeout(checkAndRun, 1000);
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'deleteNow') {
      deleteGrayUsers();
    }
  });
  
  const observer = new MutationObserver(function(mutations) {
    chrome.storage.local.get(['enabled'], function(data) {
      if (data.enabled !== false) {
        deleteGrayUsers();
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();