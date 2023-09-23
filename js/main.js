/* API CALL*/

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
    const year = String(date.getFullYear()).slice(2); // Obtener los últimos dos dígitos del año
    return `${month}-${day}-${year}`;
}

document.getElementById('submitButton').addEventListener('click', function() {
    const page = document.getElementById('page').value || 1;
    const limit = document.getElementById('limit').value;
    const startDate = formatDate(new Date(document.getElementById('startDate').value));
    const endDate = formatDate(new Date(document.getElementById('endDate').value));
    const empresa = document.getElementById('empresa').value;
    const rubros = document.getElementById('rubros').value;

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
        const tableBody = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Limpiar las filas existentes

        if (!data.items || data.items.length === 0) {
            console.error('No se recibieron datos del API');
            $('#resultsTable').DataTable().clear().draw(); // Limpiar los datos del DataTable existente
            return;
        }

        data.items.forEach(row => {
            const newRow = tableBody.insertRow();
            
            // Añadir País con valor fijo "DO"
            let cell = newRow.insertCell(0);
            cell.innerText = "DO";
            
            // Añadir Referencia
            cell = newRow.insertCell(1);
            cell.innerText = row.tenderId || '';
            
            // Añadir Descripción
            cell = newRow.insertCell(2);
            cell.innerText = row.description || '';
            
            // Continuar con las demás columnas...
            cell = newRow.insertCell(3);
            cell.innerText = row.fase || '';
            
            cell = newRow.insertCell(4);
            cell.innerText = row.startDate || '';
            
            cell = newRow.insertCell(5);
            cell.innerText = row.endDate || '';
            
            cell = newRow.insertCell(6);
            cell.innerText = row.amount || '';
            
            cell = newRow.insertCell(7);
            cell.innerText = row.currency || '';
            
            cell = newRow.insertCell(8);
            cell.innerText = row.estado || '';
            
            cell = newRow.insertCell(9);
            cell.innerText = row.procedureType || '';
            
            cell = newRow.insertCell(10);
            cell.innerText = row.contractType || '';
            
            cell = newRow.insertCell(11); // Asegúrate de que el índice sea correcto
            const link = document.createElement('a');
            link.href = row.documentUrl || '#'; // Usa '#' o '' como href si documentUrl es undefined o null
            link.innerText = 'Detalle'; // Texto del enlace
            link.target = '_blank'; // Abre el enlace en una nueva pestaña
            cell.appendChild(link);
        });
        $('#resultsTable').DataTable();
        dataTable.clear().draw(); // Limpiar los datos del DataTable existente
        dataTable.rows.add(data.items).draw(); // Añadir los nuevos datos al DataTable
        
    })
    .catch(error => console.error('Error fetching data:', error));
});


