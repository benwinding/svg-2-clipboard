function cpy(o) {
  return JSON.parse(JSON.stringify(o));
}
// A generic onclick callback function.
function genericOnClick(info, tab) {
  chrome.tabs.sendMessage(tab.id, "getClickedEl", function(svgString) {
    copyTextToClipboard(svgString);
    // console.log({svgString})
  });
}

// Create one test item for each context type.
var contexts = ["page", "selection", "link", "image"];

for (let context of contexts) {
  var title = "Test '" + context + "' menu item";
  var id = chrome.contextMenus.create({
    title: title,
    contexts: [context],
    onclick: genericOnClick
  });
  console.log("'" + context + "' item:" + id);
}

function copyTextToClipboard(text) {
  //Create a textbox field where we can insert text to. 
  var copyFrom = document.createElement("textarea");

  //Set the text content to be the text you wished to copy.
  copyFrom.textContent = text;

  //Append the textbox field into the body as a child. 
  //"execCommand()" only works when there exists selected text, and the text is inside 
  //document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom);

  //Select all the text!
  copyFrom.select();

  //Execute command
  document.execCommand('copy');

  //(Optional) De-select the text using blur(). 
  copyFrom.blur();

  //Remove the textbox field from the document.body, so no other JavaScript nor 
  //other elements can get access to this.
  document.body.removeChild(copyFrom);
}