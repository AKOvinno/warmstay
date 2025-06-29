document.addEventListener("DOMContentLoaded", function () {
  if (window.listingMapData && document.getElementById("my-map")) {
    const { latitude, longitude, apiKey, title } = window.listingMapData;

    const map = L.map("my-map").setView([latitude, longitude], 10);
    const isRetina = L.Browser.retina;
    const baseUrl =
      "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=" + apiKey;
    const retinaUrl =
      "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey=" + apiKey;
    L.tileLayer(isRetina ? retinaUrl : baseUrl, {
      maxZoom: 20,
      id: "osm-bright",
    }).addTo(map);

    const tooltipContent = `${title}<br><span style="font-size:0.95rem;font-weight:normal;">Exact location will be provided after booking</span>`;

    L.marker([latitude, longitude])
      .addTo(map)
      .bindTooltip(tooltipContent, { permanent: false, direction: "top" });
  }
});