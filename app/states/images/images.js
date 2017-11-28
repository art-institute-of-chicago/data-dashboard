(function () {

    angular
        .module('app')
        .controller('ImagesAdvancedController',  Controller);

    Controller.$inject = [];

    function Controller() {

        var vm = this;

        // Defaults to AIC's Pentagram color
        vm.color = color.hsl( 344, 91, 37 );

        activate();

        return vm;

        function activate() {

        }

    }

})();
