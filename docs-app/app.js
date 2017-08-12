document.addEventListener("DOMContentLoaded", battrComponents.init);

battrComponents.controller('AppController', function (model, router) {
  router
    .add('/', {})
    .notFound(() => router.navigate('/'))
    .resolve();

  model.pageTitle = 'Home';
  model.links = [
    { identifer: 'button', name: 'Button', url: '/button' },
    { identifer: 'checkbox', name: 'Checkbox', url: '/checkboxe' },
    { identifer: 'expander', name: 'Expander', url: '/expander' }
  ];

  this.navigate = (title) => {
    console.log(title)
    model.pageTitle = model.links.filter(item => item.identifer === title)[0].name;
  };

  // model.checkboxValue = true;
  // document.body.querySelector('br-checkbox').addEventListener('change', function (value) {
  //   console.log('changed', model.checkboxValue)
  // });
  //
  // setTimeout(() => {
  //   console.log('befoer', model.checkboxValue)
  //   model.checkboxValue = !model.checkboxValue;
  //   console.log('after', model.checkboxValue)
  // }, 5000);
});
