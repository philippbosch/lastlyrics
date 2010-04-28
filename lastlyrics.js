function update() {
    $('#update').attr('disabled', 'disabled');
    $('#status').text('Looking up the song …');
    $.getJSON('http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + encodeURIComponent(localStorage.getItem('username')) + '&api_key=842a732bd478520e57cca3b0eda1475f&format=json&callback=?', function(data) {
        try {
            if (!data.recenttracks.track[0]['@attr']['nowplaying']) throw('No song currently playing according to last.fm');
            $('#status').text('');
            if ($('h1').text() == data.recenttracks.track[0].artist['#text'] && $('h2').text() == data.recenttracks.track[0].name) {
                $('#update').attr('disabled', "");
                return;
            }
            $('h1,h2').addClass('out');
            $('h1').text(data.recenttracks.track[0].artist['#text']);
            $('h2').text(data.recenttracks.track[0].name);
            window.setTimeout(function() {
                $('h1,h2').removeClass('out');
            }, 1000);
            $('#text').removeClass('loaded');
            var url = 'http://lyrics.wikia.com/' + (data.recenttracks.track[0].artist['#text'] + ':' + data.recenttracks.track[0].name).replace(/(^|\:|\s)([a-z])/g, function(m,p1,p2){ return p1+p2.toUpperCase(); } ).replace(/\s/g,'_');
            
            $.ajax({
                'url': "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + encodeURIComponent(url) + "%22%20and%0A%20%20%20%20%20%20xpath%3D'%2F%2Fdiv%5B%40class%3D%22lyricbox%22%5D%2Fp'",
                'success': function(data) {
                    var lyrics = $('p', data);
                    $('#text').html('<p>' + lyrics.text().replace(/\n/g,"&nbsp;</p><p>") + '</p>').addClass('loaded');
                    if (!lyrics.text()) $('#status').text('No lyrics found.');
                    $('#update').attr('disabled', "");
                }
            });
        } catch(e) {
            $('#status').text('No song currently playing.');
            $('#update').attr('disabled', "");
        }
    });
}

$(document).ready(function() {
    if (!localStorage.getItem('username')) {
        $('#card').addClass('flipped');
    } else {
        $('#username').val(localStorage.getItem('username'));
        update();
    }
    
    $('#update').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        update();
    });
    
    $('form').click(function(e) {
        e.stopPropagation();
    });
    
    $('#save').click(function(e) {
        if ($('#username').val() != "") {
            localStorage.setItem('username', $('#username').val());
            $('#card').toggleClass('flipped');
            update();
        }
    });
    
    $('.face').click(function(e) {
        $('#card').toggleClass('flipped');
    });
});
