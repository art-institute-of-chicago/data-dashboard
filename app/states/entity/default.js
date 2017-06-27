(function () {

    angular
        .module('app')
        .controller('DefaultEntityController',  Controller);

    Controller.$inject = ['$stateParams', '$injector'];

    function Controller( $stateParams, $injector ) {

        var ModelService = $injector.get( $stateParams.model );

        var vm = this;

        vm.entity = null;
        vm.route = null;

        activate();

        return vm;

        function activate() {

            if( !$stateParams.id ) {

                // Just for testing: if id is omitted, get first one in the list
                ModelService.list( { limit: 1 } ).promise.then( function() {

                    vm.entity = ModelService.list( { limit: 1 } ).cache.clean[0];
                    vm.route = ModelService.route( vm.entity.id );

                });

            } else {

                vm.entity = ModelService.detail( $stateParams.id ).cache.clean;
                vm.route = ModelService.route( $stateParams.id );

            }



        }

    }

})();
