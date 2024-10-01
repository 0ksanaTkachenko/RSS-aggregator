import * as yup from 'yup';

const isUniqueUrl = (existingLinks, urlValue) => !existingLinks.has(urlValue);

const linkSchema = yup.object({
  url: yup
    .string()
    .min(1, 'EMPTY_URL')
    .url('INVALID_URL')
    .test('is-unique', 'DUPLICATE_URL', function isUniqueUrlTest(urlValue) {
      const { existingLinks } = this.options.context;
      return isUniqueUrl(existingLinks, urlValue);
    }),
});

const validateUrl = (urlValue, state) => {
  const data = { url: urlValue };
  const { existingLinks } = state.form;
  return linkSchema
    .validate(data, { context: { existingLinks } })
    .then(() => ({ valid: true, message: 'URL_VALID' }))
    .catch((err) => {
      throw new Error(err.message);
    });
};

export default validateUrl;
