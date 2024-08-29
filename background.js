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