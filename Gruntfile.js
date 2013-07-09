'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'src',
    dist: 'build',
    demoDist: 'demo/src/lib'
  };

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {}

  grunt.initConfig({
    yeoman: yeomanConfig,
    
     connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      }
    },
    
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      demo: '<%= yeoman.demoDist %>'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    
    concat: {
      dist: {
        files: {
          '<%= yeoman.dist %>/angular-persistence.js': [
            '<%= yeoman.app %>/{,*/}*.mdl.js',
            '<%= yeoman.app %>/{,*/}*.js',
            '!<%= yeoman.app %>/{,*/}*.test.js'
          ]
        }
      }
    },
    
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: '*.js',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/angular-persistence.min.js': [
            '<%= yeoman.dist %>/angular-persistence.js'
          ]
        }
      }
    },
    copy: {
      demo: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.dist %>',
          dest: '<%= yeoman.demoDist %>',
          src: '*.*'
        }]
      }
    }

  });

  grunt.registerTask('test', [
    'clean:dist',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    // 'jshint',
    'test',
    'concat'
    // 'ngmin',
    // 'uglify'
  ]);

  grunt.registerTask('build-demo', [
    'build',
    'copy:demo'
  ]);


  grunt.registerTask('default', ['build']);
};
