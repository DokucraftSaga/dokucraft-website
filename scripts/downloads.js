var formatBytes = function(bytes) {
   if(bytes == 0) return '0 B'
   var k = 1024
   var sizes = ['B', 'KB', 'MB', 'GB', 'TB']
   var i = Math.floor(Math.log(bytes) / Math.log(k))
   return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]

getDownloadsInfo(function(files) {
  $('.download-row').each(function(i, e) {
    var row = $(e)
    var file = files[row.attr('file')]
    row.find('.size').text(formatBytes(file.size))
    row.find('.count').text(file.downloads + parseInt(row.attr("offset")))
    var date = new Date(file.created_on)
    row.find('.date').text(months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear())
    if (((new Date) - date) < 1209600000) { // Two weeks
      row.find('.name').append($('<span>').addClass('tag new').text("New"))
    }
  })
})