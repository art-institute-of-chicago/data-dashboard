(function () {
    'use strict';

    angular
        .module('app')
        .factory('CacheFactory', Service);

    Service.$inject = ['$q'];

    function Service( $q ) {

        // CacheFactory allows data sharing across controllers.
        // It's meant to be injected into a resource service.
        // Then, create a new instance of Cache, like so:
        //
        //     var cache = new CacheFactory.Cache('id');
        //
        // Be sure to swap 'id' for the actual id field, if it's not `id`
        // In each of the resource's CRUD methods, chain...
        //
        //     .then( cache.update, cache.error )
        //
        // ...after calling the relevant ApiService method, and use...
        //
        //     cache.list()
        //     cache.detail()
        //
        // ...to get the shareable objects.

        return {
            Cache: Cache,
        }

        function Cache( ID_FIELD, WRAPPER ) {

            // For some resources, this could be e.g. foobar_id
            // We are treating it as a constant, essentially.
            ID_FIELD = ID_FIELD || 'id';

            // Some resources might be wrapped in an object, e.g. "data"
            // WRAPPER is the property that contains our data
            // If it is omitted, assume data array is the root element

            // Each item in cache.both is { clean: {}, dirty: {} }
            // It is up to the view or the controller to choose one

            // For convenience, you can also do...
            //
            //     list().dirty, list().clean
            //
            // ...to get an array of non-nested datums on a list level

            var cache = {
                clean: [],
                dirty: [],
                both: [],
            };

            return {
                update: update,
                error: error,
                list: list,
                detail: detail,
            };

            function update( response ) {

                // Determine if we need to unwrap the data
                if( WRAPPER && response.data.hasOwnProperty( WRAPPER ) ) {
                    response.data = response.data[ WRAPPER ];
                }

                // Determine we are updating all data
                if( response.data.constructor === Array ) {
                    return updateData( response.data );
                }

                // Assume that otherwise, we're updating one datum
                return updateDatum( response.data );

            }


            function error( response ) {

                console.error( 'Unable to update cache' );

                return $q.reject( response );

            }


            function list( ) {

                return cache;

            }


            function detail( id ) {

                return getDatum( id, cache.both );

            }


            function updateData( data ) {

                angular.forEach( data, function( datum, i ) {

                    updateDatum( datum );

                });

                return cache;

            }


            function updateDatum( newDatum ) {

                // Find the datum in `cache.both` collection.
                // Get its `clean` and `dirty` sub-objects.
                // Replace their properties with those from the server.

                // This also updates datums in cache.clean and cache.dirty,
                //   since they point to the same objects.

                var id = newDatum[ ID_FIELD ];
                var oldDatum = getDatum( id, cache.both );

                angular.merge( oldDatum.clean, newDatum );
                angular.merge( oldDatum.dirty, newDatum );

                // See also: DataFactory.Collection.find()
                // Creates tight coupling, but prevents find() making server
                // calls even after detail() or list() has been called.
                oldDatum.initialized = true;

                return newDatum;

            }


            function getDatum( id, source ) {

                // Ensure id is an integer
                id = parseInt( id );

                // Search for existing datum
                for( var i = 0; i < source.length; i++ ) {

                    // Assumes that an id is set on all items
                    if( source[i].id == id ) {
                        return source[i];
                    }

                }

                // If the datum wasn't found,
                // add it to all the arrays

                var clean = {};
                var dirty = {};
                var both = {
                    clean: clean,
                    dirty: dirty,
                };

                // I'd like to ignore ID_FIELD when possible
                clean[ID_FIELD] = clean.id = id;
                dirty[ID_FIELD] = dirty.id = id;
                both[ID_FIELD] = both.id = id;

                cache.clean.push( clean );
                cache.dirty.push( dirty );
                cache.both.push( both );

                // Figure out what to return
                switch( source ) {

                    case cache.clean:
                        return clean;
                    break;

                    case cache.dirty:
                        return dirty;
                    break;

                    default:
                        return both;
                    break;

                }

            }

        }

    }

})();