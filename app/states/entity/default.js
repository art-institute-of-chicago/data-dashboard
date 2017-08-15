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

        vm.getCdsLink = getCdsLink;
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

        // TODO: Account for other data services
        function getCdsLink( entity ) {

            if(!entity) {
                return;
            }

            return window.config.CDS_URL + "/" + ModelService.settings.route + "/" + entity.id;

        }

        function getLpmSolrLink( entity ) {

            if(!entity) {
                return;
            }

            return window.config.LPM_SOLR_URL + "/select?wt=json&q=id:" + entity.lake_guid;

        }

        function getFedoraLink( entity ) {

            if(!entity) {
                return;
            }

            var guid = entity.lake_guid;

            if(!guid) {
                return;
            }

            return window.config.LPM_FEDORA_URL
                + "/" + guid.substr(0, 2)
                + "/" + guid.substr(2, 2)
                + "/" + guid.substr(4, 2)
                + "/" + guid.substr(6, 2)
                + "/" + guid;

        }

    }

})();
