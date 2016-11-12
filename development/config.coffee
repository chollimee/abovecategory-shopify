path = (paths) ->
  # (\\/|\\\\) is (\|/), windows or unix-style directory separators
  paths.join && paths = paths.join('|')
  paths = paths.replace(/\//g, '(\\/|\\\\)')
  new RegExp('^' + paths)
  
exports.config =
  optimize: false
  plugins:
    babel:
      presets: ['react']
      pattern: /\.(es6|jsx)$/
    uglify:
      mangle: false
      compress:
        global_defs: 
          DEBUG: false
    autoReload:
      enabled: false
  conventions:
    ignored: [ path('app/assets') ]
    #assets: [ path('app/assets') ]
  modules2:
    definition: false
    wrapper: false
  paths:
    public: '../theme/assets'
    watched: ['app']
  files:
    javascripts:
      joinTo:
        'app.js': /^app/
        'vendor.js': /^vendor|bower_components/
      order:
        before: [
          # "bower_components/react/react-with-addons.js",
          # "bower_components/react-async/react-async.js",
          # "bower_components/react-router-component-bower/react-router-component.js"
        ]

    stylesheets:
      joinTo:
        'app.css': /^(app|vendor|bower_components)/
      order:
        before: [
          "bower_components/components-font-awesome/font-awesome.css",
          "app/styles/fonts.scss"
        ]

