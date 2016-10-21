/* ----------------- Write your code here ---------------- */

const DNS_ENDPOINT = 'https://tranquil-stream-29919.herokuapp.com/update-spf';
const SERVICE_SPF = 'spf.mtasv.net';

var SpfTool = {

  panes: null,
  form: null,
  submitBtn: null,
  input: null,

  /**
   * Initialise the SPF tool.
   *
   * @return {undefined}
   */
  init: function() {
    // Find the key elements.
    this.panes = document.querySelectorAll('.spf-tool_pane');
    this.form = document.querySelector('.spf-tool_form');
    this.submitBtn = document.querySelector('.spf-tool_submit');
    this.domainInput = document.querySelector('.spf-tool_input');

    // Setup Event Listeners
    this.form.addEventListener('submit', this.checkSpfRecord);

    Array.prototype.forEach.call(document.querySelectorAll('.spf-tool_restart'), function(link) {
      link.addEventListener('click', SpfTool.resetTool);
    });
  },

  /**
   * Reset the tool content and return to the satrt page.
   *
   * @param {Event} event Click event.
   */
  resetTool: function(event) {
    event.preventDefault();

    SpfTool.result = null;
    SpfTool.showPane('start');
  },

  /**
   * Display a pane.
   *
   * @param  {String} pane The target pane.
   * @return {undefined}
   */
  showPane: function(pane) {
    Array.prototype.forEach.call(this.panes, function(ele) {
      if (ele.classList.contains('spf-tool_pane--' + pane)) {
        return ele.classList.add('spf-tool_pane--visible');
      }

      return ele.classList.remove('spf-tool_pane--visible');
    });
  },

  /**.
   * Check the DNS records to see if an SPF record needs to be added or
   * modified.
   *
   * This hits a simple node service I built:
   * https://github.com/matt-west/spf-web-service
   *
   * @param {Event} event   The form submission event.
   * @return {undefined}
   */
  checkSpfRecord: function(event) {
    event.preventDefault();

    SpfTool.submitBtn.setAttribute('disabled', 'disabled');
    SpfTool.domainInput.setAttribute('disabled', 'disabled');

    // Remove any errors.
    var errorsContainer = document.querySelector('.spf-tool_errors');
    if (errorsContainer) {
      errorsContainer.remove();
    }

    var domain = SpfTool.domainInput.value;

    // Make a request to check the DNS.
    var request = new XMLHttpRequest();

    request.addEventListener('load', SpfTool.handleApiSuccess);
    request.addEventListener('error', SpfTool.handleApiError);
    request.addEventListener('abort', SpfTool.handleApiError);

    request.open('POST', DNS_ENDPOINT);
    request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    request.send(JSON.stringify({
      domain: domain,
      service_spf: SERVICE_SPF
    }));
  },

  /**
   * Handle successful requests to the API.
   *
   * @return {undefined}
   */
  handleApiSuccess: function() {
    SpfTool.submitBtn.removeAttribute('disabled');
    SpfTool.domainInput.removeAttribute('disabled');
    SpfTool.domainInput.value = '';

    var result = JSON.parse(this.responseText);

    if (this.status !== 200) {
      SpfTool.showErrors(result.errors);
      return;
    }

    SpfTool.displayResult(result);
  },

  /**
   * Handle requests to the API that err.
   *
   * @return {undefined}
   */
  handleApiError: function() {
    SpfTool.submitBtn.removeAttribute('disabled');
    SpfTool.domainInput.removeAttribute('disabled');

    var result = JSON.parse(this.responseText);
    SpfTool.showErrors(result.errors);
  },

  /**
   * Display API errors to the user.
   *
   * @param  {Array} errors  A collection of error messages.
   * @return {undefined}
   */
  showErrors: function(errors) {
    var errorsContainer = document.querySelector('.spf-tool_errors');

    if (errorsContainer) {
      errorsContainer.remove();
    }

    var errorList = document.createElement('ul');
    errorList.classList.add('spf-tool_errors');

    Array.prototype.forEach.call(errors, function(error) {
      var item = document.createElement('li');
      item.innerText = error;
      errorList.appendChild(item);
    });

    SpfTool.form.insertBefore(errorList, SpfTool.domainInput);

    SpfTool.showPane('start');
  },

  /**
   * Display the result to the user.
   *
   * @param  {Object} result The object returned by the API call.
   * @return {undefined}
   */
  displayResult: function(result) {
    if (result.operation === 'create' || result.operation === 'modify') {
      // Set code block content.
      var codeBlock = document.querySelector('.spf-tool_pane--' + result.operation + ' .spf-tool_code code');
      codeBlock.innerText = result.record;

      // Set email link.
      var emailLink = document.querySelector('.spf-tool_pane--' + result.operation + ' .spf-tool_email');
      emailLink.href = SpfTool.generateEmailString(result.operation, result.record, result.domain);
    }

    SpfTool.showPane(result.operation);
  },

  /**
   * Generate the email link.
   *
   * @param  {String} operation
   * @param  {String} record
   * @param  {String} domain
   * @return {String}
   */
  generateEmailString: function(operation, record, domain) {
    var subject;

    var body = 'Hello!\n\n';
    body += 'Can you please update the DNS records for ' + domain + '\n\n';

    if (operation === 'create') {
      subject = 'Create an SPF policy for ' + domain;
      body += 'We need to add the following TXT record to define the SPF policy for the domain:\n';
    } else if (operation === 'modify') {
      subject = 'Update the SPF policy for ' + domain;
      body += 'We need to update the SPF TXT record on the domain to:\n';
    }

    body += record + '\n\n';
    body += 'You can find more information about SPF policies here: https://postmarkapp.com/guides/spf\n\n';
    body += 'Thank you!';

    return 'mailto:?subject=' + encodeURI(subject) + '&body=' + encodeURI(body);
  }

};

SpfTool.init();
