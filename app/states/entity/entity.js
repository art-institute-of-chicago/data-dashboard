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
                {
                    name: 'Agent',
                    service: 'AgentService',
                    states: {
                        entity: 'entity.agent',
                    },
                },
            ];

            vm.form = {
                model: vm.models[0],
                id: null,
            };

        }

        function open( model, id ) {

            $state.go( model.states.entity, {
                // model is optional since it has a default
                id: id,
            });

        }

    }

})();
