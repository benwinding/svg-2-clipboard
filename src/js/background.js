// A generic onclick callback function.
function genericOnClick(info, tab) {
  chrome.tabs.sendMessage(tab.id, "getClickedEl", function(svgString) {
    console.log('found svg string!', {svgString})
    copyTextToClipboard(svgString);
  });
}

// Create one test item for each context type.
const contexts = ["page", "selection", "link", "image"];
chrome.contextMenus.removeAll()
for (let context of contexts) {
  const title = `Copy SVG (${context})`;
  const id = title;
  chrome.contextMenus.create({
    id: id,
    title: title,
    contexts: [context],
    onclick: genericOnClick
  });
}

function copyTextToClipboard(text) {
  //Create a textbox field where we can insert text to.
  const copyFrom = document.createElement("textarea");

  //Set the text content to be the text you wished to copy.
  copyFrom.textContent = text;

  //Append the textbox field into the body as a child.
  //"execCommand()" only works when there exists selected text, and the text is inside
  //document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom);

  //Select all the text!
  copyFrom.select();

  //Execute command
  document.execCommand("copy");

  //(Optional) De-select the text using blur().
  copyFrom.blur();

  //Remove the textbox field from the document.body, so no other JavaScript nor
  //other elements can get access to this.
  document.body.removeChild(copyFrom);
}
