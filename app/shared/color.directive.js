(function () {
    'use strict';

    angular
        .module('app')
        .directive('color', Directive);

    Directive.$inject = [];

    function Directive() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function( scope, element, attr, ngModel ) {

                // TODO: Double-check that this is stable
                if( !ngModel ) {
                    return;
                }

                var parser = function( value ) {

                    // Mitigate unassigned values
                    if(!value) {
                        return 0;
                    }

                    return color( value );

                };

                var formatter = function( value ) {

                    // Prevent 'undefined' turning up in form fields
                    if( typeof value === 'undefined' ) {
                        value = color('#000000');
                    }

                    return value.hex();
                };

                ngModel.$parsers.unshift( parser );
                ngModel.$formatters.push( formatter );

            }
        }
    }
}());
