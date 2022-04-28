(function () {

    angular
        .module('app')
        .controller('ImagesAdvancedController',  Controller);

    Controller.$inject = ['$rootScope', 'SearchService'];

    function Controller($rootScope, SearchService) {

        var vm = this;

        // Defaults to AIC's Pentagram color
        vm.color = color.hsl( 344, 91, 37 );
        vm.text = "monet";

        vm.filter_on_view = false;

        vm.artworks = [];

        vm.searchColor = searchColor;
        vm.searchText = searchText;
        vm.searchImage = searchImage;

        vm.getThumbnail = getThumbnail;
        vm.onImageLoad = onImageLoad;

        vm.query = null;

        activate();

        return vm;

        function activate() {

            searchText();

            $rootScope.$on('envChanged', function() {
                search();
            });

        }

        function searchColor( color ) {

            var color = vm.color = color || vm.color;

            var hsl = color.hsl().object();
            var query = getColorQuery( hsl );

            search( query );

        }

        function searchText( text ) {

            var text = vm.text = text || vm.text;

            var query = getTextQuery( text );

            search( query );

        }

        // https://stackoverflow.com/questions/23945494/use-html5-to-resize-an-image-before-upload
        function searchImage() {

            var file = document.forms['imageUpload']['imageFile'].files[0];

            if (!file.type.match(/image.*/)) {
                console.log('File is not an image');
                return;
            }

            var reader = new FileReader();

            reader.onload = function (readerEvent) {

                var image = new Image();

                image.onload = function (imageEvent) {

                    console.log('An image has been loaded');

                    var canvas = document.createElement('canvas'),
                        max_size = 128,
                        width = image.width,
                        height = image.height;
                    if (width > height) {
                        if (width > max_size) {
                            height *= max_size / width;
                            width = max_size;
                        }
                    } else {
                        if (height > max_size) {
                            width *= max_size / height;
                            height = max_size;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                    var dataUrl = canvas.toDataURL('image/jpeg');

                    // TODO: Chop off mimetype header from base64 string?

                    var query = getImageSearchQuery( dataUrl );

                    SearchService.imageSearch( query ).then( function( data ) {

                        vm.artworks = data.results;

                    });

                }

                image.src = readerEvent.target.result;
            }

            reader.readAsDataURL(file);

        }

        function search( query ) {

            // If there's no query, and no saved query, ignore
            if( !query && !vm.query )
            {
                return;
            }

            // Save the last query for env-switching
            vm.query = query = query || vm.query;

            // Run the query and update artworks with results
            SearchService.get( query ).then( function( data ) {

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

        function getBaseQuery( ) {

            return {
                "resources": "artworks",
                "fields": [
                    "id",
                    "title",
                    "image_id",
                    "is_boosted",
                    "is_on_view",
                    "thumbnail",
                    "thumbnail.lqip",
                    "thumbnail.width",
                    "thumbnail.height",
                    "artist_display",
                ],
                "from": 0,
                "limit": 24,
            };

        }

        function getBaseSearchQuery() {

            return lodash.mergewith( getBaseQuery(), {
                "query": {
                    "bool": {
                        "must": [
                            // TODO: Move `exists` here?
                        ]
                    }
                }
            }, customizer );

        }

        function getTextQuery( text ) {

            var query = { "q": text };

            if( vm.filter_on_view ) {

                // TODO: Abstract lodash.mergewith into separate function
                query = lodash.mergewith( query, {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "is_on_view": vm.filter_on_view
                                    }
                                }
                            ]
                        }
                    }
                }, customizer );

            }

            return lodash.mergewith( getBaseSearchQuery(), query, customizer );

        }

        function getColorQuery( color ) {

            var hv = 30;
            var sv = 40;
            var lv = 40;

            var query = {
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

            return lodash.mergewith( getBaseSearchQuery(), query, customizer );

        }

        function getImageSearchQuery( base64 ) {

            var query = {
                "file": base64,
            };

            return lodash.mergewith( getBaseQuery(), query, customizer );

        }

        // Directive allows us to pass the event: `img-onload="vm.onImageLoad( $event )"`
        function onImageLoad( image ) {

            image.is_loaded = true;

        }

        // https://lodash.com/docs/4.17.5#mergeWith
        function customizer(objValue, srcValue) {

            // https://stackoverflow.com/a/4775741/1943591
            if ( objValue instanceof Array ) {

                return objValue.concat(srcValue);

            }

        }

    }

})();
