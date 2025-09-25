/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Columns (columns6)'];

  // Defensive: get immediate children (columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For this block, we expect two columns: left and right
  // Defensive: if not exactly two, fill with empty cells as needed
  const numColumns = 2;
  const contentRow = [];
  for (let i = 0; i < numColumns; i += 1) {
    if (columns[i]) {
      contentRow.push(columns[i]);
    } else {
      // If missing, add an empty cell
      contentRow.push('');
    }
  }

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
