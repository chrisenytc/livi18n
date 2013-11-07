window.bootstrap = function() {
    angular.bootstrap(document, ['livi18nApp']);
};

window.init = function() {
    window.bootstrap();
};

$(document).ready(function() {
    //Fixing facebook bug with redirect
    if (window.location.hash == "#_=_") window.location.hash = "";

    //Then init the app
    livi18n.init('http://localhost:3000', ['messages'], function(translate, pluralize){
        var name = translate({key: 'messages.welcome'});
        console.log(name);
        window.init();
    });
});