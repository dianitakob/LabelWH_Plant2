const tableBody = document.querySelector("#materialsTable tbody");
const partNumberInput = document.getElementById("partNumber");
const dateInput = document.getElementById("date");
const printBtn = document.getElementById("printBtn");
const searchInput = document.getElementById("searchInput");

let materials = []; // Aquí guardaremos los materiales traídos desde el servidor

// Función para renderizar la tabla con un arreglo de materiales
function renderMaterials(list) {
  tableBody.innerHTML = "";
  list.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${item.matnr}</td><td>${item.maktx}</td>`;
    row.addEventListener("click", () => {
      partNumberInput.value = `${item.matnr} - ${item.maktx}`;
    });
    tableBody.appendChild(row);
  });
}

// Obtener materiales desde el backend
//fetch('http://10.131.6.15:3004/materials')
fetch('http://localhost:3000/materials')
  .then(response => response.json())
  .then(data => {
    materials = data; // Guardamos el arreglo recibido
    renderMaterials(materials);
  })
  .catch(error => {
    console.error('Error al cargar materiales:', error);
    alert('No se pudieron cargar los materiales desde el servidor');
  });

// Poner fecha actual por defecto
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;

// Botón imprimir (demo)
printBtn.addEventListener("click", () => {
  const labelType = document.getElementById("labelType").value;
  const part = partNumberInput.value;
  const date = dateInput.value;
  const qtyBox = document.getElementById("qtyPerBox").value;
  const labelQty = document.getElementById("labelQty").value;
  const line = document.getElementById("line").value;

  if (!part) {
    alert("Selecciona un material");
    return;
  }

  fetch('http://localhost:3000/print', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ part })
  })
  .then(res => res.text())
  .then(msg => alert(msg))
  .catch(err => {
    console.error(err);
    alert("Error al enviar etiqueta a impresión");
  });
});

// Búsqueda en vivo
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = materials.filter(item =>
    item.matnr.toLowerCase().includes(query) ||
    item.maktx.toLowerCase().includes(query)
  );
  renderMaterials(filtered);
});
