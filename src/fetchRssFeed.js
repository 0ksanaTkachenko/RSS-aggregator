import axios from 'axios';

const fetchRssFeed = (urlValue) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app/get');
  proxyUrl.searchParams.set('url', urlValue);
  proxyUrl.searchParams.set('disableCache', 'true');
  const finalUrl = proxyUrl.toString();

  return axios
    .get(finalUrl)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.isAxiosError && !error.response) {
        throw new Error('NETWORK_ERROR');
      }
      throw error;
    });
};

export default fetchRssFeed;
