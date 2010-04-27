var username = 'eyesbreaker';

function update() {
    $('#update').attr('disabled', 'disabled');
    $('#status').text('Looking up the song …');
    $.getJSON('http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + encodeURIComponent(username) + '&api_key=842a732bd478520e57cca3b0eda1475f&format=json&callback=?', function(data) {
        try {
            if (!data.recenttracks.track[0]['@attr']['nowplaying']) throw('No song currently playing according to last.fm');
            $('#status').text('');
            $('h1').text(data.recenttracks.track[0].artist['#text']);
            $('h2').text(data.recenttracks.track[0].name);
            var url = 'http://lyrics.wikia.com/' + (data.recenttracks.track[0].artist['#text'] + ':' + data.recenttracks.track[0].name).replace(/(^|\:|\s)([a-z])/g, function(m,p1,p2){ return p1+p2.toUpperCase(); } ).replace(/\s/g,'_');
            
            $.ajax({
                'url': "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + encodeURIComponent(url) + "%22%20and%0A%20%20%20%20%20%20xpath%3D'%2F%2Fdiv%5B%40class%3D%22lyricbox%22%5D%2Fp'",
                'success': function(data) {
                    var lyrics = $('p', data);
                    $('#text').html('<p>' + lyrics.text().replace(/\n/g,"&nbsp;</p><p>") + '</p>');
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
    update();
    
    $('#update').click(function(e) {
        e.preventDefault();
        update();
    });
});
