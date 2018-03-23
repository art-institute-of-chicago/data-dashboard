(function () {

    angular
        .module('app')
        .controller('ImagesAdvancedController',  Controller);

    Controller.$inject = ['SearchService'];

    function Controller(SearchService) {

        var vm = this;

        // Defaults to AIC's Pentagram color
        vm.color = color.hsl( 344, 91, 37 );

        vm.artworks = [];

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

            SearchService.get(

                getQuery( hsl )

            ).then( function( data ) {

                vm.artworks = data.results;

            });

        }

        function getThumbnail( artwork ) {

            if( !artwork || !artwork.image_id ) {
                return;
            }

            // Old site retrieves 256x256, but the layout is unconstraned vertically
            return window.config.IIIF_URL + "/" + artwork.image_id + "/full/!256,843/0/default.jpg";

        }

        function getQuery( color ) {

            var hv = 30;
            var sv = 40;
            var lv = 40;

            return {
                "resources": "artworks",
                "fields": [
                    "id",
                    "image_id",
                    "thumbnail.lqip",
                    "thumbnail.width",
                    "thumbnail.height",
                ],
                "from": 0,
                "limit": 24,
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
                                    "field": "thumbnail.width"
                                }
                            },
                            {
                                "exists": {
                                    "field": "thumbnail.height"
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
