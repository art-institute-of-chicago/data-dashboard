(function () {

    angular
        .module('app')
        .config(routing)
        .config(models)
        .config(rejections)
        .run(scroll)
        .run(redirection);

    routing.$inject = ['$stateConfigProvider', '$urlRouterProvider'];

    function routing( $stateConfigProvider, $urlRouterProvider ) {

        // default route
        $urlRouterProvider.otherwise('/');

        // decorator: set reasonable defaults for entity.* routes
        $stateConfigProvider.decorator('views', function( state, parent ) {

            var config = state.self;

            // console.log( config );

            if( config.name.match(/^root.entity\./) ) {

                config.views = config.views || {};

                // Relatively targets the unnamed view in this state's parent state.
                var view = config.views[''] = config.views[''] || {};

                view.templateUrl = view.templateUrl || 'states/entity/default.html';
                view.controller = view.controller || 'DefaultEntityController';
                view.controllerAs = 'vm';

            }

            return parent(state);

        });

        // app routes
        $stateConfigProvider
            .state('redirect', {
                url: '/',
                redirectTo: {
                    state: 'root.entity.artworks',
                    params: { id: null }
                },
            })
            // Use as parent state to split screen b/w search + detail
            .state('root', {
                abstract: true,
                // Omit URL so that it's not prepended to everything
                views: {
                    'list@': {
                        templateUrl: 'states/search/search.html',
                        controller: 'SearchController',
                        controllerAs: 'vm',
                    },
                },

            })
            // Use as parent state to add topbar
            .state('root.entity', {
                abstract: true,
                // Omit URL so that it's not prepended to everything
                views: {
                    'detail@': {
                        templateUrl: 'states/entity/entity.html',
                        controller: 'EntityController',
                        controllerAs: 'vm',
                    },
                },
                data: {
                    cssClassnames: 'aic-state-entity'
                }
            })
            .state('root.entity.artworks', {
                url: '/artworks/:id',
                params: {
                    model: 'ArtworkService'
                }
            })
            .state('root.entity.agents', {
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
                        label: 'Copyright Representatives',
                        field: 'copyright_representative_ids',
                        model: 'agents',
                    },
                    // TODO: sets and parts? Subresources?
                    {
                        label: 'Sets',
                        field: 'set_ids',
                        model: 'artworks',
                    },
                    {
                        label: 'Parts',
                        field: 'part_ids',
                        model: 'artworks',
                    },
                    'tours',
                    'publications',
                    'sites',
                ],
                include: [
                    'artists',
                    'categories',
                    {
                        field: 'copyrightRepresentatives',
                        model: 'agents',
                    },
                    {
                        field: 'parts',
                        model: 'artworks',
                    },
                    {
                        field: 'sets',
                        model: 'artworks',
                    },
                    // 'dates',
                    // 'catalogues',
                    // 'committees',
                    // 'terms',
                    // 'images',
                    'publications',
                    'tours',
                ],
            },

            {
                name: 'agent',
                linked: [
                    'agent-type'
                ],
            },

            {
                name: 'artist',
                linked: [
                    'agent-type'
                ],
            },


            {
                name: 'venue',
                linked: [
                    'agent-type'
                ],
            },

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
                    'department',
                    'gallery',
                    'artworks',
                    'venues',
                ],
            },

            {
                name: 'image',
                linked: [
                    'artist',
                    'categories',
                    'artworks',
                ],
                include: [
                    'categories',
                    'artworks',
                ],
            },

            {
                name: 'video',
                linked: [
                    'artist',
                    'categories',
                ],
                include: [
                    'categories'
                ],
            },


            {
                name: 'link',
                linked: [
                    'artist',
                    'categories',
                ],
                include: [
                    'categories'
                ],
            },

            {
                name: 'sound',
                linked: [
                    'artist',
                    'categories',
                ],
                include: [
                    'categories'
                ],
            },

            {
                name: 'text',
                linked: [
                    'artist',
                    'categories',
                ],
                include: [
                    'categories'
                ],
            },

            {
                name: 'shop-category',
                linked: [
                    {
                        label: 'Parent Shop Cat.',
                        field: 'parent_id',
                        model: 'shop-category',
                    },
                    {
                        label: 'Child Shop Cat.',
                        field: 'child_ids',
                        model: 'shop-categories',
                    },
                ],
                include: [
                    {
                        field: 'children',
                        model: 'shop-categories',
                    },
                ],
            },

            {
                name: 'product',
                linked: [
                    {
                        field: 'category_ids',
                        model: 'shop-categories',
                    },
                ],
                include: [
                    {
                        field: 'categories',
                        model: 'shop-categories',
                    },
                ],
            },

            'event',
            'tour',
            'tour-stop',
            'publication',

            {
                name: 'site',
                linked: [
                    'artworks',
                    'exhibition',
                ],
            },

        ]);

    }


    rejections.$inject = ['$qProvider'];

    function rejections( $qProvider ) {

        $qProvider.errorOnUnhandledRejections(false);

    }


    scroll.$inject = ['$rootScope'];

    function scroll( $rootScope ) {

        // Scroll to top on state change
        // https://stackoverflow.com/questions/26444418/autoscroll-to-top-with-ui-router-and-angularjs
        $rootScope.$on('$stateChangeSuccess', function() {
            document.body.scrollTop = document.documentElement.scrollTop = 0;
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
