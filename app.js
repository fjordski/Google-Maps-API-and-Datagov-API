(function() {

const search = document.querySelector('#search');
let city = document.querySelector('#city')
let state = document.querySelector('#states');

search.addEventListener('click', function() {
    $('#googleMap').css('display', 'block');
    initialize();
});

function initialize() {
    let long;
    let lat;
    $.ajax({
        url: `https://api.data.gov/nrel/alt-fuel-stations/v1/nearest.json?api_key=eJlP2DgVVu9Mz2FOCkj3LmTvPZSRpV3znl9TWFo5&location=${city.value}+${state.value}&fuel_type=ELEC`,
        error: function(req, status, error) {
            if (error) {
                alert("You're missing something.");
            };
        },
        success: function(json) {
            lat = json.latitude;
            long = json.longitude;
            $('.table').empty();
            $('#title').empty();
            $('#title').append(json.fuel_stations[0].city);
            $('.title').fadeIn();
            var data = json;
            $.each(data.fuel_stations, function(i, key) {
                addMarker({
                    lat: key.latitude,
                    lng: key.longitude
                }, map, key.station_name);
            });

            var source = $("#some-template").html();
            var template = Handlebars.compile(source);

            $('body').append(template(data));

        },
        complete: function() {
            map.setCenter(new google.maps.LatLng(lat, long));
        }
    });
    //end of AJAX

    var map = new google.maps.Map(document.getElementById("googleMap"), {
        zoom: 12
    });

    function addMarker(location, map, title) {
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            animation: google.maps.Animation.DROP,
            title: title
        });
        marker.addListener('click', findMe);
    }
}
//end of initialize

function findMe() {
    let title = this.title;
    let body = document.body.textContent;
    if (body.includes(title)) {
        window.find(title);
    }
}

})();
