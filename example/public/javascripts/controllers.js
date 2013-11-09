function indexCtrl($scope, $socket, $livi18n) {
    $scope.livi18ndemo = $livi18n.t({key: 'messages.welcome'});
    $socket.on('livi18n/post', function() {
      console.log('Socket tested...');
    });
}
