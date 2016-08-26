import $ from 'jquery';

var state = true;

var queryString = function() {
  var queryString = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");

    if (typeof queryString[pair[0]] === "undefined") {
      queryString[pair[0]] = decodeURIComponent(pair[1]);
    } else if (typeof queryString[pair[0]] === "string") {
      var arr = [queryString[pair[0]], decodeURIComponent(pair[1])];
      queryString[pair[1]] = arr;
    } else {
      queryString[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }

  return queryString;
}

var drawAttentionToElement = function() {
  var $element = $('.pdf_sped-teacher');
  if ($element.find('input').length > 0) {
    scope.formContent.originalElements.forEach(function(item, index) {
      if (item.class == "pdf_sped-teacher") {
        item.description = "(case manager)";
        scope.$digest();
      }
    });

    if (state) {
      state = false;
      $element.animate({
        backgroundColor: "#fcf8e3"
      }, 3000);
      setTimeout(drawAttentionToElement, 15000);
      $element.find('input').focus();
    } else {
      $element.animate({
        backgroundColor: "#fff"
      }, 3000);
    }
  } else {
    setTimeout(drawAttentionToElement, 1000);
  }
}

export default function() {
  if (typeof queryString().case_manager !== 'undefined') {
    drawAttentionToElement();
  }
}
