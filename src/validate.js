import * as yup from 'yup';

const isUniqueUrl = (existingFeeds, urlValue) => !existingFeeds.includes(urlValue);

const linkSchema = yup.object({
  url: yup
    .string()
    .required()
    .url('INVALID_URL')
    .test('is-unique', 'DUPLICATE_URL', (existingFeeds, urlValue) => isUniqueUrl(existingFeeds, urlValue)),
});

const validateUrl = (urlValue) => {
  const data = { url: urlValue };

  return linkSchema
    .validate(data)
    .then(() => ({ valid: true, message: 'URL_VALID' }))
    .catch((err) => ({ valid: false, message: err.message }));
};

export default validateUrl;
