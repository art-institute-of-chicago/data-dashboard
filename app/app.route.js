(function () {

    angular
        .module('app')
        .config(routing)
        .config(rejections)
        .run(scroll)
        .run(redirection);

    routing.$inject = ['$stateConfigProvider', '$urlRouterProvider'];

    function routing( $stateConfigProvider, $urlRouterProvider ) {

        // default route
        $urlRouterProvider.otherwise('/');

        // app routes
        $stateConfigProvider
            .state('redirect', {
                url: '/',
                redirectTo: {
                    state: 'root.images',
                    params: { id: null }
                },
            })
            // Use as parent state to add sidebar
            .state('root', {
                abstract: true,
                // Omit URL so that it's not prepended to everything
                views: {
                    'sidebar@': {
                        templateUrl: 'states/sidebar/sidebar.html',
                    },
                }
            })
            // Advanged image search
            .state('root.images', {
                url: '/images',
                views: {
                    'main@': {
                        templateUrl: 'states/images/images.html',
                        controller: 'ImagesAdvancedController',
                        controllerAs: 'vm',
                    },
                }
            });
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
