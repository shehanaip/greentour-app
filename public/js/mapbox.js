let locations =JSON.parse( document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1Ijoic2VoYW5haXAiLCJhIjoiY20zd3k5Nms5MWR4NTJycHdhMmh6M3pvaSJ9.F-GHb3dgeyTU7_U652A7yg';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  scrollZoom: false,
  pitchWithRotate: false
//   center:[-118.113491,34.111745],
//   zoom:10,
//   interactive:false
});
// create marker
const bounds = new mapboxgl.LngLatBounds();
locations.forEach(loc =>{
    const el = document.createElement('div');
    el.className='marker';
    // add the marker
    new mapboxgl.Marker({
        element: el,
        anchor:'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    // add popup
    new mapboxgl.Popup({offset:30}).setLngLat(loc.coordinates).setHTML(`<p>Days ${loc.day}: ${loc.description}</p>`).addTo(map);
    // extend the marker
    bounds.extend(loc.coordinates);
})

map.fitBounds(bounds,{
    padding:{
        top:200,
        bottom:150,
        left:100,
        right:100

    }

});