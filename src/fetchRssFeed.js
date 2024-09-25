import axios from 'axios';

const fetchRssFeed = (urlValue) => {
  const encodedUrl = encodeURIComponent(urlValue);
  const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodedUrl}&disableCache=true`;

  return axios
    .get(proxyUrl)
    .then((response) => response.data)
    .catch((error) => {
      // Проверка на TypeError для обработки сетевой ошибки
      if (error.isAxiosError && !error.response) {
        throw new Error('NETWORK_ERROR');
      }
      throw error; // Пробрасываем остальные ошибки
    });
};

export default fetchRssFeed;
