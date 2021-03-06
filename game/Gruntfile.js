module.exports = function(grunt) {
    grunt.initConfig({
       watch: {
           options: {
              livereload: true
          },
          html: {
            files: ['**/*.html']
          },
          js: {
            files: ['js/*.js','js/multi/*.js']
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
              baseUrl: '/Users/simonoliver/Downloads/drone_warfare/game/js',
              mainConfigFile: '/Users/simonoliver/Downloads/drone_warfare/game/js/configmulti.js',
              modules:[
                {
                  name: 'configmulti'
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