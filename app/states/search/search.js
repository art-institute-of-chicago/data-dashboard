(function () {

    angular
        .module('app')
        .controller('SearchController',  Controller);

    Controller.$inject = ['SearchService'];

    function Controller(SearchService) {

        var vm = this;

        vm.results = [];

        vm.search = search;

        activate();

        return vm;

        function activate() {

            // Execute a serach w/ empty query to populate table
            search();

        }

        function search( query ) {

            SearchService.get( query ).then( function( response ) {

                vm.results = response.data.response.docs;

            });

        }

    }

})();
