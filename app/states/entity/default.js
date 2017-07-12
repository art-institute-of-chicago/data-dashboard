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

                var request = ModelService.list( { params: { limit: 1 } } );

                // Just for testing: if id is omitted, get first one in the list
                request.promise.then( function( response ) {

                    vm.entity = ModelService.find( response.data.data[0].id ).clean;
                    vm.route = ModelService.route( vm.entity.id );

                });

            } else {

                vm.entity = ModelService.detail( $stateParams.id ).cache.clean;
                vm.route = ModelService.route( $stateParams.id );

            }



        }

    }

})();
