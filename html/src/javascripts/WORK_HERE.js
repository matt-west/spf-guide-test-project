/* ----------------- Write your code here ---------------- */

const DNS_ENDPOINT = 'https://tranquil-stream-29919.herokuapp.com/update-spf';
const SERVICE_SPF = 'spf.mtasv.net';

var SpfTool = {

  panes: null,


  /**
   * Initialise the SPF tool.
   *
   * @return {undefined}
   */
  init: function() {
    // Find the panes.
    this.panes = document.querySelectorAll('.spf-tool_pane');

    // Setup Event Listeners
    document.querySelector('.spf-tool_form').addEventListener('submit', this.checkSpfRecord);
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

    var domain = document.querySelector('.spf-tool_input').value;

    // Basic input validation
    if (!domain || !domain.replace(/\s/g, '').length) {
      alert('Please specify a domain name'); // TODO: Display validation message.
      return;
    }

    // Show a loading state.
    SpfTool.showPane('loading');

    // Make a requet to check the DNS.
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
    var result = JSON.parse(this.responseText);

    if (this.status !== 200) {
      SpfTool.showErrors(result.errors);
      return;
    }

    var result = JSON.parse(this.responseText);

    switch(result.operation) {
      case 'create':

        break;
      case 'modify':

        break;
      case 'existing':

        break;
    }

  },

  /**
   * Handle requests to the API that err.
   *
   * @return {undefined}
   */
  handleApiError: function() {
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
    console.log(errors);
    SpfTool.showPane('start');
  }

};

SpfTool.init();
