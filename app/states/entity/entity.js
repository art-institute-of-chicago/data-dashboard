(function () {

    angular
        .module('app')
        .controller('EntityController',  Controller);

    Controller.$inject = ['$state'];

    function Controller( $state ) {

        var vm = this;

        vm.models = null;
        vm.form = null;
        vm.open = open;

        activate();

        return vm;

        function activate() {

            vm.models = [
                {
                    name: 'Artwork',
                    service: 'ArtworkService',
                    states: {
                        entity: 'entity.artwork',
                    },
                },
            ];

            vm.form = {
                state: vm.models[0].states.entity,
                id: null,
            };

        }

        function open( state, id ) {

            console.log( arguments );

            $state.go( state, { id: id } );

        }

    }

})();
