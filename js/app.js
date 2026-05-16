const API_URL = "https://data.gouv.nc/api/records/1.0/search/";

let map;
let stations = [];
let markerLayer;

async function loadStations() {
    try {
        const response = await fetch(API_URL + new URLSearchParams({
            dataset: "bornes-de-recharge-pour-vehicules-electriques",
            rows: "2000",
            format: "geojson",
        }));
    }
    catch (error) {
        console.error("Erreur lors du chargement des stations:", error);
    }
}

function openSidebarWith(props) {
    sidebarContent.innerHTML = `
        <h2>${props.nom_station}</h2>
        <p>Commune: ${props.commune}</p>
        <p>Adresse: ${props.adresse}</p>
        <p>Type de borne: ${props.type_borne}</p>
        <p>Nombre de bornes: ${props.nombre_bornes}</p>
        <p>Capacité de la borne: ${props.capacite_borne}</p>
        <p>Disponibilité de la borne: ${props.disponibilite_borne}</p>
    `;
    sidebar.style.display = "block";
}

function closeSidebar() {
    sidebar.style.display = "none";
}

function initMap() {
    map = L.map('map').setView([-21.0, 165.5], 6);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

function drawMarkers() {
    markerLayer = L.geoJSON(stations, {
        pointToLayer: (feature, latlng) => L.marker(latlng),
        onEachFeature: (feature, leafletLayer) => {
            leafletLayer.on("click", () => {
                openSidebarWith(feature.properties);
            });
        },
    }).addTo(map);
}

function setupSearch() {
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim().toLowerCase();
        const filteredStations = stations.filter(station =>
            station.properties.nom_station.toLowerCase().includes(searchTerm)
        );
        markerLayer.clearLayers();
        markerLayer.add(L.geoJSON(filteredStations));
    });
}

function setupListeners() {
    closeSidebarBtn.addEventListener("click", closeSidebar);
    initMap();
    loadStations();
    setupSearch();
    setupItineraire();
}

async function main() {
    initMap();
    await loadStations();
    drawMarkers();
    setupSearch();
    setupItineraire();
}

main();