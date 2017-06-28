(function () {
    'use strict';

    angular
        .module('app')
        .provider('$stateConfig', Provider);

    // $state.get() allows us to check if a state exists,
    // but there's no equivallent method for $stateProvider.
    // https://github.com/angular-ui/ui-router/issues/265

    // $stateConfigProvider stores the state's name,
    //   before deferring  calls to $stateProvider.

    // Use $stateConfigProvider.exists() to check if a state exists

    Provider.$inject = ['$stateProvider'];

    function Provider( $stateProvider ) {

        var states = [];

        this.state = state;
        this.decorator = $stateProvider.decorator;

        this.exists = exists;

        this.$get = function() {
            return this;
        };

        return this;

        function state( name, data ) {

            states.push( name );

            $stateProvider.state.apply( this, arguments );

            return this;

        }

        function exists( name ) {

            return states.indexOf( name ) > -1;

        }

    }

})();
