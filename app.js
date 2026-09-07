const LOCKPORT=[43.1706,-78.6903];
// Add your important locations here later.
// Example:
// {id:1,name:"My Location",address:"123 Main St",description:"Description",category:"Important",lat:43.17,lng:-78.69}
const defaultLocations=[];
let locations=JSON.parse(localStorage.getItem("locations")||"null")||defaultLocations;

// Requested locations — geocoded automatically on first load (see
// geocodeSeeds below) so they get accurate coordinates instead of guessed ones.
const SEED_LOCATIONS=[
 {id:"seed-1",name:"Empire State Trail Access",address:"1 Empire State Trl, Lockport, NY",description:"A peaceful stretch of trail along the canal — great for an easy walk, a bike ride, or just watching the water go by."},
 {id:"seed-2",name:"160 Outwater Dr",address:"160 Outwater Dr, Lockport, NY",description:"A quiet, shady spot near Outwater Park — good for a relaxed stroll or a low-key picnic."},
 {id:"seed-3",name:"149 Outwater Dr",address:"149 Outwater Dr, Lockport, NY",description:"Another laid-back corner near Outwater Park — calm, tree-lined, and easy to hang out at."},
 {id:"seed-4",name:"160 State Rd",address:"160 State Rd, Lockport, NY",description:"A low-key spot on State Rd — nothing fancy, just a nice quiet place to be."},
 {id:"seed-5",name:"Gulf Wilderness Park Trailhead",address:"704 Niagara St, Lockport, NY 14094",description:"A hidden-gem hiking trail through the woods along Eighteenmile Creek, with a small waterfall (Indian Falls). Quiet, shady, and away from the crowds — perfect for unwinding."},
 {id:"seed-6",name:"Josephine Carveth Packet Park",address:"Josephine Carveth Packet Park, Lockport, NY 14094",description:"A relaxing green space right on the Erie Canal downtown — ideal for sitting by the water, people-watching, or a slow evening walk."}
];

const map=L.map("map").setView(LOCKPORT,15);

const mapStatus=document.createElement("div");
mapStatus.id="mapStatus";
mapStatus.textContent="Loading map tiles…";
document.getElementById("map").appendChild(mapStatus);

// CARTO's free basemap tiles now require an API key (as of Aug 2026) and
// show an "API KEY REQUIRED" watermark without one, so we use the
// standard OpenStreetMap tile server instead — it stays keyless, and the
// map-tint overlay below recolors it into the same black-and-blue theme.
const tileLayer=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
  attribution:"© OpenStreetMap contributors",
  subdomains:"abc",
  maxZoom:19,
  minZoom:3
}).addTo(map);

let tileLoaded=false, tileErrors=0;
tileLayer.on("tileload",()=>{tileLoaded=true;mapStatus.style.display="none";});
tileLayer.on("tileerror",e=>{
  console.error("Map tile failed to load:",e.tile && e.tile.src);
  tileErrors++;
  if(!tileLoaded && tileErrors>=4){
    mapStatus.textContent="Map tiles can't load — check your internet connection or firewall (see console for details).";
    mapStatus.style.display="block";
  }
});

const mapTint=document.createElement("div");
mapTint.className="map-tint";
document.getElementById("map").appendChild(mapTint);
function renderMarkers(){document.querySelectorAll(".custom-marker").forEach(e=>e.remove()); locations.forEach(x=>{
 const icon=L.divIcon({className:"blue-pin",html:"<div class=\"pin-core\"></div>",iconSize:[22,22],iconAnchor:[11,11]});
 L.marker([x.lat,x.lng],{icon}).addTo(map).bindPopup(`<b>${esc(x.name)}</b><br>${esc(x.address)}<br><small>${esc(x.description||"")}</small>`);
});}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
renderMarkers();

async function geocodeSeeds(){
  const missing=SEED_LOCATIONS.filter(s=>!locations.some(l=>l.id===s.id));
  for(const s of missing){
    try{
      const q=encodeURIComponent(s.address);
      const r=await fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&q="+q);
      const d=await r.json();
      if(d && d[0]){
        locations.push({id:s.id,name:s.name,address:s.address,description:s.description,category:"Other",lat:+d[0].lat,lng:+d[0].lon});
        localStorage.setItem("locations",JSON.stringify(locations));
        renderMarkers();
      }else{
        console.warn("No geocoding result for seed address:",s.address);
      }
    }catch(err){
      console.error("Geocoding failed for seed address:",s.address,err);
    }
    await new Promise(res=>setTimeout(res,1100)); // stay under Nominatim's 1 req/sec usage policy
  }
}
geocodeSeeds();
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));document.getElementById(b.dataset.page).classList.add("active");if(b.dataset.page==="mapPage")setTimeout(()=>map.invalidateSize(),50);if(b.dataset.page==="adminPage")renderAdmin();});
document.getElementById("addLocation").onclick=()=>{const n=adminName.value.trim(),a=adminAddress.value.trim();if(!n||!a)return alert("Enter a name and address.");const q=encodeURIComponent(a+", Lockport, NY");fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&q="+q).then(r=>r.json()).then(d=>{if(!d[0])return alert("Could not find that address.");locations.push({id:Date.now(),name:n,address:a,description:adminDescription.value,category:"Other",lat:+d[0].lat,lng:+d[0].lon});localStorage.setItem("locations",JSON.stringify(locations));adminName.value=adminAddress.value=adminDescription.value="";renderMarkers();renderAdmin();});};
function renderAdmin(){locationList.innerHTML=locations.map(x=>`<div class="item"><b>${esc(x.name)}</b><br>${esc(x.address)}<br><button onclick="deleteLoc(${x.id})">Delete</button></div>`).join("");}
window.deleteLoc=id=>{locations=locations.filter(x=>x.id!==id);localStorage.setItem("locations",JSON.stringify(locations));renderMarkers();renderAdmin();};
