/**
 * Contact / enquiry form.
 *
 * Sends the enquiry to Web3Forms.
 * No custom backend is required.
 */

export function initForm() {
  const form = document.querySelector('[data-form]');
  if (!form) return;
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  // Set Web3Forms access key
  const accessKeyInput = form.querySelector(
    'input[name="access_key"]'
  );

  if (accessKeyInput) {
    accessKeyInput.value = accessKey;
  }
  const status = form.querySelector('[data-form-status]');
  const submitButton = form.querySelector('button[type="submit"]');

  const setError = (field, msg) => {
    const wrap = field.closest('.field');

    if (!wrap) return;

    wrap.classList.toggle('has-error', !!msg);

    const note = wrap.querySelector('.field__error');

    if (note) {
      note.textContent = msg || '';
    }
  };

  const setStatus = (message, type) => {
    if (!status) return;

    status.textContent = message;
    status.className = `form__status ${type}`;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let ok = true;

    /*
     * Validate required fields
     */
    form.querySelectorAll('[required]').forEach((field) => {
      const value = field.value.trim();

      let message = '';

      if (!value) {
        message = 'This field is required.';
      } else if (
        field.type === 'email' &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        message = 'Enter a valid email address.';
      }

      if (message) {
        ok = false;
      }

      setError(field, message);
    });

    /*
     * Stop if validation failed
     */
    if (!ok) {
      setStatus(
        'Please check the highlighted fields.',
        'is-error'
      );

      return;
    }

    /*
     * Disable button while sending
     */
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.dataset.originalText = submitButton.innerHTML;

      submitButton.innerHTML = 'Sending...';
    }

    setStatus('Sending your enquiry...', 'is-ok');

    try {
      const formData = new FormData(form);

      const response = await fetch(
        'https://api.web3forms.com/submit',
        {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus(
          'Thank you. Your enquiry has been sent successfully. We will get back to you soon.',
          'is-ok'
        );

        form.reset();
      } else {
        throw new Error(
          result.message || 'Unable to send the enquiry.'
        );
      }
    } catch (error) {
      console.error('Enquiry submission error:', error);

      setStatus(
        'Sorry, we could not send your enquiry. Please try again or contact us directly.',
        'is-error'
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;

        if (submitButton.dataset.originalText) {
          submitButton.innerHTML =
            submitButton.dataset.originalText;
        }
      }
    }
  });

  /*
   * Clear field error when user starts typing again.
   */
  form
    .querySelectorAll('input, textarea, select')
    .forEach((field) => {
      field.addEventListener('input', () => {
        setError(field, '');
      });

      field.addEventListener('change', () => {
        setError(field, '');
      });
    });
}