(function () {

    angular
        .module('app')
        .controller('SearchController',  Controller);

    Controller.$inject = ['SearchService'];

    function Controller(SearchService) {

        var vm = this;

        vm.results = [];
        vm.suggestions = [];

        vm.pipe = pipe;

        activate();

        return vm;

        function activate() {

            // pipe will be triggered automatically on page load

        }

        function pipe( tableState, tableCtrl ) {

            var query = tableState.search.predicateObject ? tableState.search.predicateObject.$ : null;

            SearchService.get( {

                query: query,
                start: tableState.pagination.start,
                rows: tableState.pagination.number,

            }).then( function( data ) {

                vm.results = data.results;

                // TODO: Combine autocomplete and phrase suggestions?
                vm.suggestions = data.autocomplete;

                tableState.pagination.start = data.start;
                tableState.pagination.totalItemCount = data.total;
                tableState.pagination.numberOfPages = Math.ceil( data.total / tableState.pagination.number );

            });

        }

    }

})();
