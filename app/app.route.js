(function () {

    angular
        .module('app')
        .config(routing)
        .config(rejections)
        .run(services)
        .run(redirection);

    routing.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routing( $stateProvider, $urlRouterProvider ) {

        // default route
        $urlRouterProvider.otherwise('/');

        // app routes
        $stateProvider
            .state('root', {
                url: '/',
                redirectTo: {
                    state: 'entity.artwork',
                    params: { id: null }
                },
            })
            // Use as parent state to add topbar
            .state('entity', {
                abstract: true,
                // Omit URL so that it's not prepended to everything
                templateUrl: 'states/entity/entity.html',
                controller: 'EntityController',
                controllerAs: 'vm',
                data: {
                    cssClassnames: 'aic-state-entity'
                }
            })
            .state('entity.artwork', {
                url: '/artworks/:id',
                templateUrl: 'states/entity/artwork/artwork.html',
                controller: 'ArtworkController',
                controllerAs: 'vm',
                data: {
                    cssClassnames: 'aic-state-artwork'
                }
            });

    }


    rejections.$inject = ['$qProvider'];

    function rejections( $qProvider ) {

        $qProvider.errorOnUnhandledRejections(false);

    }


    services.$inject = ['ApiService'];

    function services( ApiService ) {

        // TODO: Load config from file?
        ApiService.init({
            url: 'http://data-aggregator.dev/api/v1/',
        });

    }


    redirection.$inject = ['$rootScope', '$state'];

    function redirection( $rootScope, $state ) {

        // Allows us to add redirects to routes via redirectTo
        // https://stackoverflow.com/a/29491412/1943591
        $rootScope.$on('$stateChangeStart', function( event, to, params ) {

            if( to.redirectTo ) {

                event.preventDefault();

                if( typeof to.redirectTo === 'object' ) {
                    $state.go(to.redirectTo.state, to.redirectTo.params, {location: 'replace'})
                }else{
                    $state.go(to.redirectTo, params, {location: 'replace'})
                }

            }

        });

    }

})();