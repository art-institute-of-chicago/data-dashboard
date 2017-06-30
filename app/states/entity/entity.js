(function () {

    angular
        .module('app')
        .controller('EntityController',  Controller);

    Controller.$inject = ['$scope', '$state', '$model'];

    function Controller( $scope, $state, $model ) {

        var vm = this;

        vm.models = $model.list();
        vm.form = {};
        vm.open = open;

        $scope.$on('$stateChangeSuccess', activate );

        activate();

        return vm;

        function activate() {

            // https://github.com/angular-ui/ui-router/issues/1372
            vm.form.id = $state.params.id;
            vm.form.model = $model.get( $state.current.name );

        }

        function open( model, id ) {

            $state.go( model.states.entity, {
                // model is optional since it has a default
                id: id,
            });

        }

    }

})();
