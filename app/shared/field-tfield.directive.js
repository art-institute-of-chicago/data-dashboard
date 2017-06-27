(function () {
    'use strict';

    angular
        .module('app')
        .directive('tfield', Directive);

    Directive.$inject = ['MapperService'];

    function Directive( MapperService ) {
        return {
            restrict: 'A',
            template: `
                <td class="text-ellipsis">
                    <strong title="{{ label }}">{{ label }}</strong>
                </td>
                <td>

                    <ul ng-if="isArray( value )">
                        <li ng-repeat="item in value">{{ item }}</li>
                    </ul>

                    <span ng-if="!isArray( value )">{{ value }}</span>

                </td>
            `,
            scope: {
                key: '@',
                value: '=',
            },
            link: function( scope, element, attr ) {

                scope.label = MapperService.getLabel( scope.key );

                scope.isArray = function( value ) {

                    // Wait until the value is ready...
                    if( !value ) {
                        return false;
                    }

                    return value.constructor === Array;

                }

            }
        }
    }

}());
