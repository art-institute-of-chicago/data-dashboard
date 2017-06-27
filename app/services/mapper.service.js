(function () {
    'use strict';

    angular
        .module('app')
        .factory('MapperService', Service);

    Service.$inject = [];

    function Service() {

        return {
            getLabel: getLabel,
        }

        function getLabel( key ) {

            // By default, transform snake case into title case
            return snakeToTitle( key );

        }


        // https://gist.github.com/kkiernan/91298079d34f0f832054
        function snakeToTitle(str) {

            var custom = {
                'citi': 'CITI',
                'id': 'ID',
                'ids': 'IDs',
                'in': 'in',
                'of': 'of',
                'source': 'source',
                'url': 'URL',
                'urls': 'URLs',
            };

            return str.split('_').map( function ( item ) {

                if( custom.hasOwnProperty( item ) ) {
                    return custom[item];
                }

                return item.charAt(0).toUpperCase() + item.substring(1);

            }).join(' ');

        }

    }

})();
