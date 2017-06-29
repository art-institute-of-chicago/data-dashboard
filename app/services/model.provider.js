(function () {
    'use strict';

    angular
        .module('app')
        .provider('$model', Provider);

    Provider.$inject = ['$injector', '$provide', '$stateConfigProvider'];

    function Provider( $injector, $provide, $stateConfigProvider ) {

        var _models = [];

        this.models = models;

        // See entity.js
        this.$get = function() {
            return _models;
        };

        return this;

        function models( items ) {

            items.forEach( function( item ) {

                model( item );

            });

        }

        function model( item ) {

            // An item could be either a string or an object
            // A string is assumed to be item.name, which means
            //   all other fields will follow default convention
            if( typeof item === 'string' ) {
                item = { name: item };
            }

            // Ensure that name is hyphen-case
            item.name = changeCase.paramCase( item.name );

            // Ensure that name is singular
            item.name = pluralize( item.name, 1 );

            // We can now assume that item is an object
            // TODO: Refine structure and field names
            var model = {
                name: item.name,
                label: changeCase.titleCase( item.name ),
                service: changeCase.pascalCase( item.name ) + 'Service',
                states: {
                    entity: 'entity.' + item.name,
                },
                // model.api will be passed to DataFactory
                api: {
                    route: pluralize( item.name ),
                    id_field: 'id',
                    wrapper: 'data',
                },
            };

            // Save the configuration for retrieval
            _models.push( model );

            // Check to see if a custom service exists
            // React to $injector:unpr
            try {

                // AngularJS by convention appends Provider to any provider-derived entities,
                // i.e. services and factories. None of the ModelServices are instantiated yet,
                // since we will be calling this during the app's config phase, so we can't
                // check for their existence yet, but their Providers *do* exist!
                // https://stackoverflow.com/questions/17485900/injecting-dependencies-in-config-modules-angularjs
                $injector.get( model.service + 'Provider' );

            } catch( error ) {

                // console.log( 'Creating service: ' + model.service );

                // Create a new service
                var service = DefaultModelServiceFactory( model );

                // Register the new service
                // https://stackoverflow.com/questions/21374274/angularjs-creating-factory-during-run-time
                $provide.factory( model.service, service );

            }

            // Check to see if a custom route is already defined
            if( !$stateConfigProvider.exists( model.states.entity ) ) {

                // console.log( 'Creating state: ' + model.states.entity );

                $stateConfigProvider.state( model.states.entity, {
                    url: '/' + pluralize( model.name ) + '/:id',
                    params: {
                        model: model.service
                    }
                });

            }

        }

    }

    function DefaultModelServiceFactory( model ) {

        return DefaultModelService;

        DefaultModelService.$inject = ['DataFactory'];

        function DefaultModelService( DataFactory ) {

            return new DataFactory.Collection( model.api );

        }

    }

})();
