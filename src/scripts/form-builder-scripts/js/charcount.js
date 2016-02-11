define(['jquery'], function($) {
  function setCharsAlert(text, element) {
    var remChars = element.parent().parent().find('#rem-chars');
    var remCharsTemplate = $('#rem-chars-template');
    if (remChars.length) {
        remChars.text(text);
    } else {
      var insertSelector = element.parent().parent().find('div.alerttext');

      insertSelector.first().after(remCharsTemplate.html());
      element.parent().parent().find('#rem-chars').text(text);
    }
  }

  function countChars (element) {
    if (element.val().length >= 4000) {
      element.val(element.val().substring(0, 4000));
      setCharsAlert('0 characters remaining', element);
    } else {
      setCharsAlert(4000 - element.val().length + ' characters remaining', element);
    }
  }

  function initCountChars() {
    var textareas = $('div#formcontainer textarea');

    if (!textareas.length) {
      setTimeout(initCountChars, 500);
    } else {
      textareas.each(function(index, element) {
        countChars($(element));
      });
    }
  }

  return function() {
    $(document).on('keyup paste', 'div#formcontainer textarea', function(event) {
      countChars($(event.target));
    });

    $(document).on('click', 'button.btn.btn-primary.ng-scope:contains("Load Response")', function() {
      initCountChars();
    });

    initCountChars();
  }
});
