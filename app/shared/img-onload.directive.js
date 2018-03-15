(function () {
    'use strict';

    angular
        .module('app')
        .directive('imgOnload', Directive);

    Directive.$inject = ['$parse'];

    function Directive( $parse ) {
        return {
            restrict: 'A',
            link: function( scope, element, attr ) {

                // https://stackoverflow.com/a/26781900/1943591
                var fn = $parse( attr.imgOnload );

                element.on('load', function (event) {
                    scope.$apply(function() {
                       fn(scope, { $event: event });
                    });
                });

            }
        }
    }

}());
