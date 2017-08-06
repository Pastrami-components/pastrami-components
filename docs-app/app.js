document.addEventListener("DOMContentLoaded", battrComponents.init);

battrComponents.controller('AppController', function (model) {
  model.checkboxValue = true;
  document.body.querySelector('br-checkbox').addEventListener('change', function (value) {
    console.log('changed', model.checkboxValue)
  });

  setTimeout(() => {
    console.log('befoer', model.checkboxValue)
    model.checkboxValue = !model.checkboxValue;
    console.log('after', model.checkboxValue)
  }, 5000);
});
