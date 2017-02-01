(function() {
  var checkPage = function(url, name, cb) {
    $.getJSON(url, function(data) {
      for (var i = 0; i < data.values.length; i++) {
        var value = data.values[i];
        if (value.name == name) {
          cb(value);
          return;
        }
      }
      if (data.hasOwnProperty("next")) checkPage(data.next, name, cb);
    });
  }

  var formatBytes = function(bytes) {
     if(bytes == 0) return '0 B';
     var k = 1024;
     var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
     var i = Math.floor(Math.log(bytes) / Math.log(k));
     return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

  $(".download-wrapper").each(function(i, e) {
    var button = $(e);
    var file = button.attr("file");
    checkPage("https://api.bitbucket.org/2.0/repositories/DokucraftSaga/dokucraft-website/downloads", file, function(value) {
      button.find(".size").text(formatBytes(value.size));
      button.find(".count").text((value.downloads + parseInt(button.attr("offset"))) + " downloads");
      var date = new Date(value.created_on);
      button.find(".last-update").text("Updated " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear());
    });
  });
})();