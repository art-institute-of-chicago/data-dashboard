(function () {
    'use strict';

    angular
        .module('app')
        .factory('AgentService', Service);

    Service.$inject = ['DataFactory'];

    function Service( DataFactory ) {

        return new DataFactory.Collection({
            route: 'agents',
            id_field: 'id',
            wrapper: 'data',
        });

    }

})();
