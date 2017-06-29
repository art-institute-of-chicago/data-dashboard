(function () {

    angular
        .module('app')
        .config(routing)
        .config(models)
        .config(rejections)
        .run(services)
        .run(redirection);

    routing.$inject = ['$stateConfigProvider', '$urlRouterProvider'];

    function routing( $stateConfigProvider, $urlRouterProvider ) {

        // default route
        $urlRouterProvider.otherwise('/');

        // decorator: set reasonable defaults for entity.* routes
        $stateConfigProvider.decorator('views', function( state, parent ) {

            var config = state.self;

            // console.log( config );

            if( config.name.match(/^entity\./) ) {

                config.templateUrl = config.templateUrl || 'states/entity/default.html';
                config.controller = config.controller || 'DefaultEntityController';
                config.controllerAs = 'vm';

            }

            return parent(state);

        });

        // app routes
        $stateConfigProvider
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
                params: {
                    model: 'ArtworkService'
                }
            })
            .state('entity.agent', {
                url: '/agents/:id',
                params: {
                    model: 'AgentService'
                }
            });

    }


    models.$inject = ['$modelProvider'];

    function models( $modelProvider ) {

        $modelProvider.models([

            {
                name: 'artwork',
                linked: [
                    {
                        // Testing partial overrides
                        // Incomplete, but default format
                        field: 'department_id',
                        title: 'department',
                        model: 'department',
                    },
                    'object-type',
                    'gallery',
                    'artists',
                    'categories',
                    {
                        // Custom id field, but normal model
                        field: 'copyright_representative_ids',
                        model: 'agents',
                    },
                    // TODO: sets and parts? Subresources.
                ],
            },

            {
                name: 'agent',
                linked: [
                    'agent-type'
                ],
            },

            'artist',
            'venue',

            'department',
            'object-type',

            {
                name: 'category',
                linked: [
                    {
                        field: 'parent_id',
                        model: 'category',
                    }
                ],
            },

            'agent-type',

            {
                name: 'gallery',
                linked: [
                    'categories',
                ],
            },

            {
                name: 'exhibition',
                linked: [
                    'gallery',
                    'artworks',
                    'venue',
                ],
            },

            'image',
            'video',
            'link',
            'sound',
            'text',

            'shop-category',
            'product',
            'event',

        ]);

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
