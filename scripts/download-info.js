function getDownloadsInfo(cb, url, result) {
  url = url || 'https://api.bitbucket.org/2.0/repositories/DokucraftSaga/dokucraft-website/downloads?pagelen=100&fields=-values.links,-values.user,-values.type'
  result = result || {}
  $.getJSON(url, function(data) {
    for (var i = data.values.length - 1; i >= 0; i--) {
      var file = data.values[i]
      var fileName = file.name
      delete file.name
      result[fileName] = file
    }
    if (data.hasOwnProperty('next')) {
      getDownloadsInfo(cb, data.next, result)
    } else {
      cb(result)
    }
  })
}