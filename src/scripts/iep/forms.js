require(['jquery'], function($) {
  $(document).ready(function() {
    $('.linkDescList tr td a').each(function(index, element) {
      var text = $(element).text();
      if (text.indexOf('IEP:') > -1) {
        $(element).parents('tr').hide();
      }
    });
  });
});