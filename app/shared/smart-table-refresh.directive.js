(function () {
    'use strict';

    angular
        .module('app')
        .directive('stRefresh', Directive);

    Directive.$inject = [];

    function Directive() {
        return {
            require:'stTable',
            restrict: 'A',
            link: function( scope, element, attr, tableCtrl ) {

                // https://github.com/lorenzofox3/Smart-Table/issues/363
                scope.$on("refreshTable", function() {
                    tableCtrl.pipe( tableCtrl.tableState(), tableCtrl );
                });

            }

        }
    }
}());
