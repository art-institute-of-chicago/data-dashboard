(function () {

    angular
        .module('app')
        .controller('SearchController',  Controller);

    Controller.$inject = [];

    function Controller() {

        var vm = this;

        vm.results = [];

        activate();

        return vm;

        function activate() {

            // TODO: Replace w/ real data
            vm.results =[
                {
                    id: "collections.agent.12727",
                    api_id: "12727",
                    api_model: "agent",
                    api_link: "http://data-aggregator.dev/api/v1/agents/12727",
                    title: "Funk, Chadd",
                }
            ];

        }

    }

})();
