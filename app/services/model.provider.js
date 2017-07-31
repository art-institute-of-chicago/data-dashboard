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

            return {
                list: list,
                get: get,
            };

            function list() {
                return _models;
            }

            function get( value ) {

                // Expect value to be a model name

                // Allow passing $state.current.name
                var state = value.lastIndexOf('.');
                if( state ) {
                    value = value.substring( state + 1 );
                }

                // TODO: Allow searching by other fields?

                // Unsupported in IE
                return _models.find( function( model ) {
                    return model.name === value;
                });

            }

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
                    entity: 'root.entity.' + item.name,
                },
                // model.api will be passed to DataFactory
                api: {
                    route: pluralize( item.name ),
                    id_field: 'id',
                    wrapper: 'data',
                },
            };

            // Process definitions of linked models
            model.api.linked = item.linked ? getLinkedModels( item.linked ) : null;

            // Process embedded models
            model.api.include = item.include ? getIncludedModels( item.include ) : null;

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

    function getLinkedModels( items ) {

        // Our goal is to take the (relatively) convenient config structure
        // and turn it into something useable by the DataFactory.Collection
        var models = []


        items.forEach( function( item ) {

            if( typeof item === 'string' ) {
                item = { model: item };
            }

            // Ensure that the model name is hyphen-case
            item.model = changeCase.paramCase( item.model );

            // Record whether the passed model name is plural
            item.many = item.many || pluralize( item.model ) === item.model;

            // Ensure the recorded model name is singular
            item.model = pluralize( item.model, 1 );

            // All fields are underscored and singular
            var field = changeCase.snakeCase( item.model );

            // Expect _id and (opt) title, vs. expecting an _ids array.
            if( item.many ) {

                // Expect _ids array
                item.field = item.field || field + '_ids';

                // Set label to the plural form of the model name
                item.label = item.label || changeCase.titleCase( pluralize( item.model ) );

            } else {

                // Expect _id field
                item.field = item.field || field + '_id';

                // Expect (optional) title field, which usually does not end w/ _title
                item.title = item.title || field;

            }

            item.service = item.service || changeCase.pascalCase( item.model ) + 'Service'

            models.push( item );

        });

        return models;

    }

    function getIncludedModels( items ) {

        var models = [];

        items.forEach( function( item ) {

            // Field is the outgoing include expected by Laravel
            if( typeof item === 'string' ) {
                item = { field: item };
            }

            // Derive the model name
            item.model = item.model || item.field;

            // Ensure that the model name is hyphen-case
            item.model = changeCase.paramCase( item.model );

            // Ensure that the model name is singular
            item.model = pluralize( item.model, 1 );

            // Derive the service name
            item.service = item.service || changeCase.pascalCase( item.model ) + 'Service'

            models.push( item );

        });

        return models;

    }

})();
