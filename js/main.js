/* API CALL*/

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const year = String(date.getFullYear()).slice(2); // Obtener los últimos dos dígitos del año
    return `${month}-${day}-${year}`;
}

let dataTable = $('#resultsTable').DataTable({
    pageLength: 10,
    lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]]
});

document.getElementById('submitButton').addEventListener('click', function() {
    const page = document.getElementById('page').value || 1;
    const limit = document.getElementById('limit').value;
    const startDateElement = document.getElementById('startDate');
    const endDateElement = document.getElementById('endDate');
    const empresa = document.getElementById('empresa').value;
    const rubros = document.getElementById('rubros').value;

    const startDate = startDateElement.value ? formatDate(new Date(startDateElement.value)) : null;
    const endDate = endDateElement.value ? formatDate(new Date(endDateElement.value)) : null;

    let apiUrl = `http://localhost:5277/api/v1/tenders?`;

    if (page) apiUrl += `page=${page}&`;
    if (limit) apiUrl += `limit=${limit}&`;
    if (startDate) apiUrl += `startDate=${startDate}&`;
    if (endDate) apiUrl += `endDate=${endDate}&`;
    if (empresa) apiUrl += `empresa=${empresa}&`;
    if (rubros) apiUrl += `rubros=${rubros}&`;

    // Remover el último "&" o "?" si no hay más parámetros
    apiUrl = apiUrl.endsWith('&') ? apiUrl.slice(0, -1) : apiUrl;
    apiUrl = apiUrl.endsWith('?') ? apiUrl.slice(0, -1) : apiUrl;

    fetch(apiUrl, {
        headers: {
          'x-requested-with': 'XMLHttpRequest',
        },
    })
    .then(response => response.json())
    .then(data => {
        dataTable.clear(); // Limpiar los datos existentes en DataTable

        if (!data.items || data.items.length === 0) {
            console.error('No se recibieron datos del API');
            dataTable.draw(); // Dibujar la tabla vacía
            return;
        }

        data.items.forEach(row => {
            // Construir una nueva fila como un array de columnas
            const newRow = [
                "DO", // País con valor fijo "DO"
                row.tenderId || '',
                row.description || '',
                row.fase || '',
                row.startDate || '',
                row.endDate || '',
                row.amount || '',
                row.currency || '',
                row.estado || '',
                row.procedureType || '',
                row.contractType || '',
                `<a href="${row.documentUrl || '#'}" target="_blank">Detalle</a>` // Detalle como un enlace
            ];
            
            // Añadir la nueva fila a DataTable
            dataTable.row.add(newRow);
        });

        dataTable.draw(); // Dibujar la tabla con los nuevos datos
        
    })
    .catch(error => console.error('Error fetching data:', error));
});


