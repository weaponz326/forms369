(function($) {
  'use strict';
  $(function() {
    $(document).on("click", '[data-toggle="offcanvas"]', function() {
      $(".sidebar-offcanvas").toggleClass("active");
    });
  });
})(jQuery);