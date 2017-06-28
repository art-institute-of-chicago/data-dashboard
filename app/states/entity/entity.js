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

            vm.models = $model;

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
