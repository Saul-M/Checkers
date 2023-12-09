
// Function to convert the text content of table cells
function convert(type, content) {
    switch (type) {
        case 'number':
            return parseInt(content, 10);
        case 'float':
            return parseFloat(content);
        case 'time':
            const timeParts = content.split(':');
            return timeParts[0] * 3600 + timeParts[1] * 60 + (+timeParts[2]);
        default:
            return content;
    }
}

// Generic sort function
function sortTable(table, column, type, asc = true) {
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll('tr'));

    // Sort each row
    const sortedRows = rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${column + 1})`);
        const bColText = b.querySelector(`td:nth-child(${column + 1})`);

        const aConverted = convert(type, aColText);
        const bConverted = convert(type, bColText);

        return aConverted > bConverted ? (1 * dirModifier) : (-1 * dirModifier);
    });

    // Remove all existing TRs from the table
    while (tBody.firstChild) {
        tBody.removeChild(tBody.firstChild);
    }

    // Re-add the newly sorted rows
    tBody.append(...sortedRows);

    // Remember how the column is currently sorted
    table.querySelectorAll('th').forEach(th => th.classList.remove('th-sort-asc', 'th-sort-desc'));
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle('th-sort-asc', asc);
    table.querySelector(`th:nth-child(${column + 1})`).classList.toggle('th-sort-desc', !asc);
}

document.querySelectorAll('th').forEach(headerCell => {
    headerCell.addEventListener('click', () => {
        const tableElement = headerCell.parentElement.parentElement.parentElement;
        const headerIndex = Array.prototype.indexOf.call(headerCell.parentNode.children, headerCell);
        const currentIsAscending = headerCell.classList.contains('th-sort-asc');
        const type = headerCell.getAttribute('data-type'); // Use this to determine sort type ('number', 'time', etc.)

        sortTable(tableElement, headerIndex, type, !currentIsAscending);
    });
});
