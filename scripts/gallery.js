function showFullscreen(path) {
  $('body').append($('<div>').addClass('fullscreen-blocker').append(
    $('<img>').addClass('fullscreen-image').attr('src', path)
  ).click(function() {
    $('.fullscreen-blocker').fadeOut(250, function() {
      $(this).remove()
    })
  }))
}

$(document).ready(function() {
  $('.gallery-image').click(function(e) {
    showFullscreen($(e.currentTarget).attr('image'))
  })
})