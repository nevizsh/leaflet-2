// API des bornes de recharge en Nouvelle-Calédonie
var API_URL = "https://data.gouv.nc/api/explore/v2.1/catalog/datasets/bornes-de-recharge-pour-vehicules-electriques/records?limit=100";

var map;
var allMarkers = [];
var routingControl = null;

// INITIALISATION DE LA CARTE
function initMap() {
  map = L.map("map").setView([-21.0, 165.5], 8);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}

function chargerBornes() {
  $.ajax({
    url: API_URL,
    type: "GET",
    dataType: "json",
    success: function (data) {
      var bornes = data.results;
      $("#result-count").text(bornes.length + " borne(s) affichée(s)");
      afficherMarqueurs(bornes);
    },
    error: function (xhr, statut, erreur) {
      console.error("Erreur lors du chargement des bornes :", erreur);
    }
  });
}

function afficherMarqueurs(bornes) {
  allMarkers.forEach(function (item) {
    map.removeLayer(item.marker);
  });
  allMarkers = [];

  bornes.forEach(function (borne) {
    var geo = borne.geo_point_2d;
    if (!geo) return;

    var lat = geo.lat;
    var lon = geo.lon;

    var marker = L.marker([lat, lon]).addTo(map);

    marker.on("click", function () {
      afficherPanneau(borne);
    });

    allMarkers.push({ marker: marker, data: borne });
  });
}

// PANNEAU LATÉRAL
function afficherPanneau(borne) {
  var html = "";

  function ligne(label, valeur) {
    if (!valeur) return "";
    return (
      '<div class="info-row">' +
      '<div class="info-label">' + label + "</div>" +
      '<div class="info-value">' + valeur + "</div>" +
      "</div>"
    );
  }

  html += ligne("Nom de la station", borne.nom_station);
  html += ligne("Commune", borne.commune);
  html += ligne("Adresse", borne.adresse_station);
  html += ligne("Code postal", borne.code_postal);
  html += ligne("Opérateur", borne.nom_operateur);
  html += ligne("Aménageur", borne.nom_amenageur);
  html += ligne("Nb. points de charge", borne.nb_points_charge);
  html += ligne("Type de prise", borne.type_prise);
  html += ligne("Puissance max (kW)", borne.puissance_maximale_kw);
  html += ligne("Accès", borne.acces_recharge);
  html += ligne("Horaires", borne.horaires);

  $("#panel-content").html(html || "<p>Aucune information disponible.</p>");
  $("#side-panel").addClass("open");
}

function fermerPanneau() {
  $("#side-panel").removeClass("open");
}

// FILTRAGE DES BORNES
function filtrerBornes(terme) {
  terme = terme.toLowerCase().trim();

  allMarkers.forEach(function (item) {
    var d = item.data;
    var texte = [
      d.nom_station,
      d.commune,
      d.adresse_station,
      d.nom_operateur,
      d.nom_amenageur
    ].join(" ").toLowerCase();

    if (texte.indexOf(terme) !== -1) {
      item.marker.addTo(map);
    } else {
      map.removeLayer(item.marker);
    }
  });

  var visibles = allMarkers.filter(function (item) {
    return map.hasLayer(item.marker);
  });
  $("#result-count").text(visibles.length + " borne(s) affichée(s)");
}

function reinitialiser() {
  $("#search-input").val("");
  allMarkers.forEach(function (item) {
    item.marker.addTo(map);
  });
  $("#result-count").text(allMarkers.length + " borne(s) affichée(s)");
  fermerPanneau();

  if (routingControl) {
    map.removeControl(routingControl);
    routingControl = null;
  }
}

function borneLaPlusProche(lat, lon) {
  var minDist = Infinity;
  var borneTrouvee = null;

  allMarkers.forEach(function (item) {
    if (!map.hasLayer(item.marker)) return;
    var pos = item.marker.getLatLng();
    var dist = Math.pow(pos.lat - lat, 2) + Math.pow(pos.lng - lon, 2);
    if (dist < minDist) {
      minDist = dist;
      borneTrouvee = item;
    }
  });

  return borneTrouvee;
}

function lancerItineraire() {
  if (!navigator.geolocation) {
    alert("La géolocalisation n'est pas supportée par votre navigateur.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;

      var cible = borneLaPlusProche(lat, lon);
      if (!cible) {
        alert("Aucune borne visible sur la carte.");
        return;
      }

      if (routingControl) {
        map.removeControl(routingControl);
      }

      var positionBorne = cible.marker.getLatLng();

      routingControl = L.Routing.control({
        waypoints: [
          L.latLng(lat, lon),
          L.latLng(positionBorne.lat, positionBorne.lng)
        ],
        routeWhileDragging: false,
        language: "fr",
        show: false
      }).addTo(map);

      afficherPanneau(cible.data);
    },
    function () {
      alert("Impossible de récupérer votre position.");
    }
  );
}

$(function () {
  initMap();
  chargerBornes();

  $("#search-input").on("input", function () {
    filtrerBornes($(this).val());
  });

  $("#btn-close-panel").on("click", fermerPanneau);

  $("#btn-reset").on("click", reinitialiser);

  $("#btn-itineraire").on("click", lancerItineraire);
});
