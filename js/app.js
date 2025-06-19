const map = L.map("map").setView([35.681236, 139.767125], 4);
L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  attribution: "&copy; OpenStreetMap & CartoDB",
  subdomains: "abcd",
  maxZoom: 19,
}).addTo(map);

const locationIcon = L.divIcon({
  className: "location-icon",
  html: "📍",
  iconSize: [25, 25],
  iconAnchor: [12, 12],
});

navigator.geolocation.getCurrentPosition(
  (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    map.setView([lat, lon], 12);

    const $marker = L.marker([lat, lon], { icon: locationIcon }).addTo(map);
    $marker.bindPopup("YOU ARE HERE").openPopup();
  },
  (err) => {
    console.error("位置情報取得失敗:", err);
    alert("現在地を取得できませんでした。");
  }
);

function createPlaneIcon(track) {
  return L.divIcon({
    className: "plane-icon",
    html: $("<div>")
      .addClass("plane-emoji")
      .css("transform", `rotate(${(track || 0) - 45}deg)`)
      .text("✈️")[0].outerHTML,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  });
}

const airlineLookup = {
  AAL: "American Airlines",
  ACA: "Air Canada",
  AFR: "Air France",
  ANA: "All Nippon Airways (ANA)",
  ANZ: "Air New Zealand",
  ASA: "Alaska Airlines",
  ASQ: "ExpressJet Airlines",
  AUA: "Austrian Airlines",
  AVA: "Avianca",
  AZA: "Alitalia",
  BAW: "British Airways",
  BEL: "Brussels Airlines",
  BER: "Air Berlin",
  BKA: "Baker Aviation",
  BTI: "Air Baltic",
  CAL: "China Airlines",
  CCA: "Air China",
  CES: "China Eastern Airlines",
  CFG: "Condor Flugdienst",
  CPA: "Cathay Pacific",
  CSA: "Czech Airlines",
  DAL: "Delta Air Lines",
  DLH: "Lufthansa",
  EIN: "Aer Lingus",
  ELY: "El Al Israel Airlines",
  EMI: "Emirates SkyCargo",
  ETD: "Etihad Airways",
  EVA: "EVA Air",
  FDX: "FedEx Express",
  FIN: "Finnair",
  GIA: "Garuda Indonesia",
  HAL: "Hawaiian Airlines",
  HKD: "Hokkaido Air System",
  IBE: "Iberia",
  ICE: "Icelandair",
  JAL: "Japan Airlines",
  JBU: "JetBlue Airways",
  JST: "Jetstar Airways",
  KAC: "Kuwait Airways",
  KAL: "Korean Air",
  KLM: "KLM Royal Dutch Airlines",
  LAN: "LATAM Airlines",
  LOT: "LOT Polish Airlines",
  MAS: "Malaysia Airlines",
  NAX: "Norwegian Air Shuttle",
  PAL: "Philippine Airlines",
  PGT: "Pegasus Airlines",
  QFA: "Qantas",
  QTR: "Qatar Airways",
  RYR: "Ryanair",
  SAS: "Scandinavian Airlines",
  SIA: "Singapore Airlines",
  SWA: "Southwest Airlines",
  SWR: "Swiss International Air Lines",
  THA: "Thai Airways",
  THY: "Turkish Airlines",
  TSC: "Air Transat",
  UAL: "United Airlines",
  UAE: "Emirates",
  VOZ: "Virgin Australia",
  VIR: "Virgin Atlantic",
  VLG: "Vueling Airlines",
  WJA: "WestJet",
  WZZ: "Wizz Air",
  ACA: "Air Canada",
  ADB: "Antonov Airlines",
  AEE: "Aegean Airlines",
  AFL: "Aeroflot",
  AHY: "Azerbaijan Airlines",
  AMX: "Aeromexico",
  ARG: "Aerolineas Argentinas",
  ASA: "Alaska Airlines",
  AUI: "Ukraine International Airlines",
  AXM: "AirAsia",
  AZM: "Zagros Airlines",
  AZU: "Azul Brazilian Airlines",
  BKP: "Bangkok Airways",
  BMA: "BMI Regional",
  BWA: "Caribbean Airlines",
  CBJ: "Cambodia Bayon Airlines",
  CCA: "Air China",
  CES: "China Eastern Airlines",
  CHH: "Hainan Airlines",
  CKS: "Kalitta Air",
  CLX: "Cargolux",
  CMV: "Corendon Airlines",
  CMP: "Copa Airlines",
  CPN: "Canadian North",
  CRL: "Corsair International",
  CSN: "China Southern Airlines",
  CYZ: "Cyprus Airways",
  DAH: "Air Algérie",
  DLH: "Lufthansa",
  DQA: "Alliance Airlines",
  ELY: "El Al Israel Airlines",
  ETD: "Etihad Airways",
  EXS: "Jet2.com",
  FFT: "Frontier Airlines",
  FJI: "Fiji Airways",
  GEC: "Lufthansa Cargo",
  GFA: "Gulf Air",
  GLA: "Globus Airlines",
  GTI: "Atlas Air",
  HDA: "Hong Kong Airlines",
  HHN: "Hahn Air",
  IAW: "Iraqi Airways",
  IRN: "Iran Air",
  ISR: "Israir Airlines",
  JZR: "Jazeera Airways",
  KZR: "Air Astana",
  LAE: "LACSA",
  LDX: "Líder Aviação",
  LRG: "Luxair",
  MAU: "Air Mauritius",
  MEP: "Middle East Airlines",
  CSG: "Chongqing Airlines",
  NCA: "Nippon Cargo Airlines (日本貨物航空)",
  SJO: "Sichuan Airlines",
  UPS: "UPS Airlines",
  GCR: "Gulf Coast Airways",
  JJP: "Jetstar Japan",
  CJT: "Cargojet Airways",
  SJX: "SuperJet International",
  FYG: "FlyEgypt",
  AKX: "Aklak Air",
  ADO: "Air Do",
  SFJ: "StarFlyer",
  XAX: "AeroEjecutivo (Mexico)",
  JJP: "Spring Japan (operated for Yamato Transport)",
  CQH: "Spring Airlines",
  APJ: "Peach Aviation",
};

$.getJSON(
  "https://opensky-network.org/api/states/all?lamin=30.0&lomin=130.0&lamax=45.0&lomax=150.0"
)
  .done(function (data) {
    if (!data.states) return;

    $.each(data.states, function (_, plane) {
      const lat = plane[6],
        lon = plane[5],
        callsign = $.trim(plane[1] || ""),
        origin_country = plane[2],
        on_ground = plane[8],
        track = plane[10],
        code = callsign.slice(0, 3).toUpperCase(),
        airlineName = airlineLookup[code] || "不明な航空会社";

      if (lat != null && lon != null) {
        const searchLink = callsign
          ? `<a href="https://flightaware.com/live/flight/${encodeURIComponent(
              callsign
            )}" target="_blank">発着地情報を見る</a>`
          : "";

        const popupContent = `
          <strong>便名：</strong> ${callsign || "不明"}<br>
          <strong>航空会社：</strong> ${airlineName}<br>
          <strong>登録国：</strong> ${origin_country}<br>
          <strong>地上にいるか：</strong> ${on_ground ? "はい" : "いいえ"}<br>
          <strong>進行方向：</strong> ${
            track !== null ? track + "°" : "不明"
          }<br>
          ${searchLink}
        `;

        const marker = L.marker([lat, lon], { icon: createPlaneIcon(track) })
          .addTo(map)
          .bindPopup(popupContent)
          .on("click", function () {
            const infoTable = `
              <table>
                <tr><th>便名</th><td>${callsign || "不明"}</td></tr>
                <tr><th>航空会社</th><td>${airlineName}</td></tr>
                <tr><th>登録国</th><td>${origin_country}</td></tr>
                <tr><th>緯度</th><td>${lat}</td></tr>
                <tr><th>経度</th><td>${lon}</td></tr>
                <tr><th>地上にいるか</th><td>${
                  on_ground ? "はい" : "いいえ"
                }</td></tr>
                <tr><th>進行方向</th><td>${
                  track !== null ? track + "°" : "不明"
                }</td></tr>
              </table>
            `;
            $("#info").html(infoTable);
          });
      }
    });
  })
  .fail(function (_, status, err) {
    console.error("API失敗:", status, err);
  });
