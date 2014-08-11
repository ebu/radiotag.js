module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! <%= pkg.name.replace(".js", "") %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name.replace(".js", "") %>.min.js': ['dist/<%= pkg.name %>']
        }
      }
    },

    browserify: {
      'dist/radiotag.js': ['src/main.js'],
      options: {
        bundleOptions: {
          standalone: '<%= pkg.name.replace(".js", "") %>'
        }
      }
    },

    jshint: {
      files: ['src/*.js', 'src/utils/*.js', 'src/radiotag/*.js'],
      options: {
        globals: {
          console: true,
          module: true,
          document: true
        },
        jshintrc: '.jshintrc'
      }
    },

    qunit: {
      all: ['test/**/*.html']
    },

    watch: {
      files: ['src/*', 'src/utils/*', 'src/radiotag/*.js', 'test/*.js'],
      tasks: ['requirejs', 'uglify', 'qunit']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('default', ['browserify', 'jshint', 'uglify', 'qunit']);
};
