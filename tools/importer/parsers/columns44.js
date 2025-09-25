/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate child divs (columns)
  const getColumns = (rowEl) => Array.from(rowEl.querySelectorAll(':scope > div'));

  // Get all rows (each .download-table-row)
  const rows = Array.from(element.querySelectorAll(':scope > .download-table-row'));

  // Defensive: If no rows found, treat element itself as a single row
  const dataRows = rows.length ? rows : [element];

  // Build header row
  const headerRow = ['Columns (columns44)'];

  // For each row, filter out empty columns
  function isEmptyCol(col) {
    if (!col) return true;
    // Check for non-empty text, links, or buttons
    const hasText = col.textContent && col.textContent.trim().length > 0;
    const hasLink = col.querySelector('a[href]');
    const hasButton = col.querySelector('button, .button');
    return !(hasText || hasLink || hasButton);
  }

  // Build content rows: only non-empty columns
  const tableRows = dataRows.map((rowEl) => {
    const cols = getColumns(rowEl);
    return cols.filter(col => !isEmptyCol(col));
  });

  // Compose final table data
  const tableData = [headerRow, ...tableRows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace original element
  element.replaceWith(block);
}
