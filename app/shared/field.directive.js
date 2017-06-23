(function () {
    'use strict';

    angular
        .module('app')
        .directive('field', Directive);

    Directive.$inject = [];

    function Directive() {
        return {
            restrict: 'E',
            template: '<div class="row">'
                    + '<div class="col-sm-2">{{ key }}</div>'
                    + '<div class="col-md-10">{{ value }}</div>'
                    + '</div>',
            scope: {
                key: '@',
                value: '=',
            }
        }
    }

}());