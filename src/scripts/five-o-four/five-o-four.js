define(['jquery'], function($) {
  var checkboxes = '.forms-list-container input[type=checkbox]';
  var checkedCheckboxes = '.forms-list-container input[type=checkbox]:checked';
  var apiUrl = '/* @echo API_URL */';

  var iCheck = function() {
    $(checkboxes).iCheck({
      checkboxClass: 'icheckbox_square-blue',
      radioClass: 'iradio_square-blue'
    });

    $(checkboxes).on('ifChanged', inputWatcher);
  }

  var inputWatcher = function(event) {
    if ($(checkedCheckboxes).length < 1) {
      $('#btnToggleSelection').text('Select All');
      $('button[type=submit]').hide();
    } else {
      $('button[type=submit]').show();
    }

    // if ($(checkedCheckboxes).length > 1) {
    //   $('.options-file').show();
    // } else {
    //   $('.options-file').hide();
    // }

    if ($(checkedCheckboxes).length == $(checkboxes).length) {
      $('#btnToggleSelection').text('Select None');
    }
  }

  var toggleSelect = function(event) {
    if ($(event.target).text() == 'Select All') {
      $(checkboxes).iCheck('check');
    } else {
      $(checkboxes).iCheck('uncheck');
    }
  }

  return {
    checkboxes: checkboxes,
    checkedCheckboxes: checkedCheckboxes,
    inputWatcher: inputWatcher,
    iCheck: iCheck,
    toggleSelect: toggleSelect,
    apiUrl
  }
});