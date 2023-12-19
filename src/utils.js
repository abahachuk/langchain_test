/* eslint-disable */
import axios from 'axios';
import axiosMod from 'axios';

import * as cheerio from 'cheerio';
import { SERPAPI_API_KEY } from './config.js';

const headers = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'en-US,en;q=0.5',
  'Alt-Used': 'LEAVE-THIS-KEY-SET-BY-TOOL',
  Connection: 'keep-alive',
  Host: 'LEAVE-THIS-KEY-SET-BY-TOOL',
  Referer: 'https://www.google.com/',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'cross-site',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0',
};

async function doSearch(query) {
  const data = JSON.stringify({
    q: query,
    n: 15,
  });

  const config = {
    method: 'post',
    url: 'https://google.serper.dev/search',
    headers: {
      'X-API-KEY': SERPAPI_API_KEY,
      'Content-Type': 'application/json',
    },
    data,
  };
  const response = await axios(config)
    .catch((error) => {
      console.log(error);
    });
  return response.data;
}

async function getHtml(baseUrl, headers, axiosConfig) {
  const axios = ('default' in axiosMod ? axiosMod.default : axiosMod);

  const domain = new URL(baseUrl).hostname;
  // these appear to be positional, which means they have to exist in the headers passed in
  headers.Host = domain;
  headers['Alt-Used'] = domain;
  let htmlResponse;

  try {
    htmlResponse = await axios.get(baseUrl, {
      ...axiosConfig,
      headers,
    });
  } catch (e) {
    if (axios.isAxiosError(e) && e.response && e.response.status) {
      throw new Error(`http response ${e.response.status}`);
    }
    throw e;
  }
  const allowedContentTypes = [
    'text/html',
    'application/json',
    'application/xml',
    'application/javascript',
    'text/plain',
  ];
  const contentType = htmlResponse.headers['content-type'];
  const contentTypeArray = contentType.split(';');
  if (contentTypeArray[0]
        && !allowedContentTypes.includes(contentTypeArray[0])) {
    throw new Error('returned page was not utf8');
  }
  return htmlResponse.data;
}

async function getText(html, baseUrl, summary) {
  // scriptingEnabled so noscript elements are parsed
  const $ = cheerio.load(html, { scriptingEnabled: true });
  let text = '';
  // lets only get the body if its a summary, dont need to summarize header or footer etc
  const rootElement = summary ? 'body ' : '*';
  $(`${rootElement}:not(style):not(script):not(svg)`).each((_i, elem) => {
    // we dont want duplicated content as we drill down so remove children
    let content = $(elem).clone().children().remove()
      .end()
      .text()
      .trim();
    const $el = $(elem);
    // if its an ahref, print the content and url
    let href = $el.attr('href');
    if ($el.prop('tagName')?.toLowerCase() === 'a' && href) {
      if (!href.startsWith('http')) {
        try {
          href = new URL(href, baseUrl).toString();
        } catch {
          // if this fails thats fine, just no url for this
          href = '';
        }
      }
      const imgAlt = $el.find('img[alt]').attr('alt')?.trim();
      if (imgAlt) {
        content += ` ${imgAlt}`;
      }
      text += ` [${content}](${href})`;
    }
    // otherwise just print the content
    else if (content !== '') {
      text += ` ${content}`;
    }
  });
  return text.trim().replace(/\n+/g, ' ');
}

async function fetchMultipleUrls(urls) {
  let requests = urls.map((url) => getHtml(url, headers));
  const htmls = await Promise.all(requests);

  htmls.filter((html) => html !== null);

  requests = htmls.map((html) => getText(html));

  const texts = await Promise.all(requests);

  return texts;
}

export {
  getText, getHtml, doSearch, fetchMultipleUrls, headers,
};
