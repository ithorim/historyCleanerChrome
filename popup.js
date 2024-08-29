document.addEventListener('DOMContentLoaded', () => {
  const keywordInput = document.getElementById('keywordInput');
  const addKeywordButton = document.getElementById('addKeywordButton');
  const cleanButton = document.getElementById('cleanButton');
  const keywordList = document.getElementById('keywordList');
  const modeToggle = document.getElementById('modeToggle');

  // Load keywords from storage
  chrome.storage.sync.get(['keywords', 'darkMode'], (data) => {
    const keywords = data.keywords || [];
    updateKeywordList(keywords);

    // Set initial mode
    const isDarkMode = data.darkMode || false;
    setMode(isDarkMode);
  });

  // Mode toggle event listener
  modeToggle.addEventListener('click', () => {
    chrome.storage.sync.get('darkMode', (data) => {
      const isDarkMode = !data.darkMode;
      setMode(isDarkMode);
      chrome.storage.sync.set({ darkMode: isDarkMode });
    });
  });

  // Function to set the mode
  function setMode(isDarkMode) {
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.body.classList.toggle('light-mode', !isDarkMode);
  }

  // Add keyword button event listener
  addKeywordButton.addEventListener('click', () => {
    const keyword = keywordInput.value.trim();
    if (keyword) {
      chrome.storage.sync.get('keywords', (data) => {
        const keywords = data.keywords || [];
        if (!keywords.includes(keyword)) {
          keywords.push(keyword);
          chrome.storage.sync.set({ keywords }, () => {
            if (chrome.runtime.lastError) {
              console.error('Error saving keyword:', chrome.runtime.lastError);
            } else {
              updateKeywordList(keywords);
              keywordInput.value = '';
            }
          });
        }
      });
    }
  });

  // Clean history button event listener
  cleanButton.addEventListener('click', () => {
    chrome.storage.sync.get('keywords', (data) => {
      const keywords = data.keywords || [];
      chrome.runtime.sendMessage({ action: 'cleanHistory', keywords });
    });
  });

  // Function to update the keyword list in the UI
  function updateKeywordList(keywords) {
    keywordList.innerHTML = '';
    keywords.forEach(keyword => {
      const li = document.createElement('li');
      li.textContent = keyword;
      const removeIcon = document.createElement('span');
      removeIcon.innerHTML = '&#10006;'; // X symbol
      removeIcon.className = 'remove-icon';
      removeIcon.addEventListener('click', () => {
        const updatedKeywords = keywords.filter(k => k !== keyword);
        chrome.storage.sync.set({ keywords: updatedKeywords }, () => {
          updateKeywordList(updatedKeywords);
        });
      });
      li.appendChild(removeIcon);
      keywordList.appendChild(li);
    });
  }

  // Add keyword on Enter key press
  keywordInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission if it's in a form
      addKeywordButton.click(); // Simulate a click on the add keyword button
    }
  });
});