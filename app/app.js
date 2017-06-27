(function () {

    angular
        .module('app')
        .controller('AppController',  AppController);

    AppController.$inject = [];

    function AppController() {

        vm = this;

        return vm;

    };

})();
