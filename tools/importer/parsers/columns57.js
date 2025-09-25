/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns57)'];

  // Defensive: get immediate children for columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // If there are not exactly two columns, fallback to using the element's children
  let leftCol = columns[0] || null;
  let rightCol = columns[1] || null;

  // If structure is different, fallback to all children as columns
  if (!leftCol || !rightCol) {
    const children = Array.from(element.children);
    leftCol = children[0] || document.createElement('div');
    rightCol = children[1] || document.createElement('div');
  }

  // Build the table rows
  const rows = [
    headerRow,
    [leftCol, rightCol],
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
