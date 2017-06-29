(function () {
    'use strict';

    angular
        .module('app')
        .directive('tfield', Directive);

    Directive.$inject = [ '$state', '$model', 'MapperService'];

    function Directive( $state, $model, MapperService ) {
        return {
            restrict: 'A',
            template: `
                <td class="text-ellipsis">
                    <strong title="{{ label }}">{{ label }}</strong>
                </td>
                <td>

                    <ul ng-if="isArray( value )">
                        <li ng-repeat="item in value track by $index">{{ item }}</li>
                    </ul>

                    <span ng-if="!isArray( value )">{{ value }}</span>

                </td>
            `,
            scope: {
                key: '@',
                value: '=',
            },
            link: function( scope, element, attr ) {

                // Remember the current model
                var model = $model.get( $state.current.name );

                var isTitle = model.api.linked.some( function(e) { return e.title === scope.key } );

                if( isTitle ) {
                    element.remove();
                }

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
