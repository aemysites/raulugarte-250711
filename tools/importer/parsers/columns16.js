/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns16)'];

  // Defensive: get immediate left/right columns
  const leftCol = element.querySelector(':scope > .col-left');
  const rightCol = element.querySelector(':scope > .col-right');

  // If not found, fallback to first/second child
  const left = leftCol || element.children[0];
  const right = rightCol || element.children[1];

  // First content row: left and right columns side by side
  const contentRow = [left, right];

  // Build table array
  const tableCells = [headerRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace original element
  element.replaceWith(block);
}
