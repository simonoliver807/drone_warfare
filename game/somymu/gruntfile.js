module.exports = function(grunt) {

  grunt.initConfig({
    availabletasks: {
      	tasks: {}
    },
    connect: {
        server: {
          options: {
            port: 9000,
            hostname: '*',
            livereload: 35729
          }
        }
      },
    jshint: {
      files: ['Gruntfile.js', 'js/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
   pkg: grunt.file.readJSON('package.json'),
   sass: {
       dist: {
           files: {
               'css/style.css' : 'sass/style.scss'
           }
       }
   },
   watch: {
      options: {
        livereload: true,
      },
      html: {
        files: ['index.html'],
      },
//      js: {
//        files: ['js/*.js'],
//        tasks: ['jshint'],
//      },
      js: {
        files: ['js/*.js']
      },
      css: {
        files: ['sass/*.scss'],
        tasks: ['sass']
      }
    }
      
  });
   grunt.loadNpmTasks('grunt-contrib-connect');
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-sass');
   grunt.loadNpmTasks('grunt-contrib-watch');
      
   grunt.registerTask('default', ['connect','watch']);
};