// ==UserScript==
// @name         Youtube Embed
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Replace YouTube Player by Embed Player
// @author       Dao Quang Phuong
// @match        https://m.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL  https://raw.githubusercontent.com/daoquangphuong/tampermonkey/refs/heads/main/youtube-mobile-embed/youtube-mobile-embed.user.js
// @updateURL    https://raw.githubusercontent.com/daoquangphuong/tampermonkey/refs/heads/main/youtube-mobile-embed/youtube-mobile-embed.user.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
  const main = () => {
    const isShort = window.location.pathname.startsWith('/shorts/');
    const app = document.querySelector('#player-container-id');
    if (app) {
      app.setAttribute('style', isShort ? '' : 'display: none;');
    }

    if (isShort) {
      return;
    }

    const video = document.querySelector('#player-container-id video');
    if (video) {
      video.pause();
    }
    const pause = document.querySelector(
      'button.icon-button.player-control-play-pause-icon[aria-label*=Pause]'
    );
    if (pause) {
      pause.click();
    }

    const videoId = new URLSearchParams(window.location.search).get('v');

    if (videoId) {
      const container = document.querySelector(
        '#app .player-size.player-placeholder'
      );
      if (container) {
        const src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        const oldIframe = container.querySelector('iframe');
        if (oldIframe && oldIframe.src === src) {
          return;
        }
        if (oldIframe) {
          oldIframe.remove();
        }
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style =
          'position: absolute;top: 0;left: 0;z-index: 1;iframe.frameBorder = "0";border:none;';
        iframe.allow =
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        container.prepend(iframe);
      }
    }
  };

  const loop = () => {
    main();
    setTimeout(loop, 1000);
  };

  const observe = new window.MutationObserver(() => {
    const app = document.querySelector('#player-container-id');
    if (app) {
      app.setAttribute('style', 'display: none;');
      observe.disconnect();
      loop();
    }
  });

  observe.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
