(function () {
    'use strict';

    angular
        .module('app')
        .directive('field', Directive);

    Directive.$inject = ['MapperService'];

    function Directive( MapperService ) {
        return {
            restrict: 'E',
            template: `
                <div class="row">
                    <div class="col-sm-3 text-ellipsis">
                        <strong title="{{ label }}">{{ label }}</strong>
                    </div>
                    <div class="col-sm-9">

                        <ul ng-if="isArray( value )">
                            <li ng-repeat="item in value">{{ item }}</li>
                        </ul>

                        <span ng-if="!isArray( value )">{{ value }} </span>

                    </div>
                </div>
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
