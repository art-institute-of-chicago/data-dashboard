(function () {

    angular
        .module('app')
        .controller('DefaultEntityController',  Controller);

    Controller.$inject = ['$stateParams', '$injector'];

    function Controller( $stateParams, $injector ) {

        var ModelService = $injector.get( $stateParams.model );

        var vm = this;

        vm.entity = null;
        vm.route = null;

        vm.refresh = refresh;

        vm.getLpmSolrLink = getLpmSolrLink;
        vm.getFedoraLink = getFedoraLink;

        activate();

        return vm;

        function activate() {

            if( !$stateParams.id ) {

                var request = ModelService.list( { params: { limit: 1 } } );

                // Just for testing: if id is omitted, get first one in the list
                request.promise.then( function( response ) {

                    vm.entity = ModelService.find( response.data.data[0].id ).clean;
                    vm.route = ModelService.route( vm.entity.id );

                });

            } else {

                vm.entity = ModelService.find( $stateParams.id ).clean;
                vm.route = ModelService.route( $stateParams.id );

            }

        }

        function refresh() {

            vm.entity = ModelService.detail( vm.entity.id ).cache.clean;

        }

        function getLpmSolrLink( entity ) {

            if(!entity) {
                return;
            }

            return "https://localhost/solr/core/select?wt=json&q=id:" + entity.lake_guid;

        }

        function getFedoraLink( entity ) {

            if(!entity) {
                return;
            }

            var guid = entity.lake_guid;

            if(!guid) {
                return;
            }

            return "https://localhost/fcrepo/rest/core"
                + "/" + guid.substr(0, 2)
                + "/" + guid.substr(2, 2)
                + "/" + guid.substr(4, 2)
                + "/" + guid.substr(6, 2)
                + "/" + guid;

        }

    }

})();
