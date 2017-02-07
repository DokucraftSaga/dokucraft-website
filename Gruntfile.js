module.exports = function(grunt) {
  var data = grunt.file.readJSON('../resources/data.json');
  var resourceRepo = 'https://dokucraftsaga.github.io/dokucraft-website-resources/'

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    pug: {
      frontpage: {
        options: {
          basedir: '../',
          data: {
            menu: data.menu,
            packs: data.packs,
            resources: resourceRepo
          }
        },
        src: 'templates/frontpage.pug',
        dest: '../dist/index.html'
      },
      structured: {
        options: {
          basedir: '../',
          data: {
            menu: data.menu,
            noYAML: grunt.option('no-yaml') || false,
            resources: resourceRepo
          }
        },
        expand: true,
        src: '**/*.pug',
        dest: '../dist/',
        cwd: 'structured',
        ext: '.html'
      }
    },
    concat: {
      panorama: {
        src: [
          'libraries/threejs/Three.js',
          'libraries/threejs/PointerLockControls.js',
          'libraries/ResizeSensor.js',
          'scripts/panorama.js'
        ],
        dest: '../dist/scripts/panorama.js'
      }
    },
    uglify: {
      frontpage: {
        src: 'scripts/frontpage.js',
        dest: '../dist/scripts/frontpage.min.js'
      },
      menubar: {
        src: 'scripts/menubar.js',
        dest: '../dist/scripts/menubar.min.js'
      },
      downloads: {
        src: 'scripts/downloads.js',
        dest: '../dist/scripts/downloads.min.js'
      },
      panoramaLoader: {
        src: 'scripts/panorama-loader.js',
        dest: '../dist/scripts/panorama-loader.min.js'
      },
      panorama: {
        src: '../dist/scripts/panorama.js',
        dest: '../dist/scripts/panorama.min.js'
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      base: {
        files: {
          '../dist/css/base.css': [
            'css/base.css',
            'css/menubar.css'
          ]
        }
      },
      info: {
        files: {
          '../dist/css/info.css': [
            'css/base.css',
            'css/menubar.css',
            'css/info.css'
          ]
        }
      },
      frontpage: {
        files: {
          '../dist/css/frontpage.css': [
            'css/base.css',
            'css/menubar.css',
            'css/spinner.css',
            'css/frontpage.css'
          ]
        }
      },
      pack: {
        files: {
          '../dist/css/pack.css': [
            'css/base.css',
            'css/menubar.css',
            'css/pack.css'
          ]
        }
      },
      error404: {
        files: {
          '../dist/css/404.css': [
            'css/base.css',
            'css/menubar.css',
            'css/404.css'
          ]
        }
      }
    },
    copy: {
      resources: {
        expand: true,
        cwd: 'resources/',
        src: '**',
        dest: '../dist/resources/'
      },
      structured: {
        expand: true,
        cwd: 'structured/',
        src: [ '**', '!**/*.{pug,css}' ],
        dest: '../dist/'
      }
    },
    clean: {
      options: { force: true },
      build: ['../dist/*', '!../dist/.git/*'],
      temp: ['../dist/scripts/*.js', '!../dist/scripts/panorama.min.js']
    }
  });

  for (var i = 0; i < data.packs.length; i++) {
    var pack = data.packs[i];

    var o = {
      options: {
        basedir: '../',
        data: {
          menu: data.menu,
          tags: data.tags,
          pack: pack,
          resources: resourceRepo
        }
      },
      src: 'templates/pack.pug',
      dest: '../dist' + pack.page + '.html'
    };

    grunt.config(['pug', pack.page], o);
  }

  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['clean:build', 'concat', 'uglify', 'cssmin', 'copy', 'pug', 'clean:temp']);
};