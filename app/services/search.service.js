(function () {
    'use strict';

    angular
        .module('app')
        .factory('SearchService', Service);

    Service.$inject = ['$http', '$q', 'esFactory'];

    // TODO: Use the API service, somehow?
    function Service( $http, $q, esFactory ) {

        var elastic = esFactory({
            host: "http://localhost:9200/",
        });

        // define public interface
        return {
            get: search,
        };


        // returns an angular promise
        function search( params ) {

            // Standardize resolution
            var deferred = $q.defer();

            elastic.search({

                index: 'data_aggregator:v1',
                from: params.start,
                size: params.rows,
                q: params.query ? null : params.query,
                body: params.query ? getElasticBody( params.query ) : null,

            }).then( function( response ) {

                deferred.resolve( {

                    results: response.hits.hits.map( function( item ) {
                        return item._source;
                    }),
                    total: response.hits.total,
                    start: params.start,

                });

            }, function( response ) {

                deferred.reject( response );

            });

            return deferred.promise;

        }


        function getElasticBody( query ) {

            return {

                "query": {
                    "bool": {
                        "should": [
                            {
                                "match" : {
                                    "_all": {
                                        "query": query
                                    }
                                }
                            },
                            {
                                // Boost essential works
                                "terms" : {
                                    "id": [185651,183077,151358,99539,189595,187528,102611,111401,91620,18757,51185,55249,14968,65290,75644,106538,59787,103347,104094,100829,76571,154237,154238,149776,120154,44018,56905,102295,105105,184672,111442,25865,72801,97916,190558,36161,15401,69780,64724,185905,65916,40619,151371,63178,104031,46327,6565,83905,111628,117266,56682,156538,196323,71829,105203,131541,192890,104043,189289,189290,144272,190224,102963,191197,188540,188845,64339,159136,70207,185963,70003,35376,42566,88724,43060,76279,183277,73216,185180,111380,56731,9512,11272,127644,185222,88977,89856,24645,153244,24548,21023,13853,34286,49195,86340,142526,58540,69109,99766,16964,73417,79379,76244,83642,157156,100472,4884,147003,86385,146991,186049,71396,35198,97402,68823,102234,184362,146988,93345,191371,47149,90583,107069,110634,100250,160222,147513,146989,76054,90443,187165,157160,159824,192689,137125,148306,140645,186392,182728,154232,184193,184186,181091,160226,181774,189207,184095,181145,34116,156442,189715,57819,126981,147508,6596,50330,68769,186047,103943,111400,107300,148412,43714,46230,50909,25332,52560,16231,15468,16169,184324,16327,184371,23972,25853,199854,112092,44741,87479,84709,27310,73413,95998,11434,5848,60755,16488,4788,93900,57051,27307,16362,102591,111317,110663,144969,4758,4796,44892,14598,81512,11723,20684,81558,14655,11320,110507,14572,27992,16487,80607,19339,28560,64818,61128,60812,111436,28067,16568,87045,109330,66039,79307,111060,9503,8624,8991,80062,185766,30839,27987,91194,144361,2816,109819,153701,109275,27984,7124,111654,118746,37761,185760,72728,5357,61608,185184,84241,151424,59426,34181,111642,20509,38930,145681,63554,157056,66683,66434,119454,55384,70739,50157,100079,50148,13720,100089,87163,63234,188844,191454,117271,160201,187155,110881,23506,105073,60031,90536,20432,103887,76295,102131,52736,50276,76779,61603,111164,160144,18709,16776,76395,72726,70202,23684,135430,83889,111810,131385,122054,90300,99602,149681,85533,189600,36132,70443,80479,189775,52679,86421,49691,150739,180298,185619,155969,64884,109686,16298,4575,4081,105466,59847,62042,80084,146953,869,43145,23333,111610,111559,4773,4428,16499,14574,20579,16571,14591,16146,62371,154235,109926,49702,150054,55706,90048,30709,146701,81564,28849,111377,97910,64729,8958,31285,87643,119521,76240,109780,79600,23700,65868,93811,61428,64276,111617,117188,49714,125660,2189,146905,89403,127859,88793,79507,92975,234781,76816,76869,210511,193664,210482,16551,11393,7021,207293,156474,234972,49686,105800,118661,217201,191556,198809,34299,15563,220272,229354,229351,229406,223309,129884,234004,227420,24836,234433,218612,199002,229510,189932,230189,225016,221885,229866]
                                }
                            }
                        ]
                    }
                }
            }

        }

    }

})();
