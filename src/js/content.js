//content script
var clickedEl = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request != "getClickedEl") {
    return;
  }
  getSvgString(clickedEl).then(svgString => {
    // console.log({ svgString });
    if (!svgString) {
      return;
    }
    sendResponse(svgString);
  });
  return true;
});

document.addEventListener(
  "mousedown",
  function(event) {
    const rightClick = event.button == 2;
    if (rightClick) {
      clickedEl = event.target;
    } else {
      clickedEl = null;
    }
  },
  true
);

async function getSvgString(el) {
  if (!el) {
    return null;
  }
  const couldbeInSvg = svgTags.includes(el.tagName);
  if (couldbeInSvg) {
    return tryGetFromSvg(el);
  }
  const isImageSrc = el.tagName === "IMG";
  if (isImageSrc) {
    return tryGetFromImg(el);
  }
  return null;
}

async function tryGetFromSvg(el) {
  let currentEl = el;
  while (!!currentEl && currentEl.tagName != "svg" && currentEl.parentElement) {
    currentEl = currentEl.parentElement;
  }
  if (!!currentEl && currentEl.tagName == "svg") {
    return currentEl.outerHTML;
  }
  return null;
}

async function tryGetFromImg(el) {
  const imgSrc = el.src;
  const data = await fetch(imgSrc);
  const text = await data.text();
  return text;
}

// https://github.com/wooorm/svg-tag-names/blob/master/index.json
const svgTags = [
  "a",
  "altGlyph",
  "altGlyphDef",
  "altGlyphItem",
  "animate",
  "animateColor",
  "animateMotion",
  "animateTransform",
  "animation",
  "audio",
  "canvas",
  "circle",
  "clipPath",
  "color-profile",
  "cursor",
  "defs",
  "desc",
  "discard",
  "ellipse",
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence",
  "filter",
  "font",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignObject",
  "g",
  "glyph",
  "glyphRef",
  "handler",
  "hkern",
  "iframe",
  "image",
  "line",
  "linearGradient",
  "listener",
  "marker",
  "mask",
  "metadata",
  "missing-glyph",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "prefetch",
  "radialGradient",
  "rect",
  "script",
  "set",
  "solidColor",
  "stop",
  "style",
  "svg",
  "switch",
  "symbol",
  "tbreak",
  "text",
  "textArea",
  "textPath",
  "title",
  "tref",
  "tspan",
  "unknown",
  "use",
  "video",
  "view",
  "vkern"
];
