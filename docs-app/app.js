document.addEventListener("DOMContentLoaded", function(event) {
  battrComponents.init();
});

battrComponents.controller('AppController', function (model) {
  model.$assign('name', 'Ben Rubin');
  model.$assign('showit', false);
});
