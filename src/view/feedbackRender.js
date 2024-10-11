import domElements from '../domElements.js';

const feedbackRender = (value, feedbackCode, i18nextInstance) => {
  const { urlInput, feedback } = domElements;

  if (value === 'initial') {
    urlInput.value = '';
    urlInput.focus();
    urlInput.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
  } else if (value === 'error') {
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    urlInput.classList.add('is-invalid');
  } else {
    return;
  }

  feedback.textContent = i18nextInstance.t(`validation.${feedbackCode}`);
};

export default feedbackRender;
