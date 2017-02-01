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
        $('#pack-header').append($('<div></div>').attr('id', 'panorama-viewer'))
        loadJS('/scripts/panorama.min.js')
      }
    }
  }

  document.addEventListener('pointerlockchange', pointerlockchange, false)
  document.addEventListener('mozpointerlockchange', pointerlockchange, false)
  document.addEventListener('webkitpointerlockchange', pointerlockchange, false)

  $('#pack-header').append(
    $('#panorama-button').click(function() {
      element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock
      element.requestPointerLock()
    })
  )
} else {
  $('#panorama-button').remove()
}