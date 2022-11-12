module.exports = function(grunt) {
  // Build options
  var noYAML = grunt.option('no-yaml') || false
  var useLocalResources = grunt.option('local-resources') || false

  var data = grunt.file.readJSON('data.json')
  var resourceRepo = useLocalResources ? '/resources/' : 'https://gh.dokucraft.co.uk/dokucraft-website-resources/'
  var fileRepo = '/dl/' // Redirects to 'https://bitbucket.org/DokucraftSaga/dokucraft-website/downloads/'

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
            noYAML: noYAML,
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
      frontpage: {
        src: [
          'scripts/download-info.js',
          'scripts/frontpage.js'
        ],
        dest: '../dist/scripts/frontpage.js'
      },
      downloads: {
        src: [
          'scripts/download-info.js',
          'scripts/downloads.js'
        ],
        dest: '../dist/scripts/downloads.js'
      },
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
        src: '../dist/scripts/frontpage.js',
        dest: '../dist/scripts/frontpage.min.js'
      },
      menubar: {
        src: 'scripts/menubar.js',
        dest: '../dist/scripts/menubar.min.js'
      },
      gallery: {
        src: 'scripts/gallery.js',
        dest: '../dist/scripts/gallery.min.js'
      },
      downloads: {
        src: '../dist/scripts/downloads.js',
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
      unavailable: {
        files: {
          '../dist/css/unavailable.css': [
            'css/base.css',
            'css/menubar.css',
            'css/unavailable.css'
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
      },
      dataJSON: {
        src: 'data.json',
        dest: '../dist/data.json'
      }
    },
    clean: {
      options: { force: true },
      build: [
        '../dist/*',
        '!../dist/.git/*',
        '!../dist/CNAME'
      ],
      temp: [
        '../dist/scripts/*.js',
        '!../dist/scripts/panorama.min.js',
        '../dist/css'
      ]
    }
  })

  for (var key in data.packs) {
    var pack = data.packs[key]

    grunt.config(['pug', key], {
      options: {
        basedir: '../',
        data: {
          menu: data.menu,
          tagStyles: data.tagStyles,
          page: key,
          pack: pack,
          resources: resourceRepo,
          fileRepo: fileRepo
        }
      },
      src: 'templates/pack.pug',
      dest: '../dist/' + key + '/index.html'
    })
  }

  for (var key in data.unavailable) {
    var name = data.unavailable[key]

    grunt.config(['pug', key], {
      options: {
        basedir: '../',
        data: {
          menu: data.menu,
          name: name
        }
      },
      src: 'templates/unavailable.pug',
      dest: '../dist/' + key + '/index.html'
    })
  }

  for (var key in data.redirect) {
    var redirTo = data.redirect[key]
    if (!redirTo.match(/^https?:\/\//i)) redirTo = '/' + redirTo

    grunt.config(['pug', key], {
      options: {
        basedir: '../',
        data: {
          redirectTo: redirTo
        }
      },
      src: 'templates/redirect.pug',
      dest: '../dist/' + key + '/index.html'
    })
  }

  if (useLocalResources) {
    grunt.config(['copy', 'local-resources'], {
      expand: true,
      cwd: '../resources/',
      src: '**',
      dest: '../dist/resources/'
    })
  }

  grunt.loadNpmTasks('grunt-contrib-pug')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-clean')

  grunt.registerTask('default', ['clean:build', 'concat', 'uglify', 'cssmin', 'copy', 'pug', 'clean:temp'])
};