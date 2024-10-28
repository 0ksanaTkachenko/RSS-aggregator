import * as yup from 'yup';

const createLinkSchema = (existingLinks) => {
  return yup.object({
    url: yup
      .string()
      .min(1, 'EMPTY_URL')
      .url('INVALID_URL')
      .notOneOf(existingLinks, 'DUPLICATE_URL'),
  });
};

const validateUrl = (urlValue, state) => {
  const feedsArr = Array.from(state.feeds);
  const existingLinks = feedsArr.map((item) => item.feedUrl);
  const linkSchema = createLinkSchema(existingLinks);

  return linkSchema
    .validate({ url: urlValue })
    .then(() => ({ valid: true, message: 'URL_VALID' }))
    .catch((err) => {
      throw new Error(err.message);
    });
};

export default validateUrl;
