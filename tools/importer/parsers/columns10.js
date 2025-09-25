/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two columns by immediate children
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // Defensive: ensure we have at least two columns
  const leftCol = columns[0] || document.createElement('div');
  const rightCol = columns[1] || document.createElement('div');

  // Build the table rows
  const headerRow = ['Columns (columns10)'];
  const contentRow = [leftCol, rightCol];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
