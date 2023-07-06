export const displayMap = () => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoicGhhaGFtIiwiYSI6ImNsNnhna3NxZjBlMDMzY215ZG9kemNsYjIifQ.wJrkxMXuQkZPs0NohPLmgg";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/phaham/cl6xgq650000v15pmbz0cscsl",
    scrollZoom: false,
    center: [77.28091379199981, 28.561394468374786],
    zoom: 15,
    interactive: true
  });
  window.addEventListener('resize', () => {
    map.resize();
  });
  
  // const contentContainer = document.getElementById('contact-content');
  // map.getCanvas().parentNode.appendChild(contentContainer);
  // const bounds = new mapboxgl.LngLatBounds();

  // locations.forEach((loc) => {
  //   // Create marker
  //   const el = document.createElement("div");
  //   el.className = "marker";
  //   // Add marker
  //   new mapboxgl.Marker({
  //     element: el,
  //     anchor: "bottom",
  //   })
  //     .setLngLat(loc.coordinates)
  //     .addTo(map);

  //   bounds.extend(loc.coordinates);
  //   // Add popup with info
  //   new mapboxgl.Popup({
  //     offset: 30, // to avoid overlapping with pin points
  //   })
  //     .setLngLat(loc.coordinates)
  //     .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
  //     .addTo(map);
  //   // Extend map bounds to include current location
  //   bounds.extend(loc.coordinates);
  // });
  // // Fit the box
  // map.fitBounds(bounds, {
  //   padding: {
  //     top: 200,
  //     bottom: 150,
  //     left: 100,
  //     right: 100,
  //   },
  // });
};
