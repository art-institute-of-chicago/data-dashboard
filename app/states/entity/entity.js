(function () {

    angular
        .module('app')
        .controller('EntityController',  Controller);

    Controller.$inject = ['$scope', '$state', '$model'];

    function Controller( $scope, $state, $model ) {

        var vm = this;

        vm.models = $model.list();
        vm.form = {};

        // https://stackoverflow.com/a/31434737/1943591
        vm.form.instance = {};

        vm.open = open;
        vm.resetIdInput = resetIdInput;

        $scope.$on('$stateChangeSuccess', activate );

        activate();

        return vm;

        function activate() {

            // https://github.com/angular-ui/ui-router/issues/1372
            vm.form.id = $state.params.id;
            vm.form.model = $model.get( $state.current.name );

            // vm.form.instance isn't linked to the form on initial load
            if( vm.form.instance.$setPristine ) {
                vm.form.instance.$setPristine();
            }

        }

        function open( model, id ) {

            $state.go( model.states.entity, {
                // model is optional since it has a default
                id: id,
            });

        }

        function resetIdInput( isPristine ) {

            // If the form is $pristine, reset the id input
            // Useful after state change, for convenience
            // We can't query $pristine here: it gets changed before this fires
            if( isPristine ) {
                vm.form.id = null;
            }

        }

    }

})();
