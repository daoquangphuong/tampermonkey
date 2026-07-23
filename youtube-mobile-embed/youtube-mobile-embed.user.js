// ==UserScript==
// @name         Youtube Embed
// @namespace    http://tampermonkey.net/
// @version      2026-07-22
// @description  Replace YouTube Player by Embed Player
// @author       Dao Quang Phuong
// @match        https://m.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
  const player = document.querySelector("#player-container-id");
  const videoId = new URLSearchParams(window.location.search).get("v");
  if (player && videoId) {
    player.setAttribute(
      "style",
      `width: ${player.clientWidth}px; height: ${player.clientHeight}px`
    );
    player.textContent = "";
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.frameBorder = "0";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    player.appendChild(iframe);
  }
  setInterval(() => {
    const newVideoId = new URLSearchParams(window.location.search).get("v");
    if (newVideoId !== videoId) {
      window.location.reload();
    }
  }, 1000);
})();
