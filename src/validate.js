import * as yup from 'yup';

const isUniqueUrl = (existingFeeds, urlValue) => !existingFeeds.includes(urlValue);

const linkSchema = yup.object({
  url: yup
    .string()
    .required()
    .url('INVALID_URL')
    .test('is-unique', 'DUPLICATE_URL', function (urlValue) {
      const { existingFeeds } = this.options.context;
      return isUniqueUrl(existingFeeds, urlValue);
    }),
});

const validateUrl = (urlValue, existingFeeds) => {
  const data = { url: urlValue };

  return linkSchema
    .validate(data, { context: { existingFeeds } })
    .then(() => ({ valid: true, message: 'URL_VALID' }))
    .catch((err) => ({ valid: false, message: err.message }));
};

export default validateUrl;
