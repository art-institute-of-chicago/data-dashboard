(function () {

    angular
        .module('app')
        .controller('ImagesAdvancedController',  Controller);

    Controller.$inject = ['SearchService'];

    function Controller(SearchService) {

        var vm = this;

        // Defaults to AIC's Pentagram color
        vm.color = color.hsl( 344, 91, 37 );

        vm.images = [];

        vm.search = search;

        vm.getThumbnail = getThumbnail;
        vm.onImageLoad = onImageLoad;

        activate();

        return vm;

        function activate() {
            search();
        }

        function search() {

            var hsl = vm.color.hsl().object();

            SearchService.get( {

                body: getQuery( hsl ),
                start: 0,
                rows: 24,

            }).then( function( data ) {

                vm.images = data.results;

            });

        }

        function getThumbnail( entity ) {

            if( !entity || !entity.id ) {
                return;
            }

            // Old site retrieves 256x256, but the layout is unconstraned vertically
            return window.config.IIIF_URL + "/" + entity.id + "/full/!256,843/0/default.jpg";

        }

        function getQuery( color ) {

            var hv = 30;
            var sv = 40;
            var lv = 40;

            return {
                "resources": "images",
                "fields": [
                    "id",
                    "lqip",
                    "width",
                    "height",
                ],
                "sort": {
                    "color.percentage": "desc",
                },
                "query": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "color.h": {
                                        "gte": Math.max( color.h - hv/2, 0 ),
                                        "lte": Math.min( color.h + hv/2, 360 )
                                    }
                                }
                            },
                            {
                                "range": {
                                    "color.s": {
                                        "gte": Math.max( color.s - sv/2, 0 ),
                                        "lte": Math.min( color.s + sv/2, 100 )
                                    }
                                }
                            },
                            {
                                "range": {
                                    "color.l": {
                                        "gte": Math.max( color.l - lv/2, 0 ),
                                        "lte": Math.min( color.l + lv/2, 100 )
                                    }
                                }
                            },
                            // We can't do an exists[field]=lqip, b/c lqip isn't indexed
                            {
                                "exists": {
                                    "field": "width"
                                }
                            },
                            {
                                "exists": {
                                    "field": "height"
                                }
                            }
                        ]
                    }
                }
            };

        }

        // Directive allows us to pass the event: `img-onload="vm.onImageLoad( $event )"`
        function onImageLoad( image ) {

            image.is_loaded = true;

        }

    }

})();
