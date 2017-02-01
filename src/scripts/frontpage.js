var cfp = 0
var ppp = 4

var bLazy = new Blazy({
  success: function(element) {
    setTimeout(function(){
      $(element).find('.spinner-container').remove()
    }, 200)
  }
})

function isIEorEdge() {
  if (navigator.appName == 'Microsoft Internet Explorer'){
    return true; // IE
  }
  else if(navigator.appName == 'Netscape'){                       
     return navigator.appVersion.indexOf('Edge') > -1; // EDGE
  }

  return false;
}

function showTab(e, tabID) {
  $(e.target).parent().parent().find('.tab').removeClass('active')
  $(e.target).addClass('active')
  $('.tab-content').css('display', 'none')
  $('#' + tabID).css('display', 'flex')
  cfp = 0
  $('.tab-content .pack:nth-child(n+'+(ppp+1)+')').hide()
  $('.tab-content .pack:nth-child(-n+'+ppp+')').fadeIn(250)
  bLazy.revalidate()
}

function nextFeaturedPage(e) {
  if (cfp < 12 / ppp - 1) {
    cfp++
    $('.tab-content .pack').hide()
    $('.tab-content .pack:nth-child(n+'+(cfp*ppp+1)+'):nth-child(-n+'+((cfp+1)*ppp)+')').fadeIn(250)
    $('.prev.page-button').addClass('active')
    if (cfp == 12 / ppp - 1)
      $('.next.page-button').removeClass('active')
  }
  bLazy.revalidate()
}

function prevFeaturedPage(e) {
  if (cfp > 0) {
    cfp--
    $('.tab-content .pack').hide()
    $('.tab-content .pack:nth-child(n+'+(cfp*ppp+1)+'):nth-child(-n+'+((cfp+1)*ppp)+')').fadeIn(250)
    $('.next.page-button').addClass('active')
    if (cfp == 0)
      $('.prev.page-button').removeClass('active')
  }
  bLazy.revalidate()
}

function widthUpdate(w) {
  if (w < 800) {
    ppp = 1
  } else if (w < 1200) {
    ppp = 2
  } else if (w < 1600) {
    ppp = 3
  } else {
    ppp = 4
  }
  $('.tab-content .pack').hide()
  $('.tab-content .pack:nth-child(n+'+(cfp*ppp+1)+'):nth-child(-n+'+((cfp+1)*ppp)+')').show()
}

function formatBytes(bytes) {
  if(bytes == 0) return '0 B'
  var k = 1024
  var sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  var i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

$(window).resize(function() {
  widthUpdate($(window).width())
})

$(document).ready(function() {
  widthUpdate($(window).width())

  $('#search-box').keyup(function() {
    $('#no-results-hint').hide()
    var txt = $('#search-box').val().toLowerCase()
    if (txt.length == 0) {
      $('#all-packs .pack').each(function(i, e) {
        $(e).fadeIn(250)
      })
    } else {
      $('#all-packs .pack').each(function(i, e) {
        if (~$(e).find('.pack-name').text().toLowerCase().indexOf(txt)) {
          $(e).fadeIn(250)
        } else {
          $(e).hide()
        }
      })
      if ($('#all-packs').children(':visible').length == 0) {
        $('#no-results-hint').fadeIn(250)
      }
    }
    if (!isIEorEdge()) { // Buggy in IE and Edge because of their specific CSS rules
      $('html, body').animate({
        scrollTop: $('#all-packs').offset().top - 80
      }, 250)
    }
  })

  var getAllDLs = function(url, arr, cb) {
    $.getJSON(url, function(data) {
      arr.push.apply(arr, data.values)
      if (data.hasOwnProperty('next')) {
        getAllDLs(data.next, arr, cb)
      } else {
        cb(arr)
      }
    })
  }

  var getFile = function(files, name) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i]
      if (file.name == name) return file
    }
  }

  var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]

  getAllDLs('https://api.bitbucket.org/2.0/repositories/DokucraftSaga/dokucraft-website/downloads', [], function(files) {
    var featurablePacks = packList.slice(3)
    $('.tab-content .spinner-container').remove()

    var totalDLs = []
    for (var i = featurablePacks.length - 1; i >= 0; i--) {
      var dls = 0
      for (var j = featurablePacks[i].downloads.length - 1; j >= 0; j--) {
        var file = getFile(files, featurablePacks[i].downloads[j].file)||{downloads:0}
        dls += file.downloads + (featurablePacks[i].downloads[j].offset||0)
      }
      totalDLs.push({idx: i, dls: dls})
    }
    totalDLs.sort(function(a, b) { 
      return b.dls - a.dls;
    })
    var popular = totalDLs.slice(0, 12)
    for (var i = 0; i < popular.length; i++) {
      var pack = featurablePacks[popular[i].idx]
      $('#popular.tab-content').append(
        $('<a></a>').addClass('pack')
          .addClass('b-lazy').attr('data-src', '/resources'+pack.page+'/tn/'+pack.screenshots[pack.preview||0])
          .append($('<div></div>').addClass('spinner-container').append($('<div></div>').addClass('spinner')))
          .attr('href', pack.page).append(
            $('<div></div>').addClass('cover').append(
              $('<p></p>').text(pack.name)
            ).append(
              $('<p></p>').addClass('sub').text(pack.category)
            ).append(
              $('<p></p>').addClass('sub').text('Downloaded '+popular[i].dls+' times')
            ).append(
              $('<p></p>').addClass('version').text(pack.downloads[0].version||'')
            )
        )
      )
    }

    featurablePacks = packList.slice(4)
    var dates = []
    for (var i = featurablePacks.length - 1; i >= 0; i--) {
      var date = new Date(0)
      for (var j = featurablePacks[i].downloads.length - 1; j >= 0; j--) {
        var file = getFile(files, featurablePacks[i].downloads[j].file)||{created_on:0}
        var fileDate = new Date(file.created_on)
        date = date < fileDate ? fileDate : date
      }
      dates.push({idx: i, date: date})
    }
    dates.sort(function(a, b) { 
      return b.date - a.date;
    })
    var recent = dates.slice(0, 12)
    for (var i = 0; i < recent.length; i++) {
      var pack = featurablePacks[recent[i].idx]
      $('#recent.tab-content').append(
        $('<a></a>').addClass('pack')
          .addClass('b-lazy').attr('data-src', '/resources'+pack.page+'/tn/'+pack.screenshots[pack.preview||0])
          .append($('<div></div>').addClass('spinner-container').append($('<div></div>').addClass('spinner')))
          .attr('href', pack.page).append(
            $('<div></div>').addClass('cover').append(
              $('<p></p>').text(pack.name)
            ).append(
              $('<p></p>').addClass('sub').text(pack.category)
            ).append(
              $('<p></p>').addClass('sub').text('Updated ' + months[recent[i].date.getMonth()] + ' ' + recent[i].date.getDate() + ', ' + recent[i].date.getFullYear())
            ).append(
              $('<p></p>').addClass('version').text(pack.downloads[0].version||'')
            )
        )
      )
    }

    bLazy.revalidate()
  })
})