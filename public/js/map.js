const coords = JSON.parse(coordinates);
const lat = coords[1];
const lng = coords[0];
const map = L.map('my-map').setView([lat, lng], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    
}).addTo(map);
const marker = L.marker([lat, lng])
  .addTo(map)
  .bindPopup("<b>" + title + "</b><br>Exact location will be provided after booking").openPopup();
