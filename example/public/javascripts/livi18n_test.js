$(document).ready(function() {
    livi18n.require(function(translate, pluralize){
      //
      $('#test').livi18nP({enableOptions: true, options: {name: 'Bella', nick: 'Bella'}, value: 1});
      $('#multilangs').livi18nT({enableOptions: true});
      //
      console.log(translate({key: 'messages.welcome'}));
      console.log(pluralize({key: 'messages.test2', options: {name: 'Bella', nick: 'Bella'}, value: 14}));
    });
});
