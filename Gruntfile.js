module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! <%= pkg.name.replace(".js", "") %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name.replace(".js", "") %>.min.js': ['<%= requirejs.compile.options.out %>']
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          optimize: 'none',
          name: 'lib/almond/almond',
          baseUrl: 'src',
          include: ['main'],
          mainConfigFile: 'src/main.js',
          out: 'dist/radiotag.js',
          wrap: {
            startFile: 'src/wrap/_start.js',
            endFile: 'src/wrap/_end.js'
          }
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

  grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('default', ['requirejs', 'jshint', 'uglify', 'qunit']);
};
