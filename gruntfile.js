module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass_globbing: {
            dist: {
                files: {
                    'app/map.scss': ['app/**/*.scss','!app/*'],
                },
                options: {
                    useSingleQuotes: false,
                    signature: '// Generated with grunt-sass-globbing'
                }
            }
        },
        sass: {
            dist: {
                options: {
                    noCache: true,
                    sourcemap: "none",
                    unixNewlines: true,
                    style: "expanded",
                    lineNumbers: false
                },
                files: {
                    'app/app.css' : 'app/app.scss'
                }
            }
        },
        watch: {
            styles: {
                files: ['**/*.scss'],
                tasks: ['sass_globbing', 'sass'],
                options: {
                    event: ['changed', 'added', 'deleted']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-sass-globbing');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['sass_globbing', 'sass', 'watch'] );

};