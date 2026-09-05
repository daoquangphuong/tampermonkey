// ==UserScript==
// @name         GM Fetch Bridge
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Fetch Data From Other Website
// @author       Dao Quang Phuong
// @match        http://localhost:6973/browser/*
// @match        https://browser.free4talk.com/browser/*
// @icon         https://cdn-1.webcatalog.io/catalog/fetcher/fetcher-icon-filled-256.png
// @downloadURL  https://raw.githubusercontent.com/daoquangphuong/tampermonkey/refs/heads/main/gm-fetch-bridge/gm-fetch-bridge.user.js
// @updateURL    https://raw.githubusercontent.com/daoquangphuong/tampermonkey/refs/heads/main/gm-fetch-bridge/gm-fetch-bridge.user.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
  const REQUEST_TYPE = 'GM_FETCH';
  const RESPONSE_TYPE = 'GM_FETCH_RESPONSE';

  window.addEventListener('message', event => {
    const { type, id, payload } = event.data || {};

    if (type !== REQUEST_TYPE || !id || !payload) {
      return;
    }

    const {
      url,
      method = 'GET',
      headers = {},
      data,
      timeout = 30000,
    } = payload;

    // eslint-disable-next-line no-undef
    GM_xmlhttpRequest({
      method,
      url,
      headers,
      data,
      timeout,
      responseType: 'arraybuffer',
      onload(response) {
        const buffer = response.response;

        const tempDecoder = new TextDecoder('utf-8');
        const tempText = tempDecoder.decode(buffer);

        let responseText = '';

        if (/charset=["']?gbk["']?/im.test(tempText)) {
          const gbkDecoder = new TextDecoder('gbk');
          responseText = gbkDecoder.decode(buffer);
        } else {
          responseText = tempText;
        }

        window.postMessage(
          {
            type: RESPONSE_TYPE,
            id,
            success: true,
            response: {
              ok: response.status >= 200 && response.status < 300,
              status: response.status,
              statusText: response.statusText,
              responseHeaders: response.responseHeaders,
              responseText,
            },
          },
          '*'
        );
      },

      onerror(error) {
        window.postMessage(
          {
            type: RESPONSE_TYPE,
            id,
            success: false,
            error: {
              type: 'network',
              message: 'GM_xmlhttpRequest failed',
              details: {
                message: error?.message || '',
                status: Number(error?.status) || 0,
                statusText: String(error?.statusText || ''),
              },
            },
          },
          '*'
        );
      },

      ontimeout() {
        window.postMessage(
          {
            type: RESPONSE_TYPE,
            id,
            success: false,
            error: {
              type: 'timeout',
              message: 'Request timed out',
            },
          },
          '*'
        );
      },

      onabort() {
        window.postMessage(
          {
            type: RESPONSE_TYPE,
            id,
            success: false,
            error: {
              type: 'abort',
              message: 'Request was aborted',
            },
          },
          '*'
        );
      },
    });
  });
})();
