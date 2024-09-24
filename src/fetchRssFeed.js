import axios from 'axios';

const fetchRssFeed = (urlValue) => {
  const encodedUrl = encodeURIComponent(urlValue);
  const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodedUrl}&disableCache=true`;

  axios.get(proxyUrl).then((response) => {
    console.log(response);
    return response;
  });
};

export default fetchRssFeed;
