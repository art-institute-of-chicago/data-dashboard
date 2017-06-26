(function () {

    angular
        .module('app')
        .controller('ArtworkController',  Controller);

    Controller.$inject = ['$stateParams', 'ArtworkService'];

    function Controller( $stateParams, ArtworkService ) {

        var vm = this;

        vm.entity = null;
        vm.route = null;

        activate();

        return vm;

        function activate() {

            if( !$stateParams.id ) {

                // Just for testing: if id is omitted, get first one in the list
                ArtworkService.list( { limit: 1 } ).promise.then( function() {

                    vm.entity = ArtworkService.list( { limit: 1 } ).cache.clean[0];
                    vm.route = ArtworkService.route( vm.entity.id );

                });

            } else {

                vm.entity = ArtworkService.detail( $stateParams.id ).cache.clean;
                vm.route = ArtworkService.route( $stateParams.id );

            }



        }

    }

})();
