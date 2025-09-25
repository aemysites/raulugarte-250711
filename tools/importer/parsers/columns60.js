/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns60)'];

  // Defensive: Get immediate children columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // If there are not exactly two columns, fallback to single cell
  if (columns.length < 2) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      [element]
    ], document);
    element.replaceWith(table);
    return;
  }

  // Build the columns for the second row
  // Left column: all content from col-left
  const leftCol = columns[0];
  // Right column: all content from col-right
  const rightCol = columns[1];

  // Table structure: header row, then one row with two columns
  const cells = [
    headerRow,
    [leftCol, rightCol]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
