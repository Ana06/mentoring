$(document).ready(function () {
  var url = $('table').first().data('url');

  // GitHub allows only 60 API calls per hour from the same IP address,
  // therefore we check first if we have API calls left.
  // If not we display a proper error message!
  var remaining;
  $.getJSON('https://api.github.com/rate_limit', function (data) {
    remaining = data.rate.remaining;
    if(remaining > 0) {
      $.getJSON(url, function (data) {
        $.each(data, function (index) {
          // Add the rows to the tables
          var row = "<tr><td><a href='#eventModal" + index + "' data-toggle='modal'>" + this.title + "</a></td>" +
              "<td><a href='" + this.html_url + "'" + this.label + "' type='button' class='btn btn-success btn-xs'>Yes, let's do it</a></td>" +
              "</td></tr>";

          $.each(this.labels, function () {
            $('.' + this.name + '-table tbody').append(row);
            $('.' + this.name + '-table').show();
            $('.' + this.name + '-placeholder').remove();
          });

          gsoc_hint = get_gsoc_hint(this.labels);

          // Add the modal for the project
          var modal = "<div class='portfolio-modal modal fade' id='eventModal" + index + "' tabindex='-1' role='dialog' aria-hidden='true'> <div class='modal-content'>" +
              "<div class='close-modal' data-dismiss='modal'>" +
              "<div class='lr'>" +
              "<div class='rl'>" +
              "</div></div></div>" +
              "<div class='container'>" +
              "<div class='row'>" +
              "<div class='col-lg-8 col-lg-offset-2'>" +
              "<div class='modal-body'>" +
              "<h2 class='text-center'>" + this.title + "</h2>" +
              "<hr class='star-primary'>" +
              "<h3>" + this.title + "</h3>" +
              "<p>" + markdown.toHTML(this.body) + "</p>" +
              gsoc_hint +
              "<div class='text-center'><button type='button' class='btn btn-default' data-dismiss='modal'><i class='fa fa-times'></i>Close</button>" +
              "</div></div></div></div></div></div></div>";
          $('footer').after(modal);
          $('.project-placeholder').html("Sorry but currently we don't have any mentoring project ...")
        });
      });
    }
    else{
      $('.project-placeholder').html("Sorry but it seems like you exceeded the allowed number of requests. Please have a look at <a href='https://github.com/openSUSE/mentoring/issues'>our issues</a>!")
    }
  });
});

function get_gsoc_hint(labels){
  result = "";
  current_url = window.location.href;
  for(var i = 0; i < labels.length; i++) {
    if (labels[i].name == 'GSoC') {
      if(current_url.indexOf('gsoc') > -1) {
        url = current_url;
      }
      else{
        url = current_url + "/gsoc";
      }
      result = "<p>You can do this project as part of the Google Summer of Code program. Click <a href='" + url + "'>here</a> for more information.</p>"
      break;
    }
  }
  return result;
}

