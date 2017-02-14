if ('pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document) {
  function loadJS(path) {
    var scrTag = document.createElement('script')
    scrTag.type = 'text/javascript'
    scrTag.src = path
    document.head.appendChild(scrTag)
  }

  var element = document.body

  var pointerlockchange = function (event) {
    if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
      if ($('#panorama-viewer').length == 0) {
        $('body').append($('<div>').addClass('fullscreen-blocker').append(
          $('<div>').attr('id', 'panorama-viewer')
        ))
        $(document).click(function(e) {
          if ($(e.target).closest('#panorama-button').length === 0) {
            document.exitPointerLock()
          }
        })
        loadJS('/scripts/panorama.min.js')
      }
    }
  }

  document.addEventListener('pointerlockchange', pointerlockchange, false)
  document.addEventListener('mozpointerlockchange', pointerlockchange, false)
  document.addEventListener('webkitpointerlockchange', pointerlockchange, false)

  $('#panorama-button').click(function() {
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock
    element.requestPointerLock()
  })
} else {
  $('#panorama-button').remove()
}