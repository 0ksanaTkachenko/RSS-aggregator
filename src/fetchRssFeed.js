import axios from 'axios';

const fetchRssFeed = (urlValue) => {
  const encodedUrl = encodeURIComponent(urlValue);
  const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodedUrl}&disableCache=true`;

  return axios.get(proxyUrl).then((response) => response.data);
};

export default fetchRssFeed;
