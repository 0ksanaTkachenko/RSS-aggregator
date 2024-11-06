import * as yup from 'yup';

const createLinkSchema = (existingLinks) => {
  const yupObj = yup.object({
    url: yup
      .string()
      .min(1, 'empty_url')
      .url('invalid_url')
      .notOneOf(existingLinks, 'duplicate_url'),
  });
  return yupObj;
};

const validateUrl = (urlValue, state) => {
  const feedsArr = Array.from(state.feeds);
  const existingLinks = feedsArr.map((item) => item.feedUrl);
  const linkSchema = createLinkSchema(existingLinks);

  return linkSchema
    .validate({ url: urlValue })
    .then(() => ({ valid: true, message: 'url_valid' }))
    .catch((err) => {
      throw new Error(err.message);
    });
};

export default validateUrl;
