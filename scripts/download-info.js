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
    headers: { 'Authorization': 'bearer fd059d24db08bf89606be39aab3f8ac635986fa2' }
  }).done(function(data) {
    data.data.organization.repository.release.releaseAssets.nodes.forEach(function(file) {result[file.name] = file})
    if (data.data.organization.repository.release.releaseAssets.totalCount > offset) {
      getDownloadsInfo(cb, result, data.data.organization.repository.release.releaseAssets.pageInfo.endCursor, offset + 100)
    } else {
      cb(result)
    }
  })
}

/*async function getDownloadsInfoUnauthorized(cb) {
  const data = await fetch('https://api.github.com/repos/Dokucraft/Dokucraft-Releases/releases/23891043').then(e => e.json())
  const result = {}
  data.assets.forEach(file => {result[file.name] = file})
  cb(result)
}*/