chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'cleanHistory') {
      const keywords = request.keywords;
      chrome.history.search({ text: '', maxResults: 10000 }, (historyItems) => {
        historyItems.forEach(item => {
          if (keywords.some(keyword => item.title.includes(keyword) || item.url.includes(keyword))) {
            chrome.history.deleteUrl({ url: item.url });
          }
        });
      });
    }
  });

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.keywords) {
    console.log('Keywords updated:', changes.keywords.newValue);
    // You can perform any necessary actions here when keywords are updated
  }
});