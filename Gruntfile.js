module.exports = function(grunt) {
    grunt.initConfig({
       watch: {
           options: {
              livereload: true
          },
          php: {
            files: ['**/*.php']
          },
          js: {
            files: ['**/*.js']
          },
          css: {
            files: ['style/*.css'],
            // tasks: ['sass']
          },
          txt: {
            files: ['**/*.txt']
          }
        },
        requirejs: {
          compile: {
            options: {
              baseUrl: '/Applications/MAMP/htdocs/game/js',
              mainConfigFile: '/Applications/MAMP/htdocs/game/js/config.js',
              modules:[
                {
                  name: 'config'
                }
              ],
              dir: 'target/',
              error: function(done, err) {
                grunt.log.warn(err);
                done();
              }
            }
          }
        }

  });

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.registerTask('default', ['watch']);   


}