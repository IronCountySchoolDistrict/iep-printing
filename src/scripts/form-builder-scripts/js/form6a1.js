define(['jquery'], function($) {
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
    var $element = $('.pdf_date');
    if ($element.find('input').length > 0) {
      scope.formContent.originalElements.forEach(function(item, index) {
        if (item.class == "pdf_date") {
          item.description = "(start date)";
          scope.$digest();
        }
      });

      if (state) {
        $element.animate({
          backgroundColor: "#fcf8e3"
        }, 3000);
        state = false;
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

	function totalMinutes(category) {
		var selector = 'div[class^="pdf_' + category + '-total"] input';
		var minutes = 0;

		$(selector).each(function(index, element) {
			if ($.isNumeric($(element).val())) {
				minutes += parseInt($(element).val());
			}
		});

		$('.' + category + '-service-minutes input').val(minutes);
		$('.' + category + '-service-minutes input').trigger('input');
	}

	return function() {
		$(document).on('blur', 'div[class^="pdf_sped-total"] input', function() {
			totalMinutes('sped');
		});

		$(document).on('blur', 'div[class^="pdf_related-total"] input', function() {
			totalMinutes('related');
		});

		$(document).on('blur', 'div[class^="pdf_service-total"] input', function() {
			totalMinutes('service');
		});

    if (typeof queryString().start_date !== 'undefined') {
      drawAttentionToElement();
    }
	}
});
