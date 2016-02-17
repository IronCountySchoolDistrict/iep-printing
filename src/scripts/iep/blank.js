require(['jquery', 'handlebars'], function($, Handlebars) {
  var API_BASE_URL = '/* @echo API_URL */';
  var checkboxes = '.forms-list-container input[type=checkbox]';
  var checkedCheckboxes = '.forms-list-container input[type=checkbox]:checked';

  $(document).ready(function() {
    loadForms();
    $('button[type=submit]').on('click', printSelectedForms);
  });

  function iCheck() {
    $(checkboxes).iCheck({
      checkboxClass: 'icheckbox_square-blue',
      radioClass: 'iradio_square-blue'
    });

    $(checkboxes).on('ifChanged', inputWatcher);
  }

  function toggleSelect(event) {
    if ($(event.target).text() == 'Select All') {
      $(checkboxes).iCheck('check');
    } else {
      $(checkboxes).iCheck('uncheck');
    }
  }

  function inputWatcher(event) {
    if ($(checkedCheckboxes).length < 1) {
      $('#btnToggleSelection').text('Select All');
      $('button[type=submit]').hide();
    } else {
      $('button[type=submit]').show();
    }

    if ($(checkedCheckboxes).length > 1) {
      $('.options-file').show();
    } else {
      $('.options-file').hide();
    }

    if ($(checkedCheckboxes).length == $(checkboxes).length) {
      $('#btnToggleSelection').text('Select None');
    }
  }

  function loadForms() {
    $.ajax({
      url: API_BASE_URL + 'get-blanks',
      type: 'POST',
      dataType: 'json',
      data: {forms: JSON.stringify(forms), action: 'getBlanks'},
    })
    .done(function(response) {
      if (response.length > 0) {
        $('#btnToggleSelection').show();
        $('#btnToggleSelection').on('click', toggleSelect);
        $.each(response, function(index, form) {
          var source = $('#form-list-item-template').html();
          var template = Handlebars.compile(source);
          var html = template(form);

          var listNum = ((index % 3) + 1);

          $('.forms-list:nth-of-type('+listNum+')').append(html);
        });

        iCheck();
      } else {
        $('#btnToggleSelection').after('<p> Sorry, there are no printable blank forms right now. </p>');
      }
    })
    .fail(function(error) {
      console.log(error);
      $('#btnToggleSelection').after('<p> Sorry, thre was an error communicating with the server. </p>');
    });
  }

  function printSelectedForms(event) {
    // make sure there are checked forms
    if ($(checkedCheckboxes).length < 1) {
      alert('There are no forms selected.'); // TODO: might want to change how to notify
      return;
    }

    var selected = [];

    $(checkedCheckboxes).each(function(index, form) {
      selected.push({
        id: $(form).val(),
        title: $(form).parents('li').find('.title').text()
      });
    });

    console.log(JSON.stringify(selected));

    if (selected.length > 0) {
      togglePrintButtonState('disabled');

      $.ajax({
        url: API_BASE_URL + 'print-blanks',
        type: 'POST',
        dataType: 'json',
        data: {forms: JSON.stringify(selected), action: 'printBlanks'},
      })
      .done(function(response) {
        console.log(response);
        if (response.file.length > 0) {
          var win = window.open(API_BASE_URL + response.file, '_blank');
          if (win) {
            win.focus();
          } else {
            alert('ERROR: Please allow popups for this page.');
          }
        }

        for (var key in response.error) {
          var parentElement = $('input[value='+key+']').parents('li');
                parentElement.addClass('error');
                parentElement.find('.form-error').text(response.error[key]);
              }
      })
      .fail(function(data) {
        console.log('Error');
        console.log(data);
      })
      .always(function() {
        togglePrintButtonState('enabled');
      });

    } else {
      alert('ERROR: selected form\'s data could not be collected');
    }
  }

  function togglePrintButtonState(state) {
    if (state == 'disabled') {
      $('#btnPrintSelection').prop('disabled', true);
      $('#btnPrintSelection i').removeClass('hide');
    } else {
      $('#btnPrintSelection').prop('disabled', false);
      $('#btnPrintSelection i').addClass('hide');
    }
  }
});
