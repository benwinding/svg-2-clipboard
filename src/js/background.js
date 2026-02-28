function setupContextMenus() {
  // Create one test item for each context type.
  const contexts = [
    { c: "page", label: "Element" },
    { c: "image", label: "Image" }
  ];
  chrome.contextMenus.removeAll(() => {
    for (const context of contexts) {
      const title = `Copy SVG (${context.label})`;
      chrome.contextMenus.create({
        id: title,
        title: title,
        contexts: [context.c]
      });
    }
  });
}

function handleContextClick(info, tab) {
  if (!tab || !tab.id) {
    return;
  }
  chrome.tabs.sendMessage(tab.id, "getClickedEl", function(response) {
    if (!response || !response.svgString) {
      return;
    }
    console.log("found svg string!", { svgString: response.svgString });
  });
}

chrome.runtime.onInstalled.addListener(setupContextMenus);
chrome.runtime.onStartup.addListener(setupContextMenus);
chrome.contextMenus.onClicked.addListener(handleContextClick);
