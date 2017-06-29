(function () {

    angular
        .module('app')
        .controller('EntityController',  Controller);

    Controller.$inject = ['$state', '$model'];

    function Controller( $state, $model ) {

        var vm = this;

        vm.models = null;
        vm.form = null;
        vm.open = open;

        activate();

        return vm;

        function activate() {

            vm.models = $model.list();

            vm.form = {
                model: $model.get( $state.current.name ),
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
