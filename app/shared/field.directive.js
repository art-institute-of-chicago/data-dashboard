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
                    + '<div class="col-sm-3 text-ellipsis"><strong title="{{ key }}">{{ key }}</strong></div>'
                    + '<div class="col-sm-9">{{ value }}</div>'
                    + '</div>',
            scope: {
                key: '@',
                value: '=',
            }
        }
    }

}());
