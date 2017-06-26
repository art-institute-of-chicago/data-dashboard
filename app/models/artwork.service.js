(function () {
    'use strict';

    angular
        .module('app')
        .factory('ArtworkService', Service);

    Service.$inject = ['DataFactory'];

    function Service( DataFactory ) {

        var collection = new DataFactory.Collection( 'id', 'data' );

        return {
            list: list,
            detail: detail,
        };

        function list( config ) {

            return collection.list( 'artworks', config );

        }

        function detail( id ) {

            return collection.detail( 'artworks/' + id );

        }

    }

})();
