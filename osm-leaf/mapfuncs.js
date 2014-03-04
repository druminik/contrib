// Global variables
var map;
var me;
var redIcon;
var latlngs = Array();

function load_map()
{
	map = L.map('map').setView([51.505, -0.09], 13);
	var linecolor = 'green';
	var latlngs = Array();

	map.scrollWheelZoom.disable();
		
	//Extend the Default marker class
	// http://harrywood.co.uk/maps/examples/leaflet/custom-marker.view.html
	var RedIcon = L.Icon.Default.extend({
            options: {
            	    iconUrl: 'assets/marker-icon-red.png' 
            }
         });
	redIcon = new RedIcon();
         
	// FIXME: where do I start? Which tile?!?

	L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery ?? <a href="http://cloudmade.com">CloudMade</a>'
	}).addTo(map);

}

// topic is received topic
// d is parsed JSON payload
// date is Date() object
function mapit(topic, d, date)
{
	if (topic == config.mytopic) {
		// TODO: move me instead of recreating it each time
		if (!me) {
			try {
				me = L.marker([d.lat, d.lon], {icon: redIcon}).addTo(map);
				me.bindPopup(getPopupText(user, d.lat, d.lon));
			
				/* Bind a mouseover to the marker */
				me.on('mouseover', function(evt) {
					evt.target.openPopup();
				});
			
				latlngs.push(me.getLatLng());
				map.fitBounds(L.latLngBounds(latlngs));
			} catch (err) {
				console.log(err);
			}
		} else {
			me.setLatLng({lat: d.lat, lng: d.lon});
			me.setPopupContent(getPopupText(user, d.lat, d.lon));
		}
		
	} else { // a friend
		var user = getUser(topic);
		if (!user || !user.name) {
			// doesn't exist. Create something
			user = {
				name: topic,
				icon: leaf_icon(gravatar('foo@example.com'))
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
}
