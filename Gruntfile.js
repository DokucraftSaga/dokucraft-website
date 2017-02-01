module.exports = function(grunt) {
  var data = grunt.file.readJSON('src/data.json');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    pug: {
      frontpage: {
        options: {
          basedir: './',
          data: {
            menu: data.menu,
            packs: data.packs
          }
        },
        src: 'src/templates/frontpage.pug',
        dest: 'dist/index.html'
      },
      structured: {
        options: {
          basedir: './',
          data: {
            menu: data.menu
          }
        },
        expand: true,
        src: '**/*.pug',
        dest: 'dist/',
        cwd: 'src/structured',
        ext: '.html'
      }
    },
    concat: {
      panorama: {
        src: [
          'src/libraries/threejs/Three.js',
          'src/libraries/threejs/PointerLockControls.js',
          'src/libraries/ResizeSensor.js',
          'src/scripts/panorama.js'
        ],
        dest: 'dist/scripts/panorama.js'
      }
    },
    uglify: {
      frontpage: {
        src: 'src/scripts/frontpage.js',
        dest: 'dist/scripts/frontpage.min.js'
      },
      menubar: {
        src: 'src/scripts/menubar.js',
        dest: 'dist/scripts/menubar.min.js'
      },
      downloads: {
        src: 'src/scripts/downloads.js',
        dest: 'dist/scripts/downloads.min.js'
      },
      panoramaLoader: {
        src: 'src/scripts/panorama-loader.js',
        dest: 'dist/scripts/panorama-loader.min.js'
      },
      panorama: {
        src: 'dist/scripts/panorama.js',
        dest: 'dist/scripts/panorama.min.js'
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      base: {
        files: {
          'dist/css/base.css': [
            'src/css/base.css',
            'src/css/menubar.css'
          ]
        }
      },
      info: {
        files: {
          'dist/css/info.css': [
            'src/css/base.css',
            'src/css/menubar.css',
            'src/css/info.css'
          ]
        }
      },
      frontpage: {
        files: {
          'dist/css/frontpage.css': [
            'src/css/base.css',
            'src/css/menubar.css',
            'src/css/spinner.css',
            'src/css/frontpage.css'
          ]
        }
      },
      pack: {
        files: {
          'dist/css/pack.css': [
            'src/css/base.css',
            'src/css/menubar.css',
            'src/css/pack.css'
          ]
        }
      },
      structured: {
        expand: true,
        src: '**/*.css',
        dest: 'dist/',
        cwd: 'src/structured'
      }
    },
    copy: {
      resources: {
        expand: true,
        cwd: 'src/resources/',
        src: '**',
        dest: 'dist/resources/'
      },
      structured: {
        expand: true,
        cwd: 'src/structured/',
        src: [ '**', '!**/*.{pug,css}' ],
        dest: 'dist/'
      }
    }
  });

  for (var i = 0; i < data.packs.length; i++) {
    var pack = data.packs[i];

    var o = {
      options: {
        basedir: './',
        data: {
          menu: data.menu,
          tags: data.tags,
          pack: pack
        }
      },
      files: {}
    };
    
    o.files['dist' + pack.page + '.html'] = 'src/templates/pack.pug';

    grunt.config(['pug', pack.page], o);
  }

  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'copy', 'pug']);
};