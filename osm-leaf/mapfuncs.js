// Global variables
var map;
var redIcon;
var latlngs = Array();

function load_map(apiKey)
{
	map = L.mapbox.map('map', apiKey).setView([51.505, -0.09], 13);
	var linecolor = 'green';
	var latlngs = Array();

	map.scrollWheelZoom.disable();
		
}

// topic is received topic
// d is parsed JSON payload
// date is Date() object
function mapit(topic, d, date)
{
	var user = getUser(topic);
	if (!user || !user.name) {
		// doesn't exist. Create something
		user = {
			name: topic,
			count: 0,
		};
		users[topic] = user;
	}
		
	var f = {}

		
	if (user.marker) {
		f = friend_move(user, d.lat, d.lon);
	} else {
		f = friend_add(user, d.lat, d.lon);
		latlngs.push(f.getLatLng());
		map.fitBounds(L.latLngBounds(latlngs));
	}
}

