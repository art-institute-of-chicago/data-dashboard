(function () {
    'use strict';

    angular
        .module('app')
        .factory('ArtworkService', Service);

    Service.$inject = ['DataFactory'];

    function Service( DataFactory ) {

        return new DataFactory.Collection({
            route: 'artworks',
            id_field: 'id',
            wrapper: 'data',
        });

    }

})();
