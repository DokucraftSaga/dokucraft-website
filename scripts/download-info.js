function getDownloadsInfo(cb, result, endCursor, offset) {
  result = result || {}
  offset = offset || 0
  var graphQLQuery = JSON.stringify({query: [
    'query {',
    '  organization(login:"Dokucraft") {',
    '    repository(name:"Dokucraft-Releases") {',
    '      release(tagName:"v1.0") {',
    '        releaseAssets(first:100'+(endCursor ? ', after:"' + endCursor + '"' : '')+') {',
    '          totalCount',
    '          nodes {',
    '            name',
    '            size',
    '            downloadCount',
    '            updatedAt',
    '          }',
    '          pageInfo {',
    '            endCursor',
    '          }',
    '        }',
    '      }',
    '    }',
    '  }',
    '}'].join('\n')})
  $.ajax({
    method: 'POST',
    dataType: 'json',
    url: 'https://api.github.com/graphql',
    data: graphQLQuery,
    headers: { 'Authorization': 'bearer acff4bca713a370d8baf95a5536088bcbbb9dd8c' }
  }).done(function(data) {
    data.data.organization.repository.release.releaseAssets.nodes.forEach(function(file) {result[file.name] = file})
    if (data.data.organization.repository.release.releaseAssets.totalCount > offset) {
      getDownloadsInfo(cb, result, data.data.organization.repository.release.releaseAssets.pageInfo.endCursor, offset + 100)
    } else {
      cb(result)
    }
  })
}