(function () {

    angular
        .module('app')
        .controller('SidebarController',  Controller);

    Controller.$inject = ['$scope', 'ApiService'];

    function Controller($scope, ApiService) {

        var vm = this;

        vm.is_prod = null;

        activate();

        return vm;

        function activate() {

            vm.is_prod = ApiService.getEnv() === 'prod';

            $scope.$watch( 'vm.is_prod', function( nv, ov ) {

                if( vm.is_prod === null || nv === ov )
                {
                    return;
                }

                ApiService.setEnv( vm.is_prod ? 'prod' : 'test' );

            });

        }

    }

})();
