/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Get left and right columns
  const colLeft = getChildByClass(element, 'col-left');
  const colRight = getChildByClass(element, 'col-right');

  // Defensive: if missing, fallback to empty div
  const leftContent = colLeft || document.createElement('div');
  const rightContent = colRight || document.createElement('div');

  // Build table rows
  const headerRow = ['Columns (columns22)'];

  // The second row: left and right columns
  const contentRow = [leftContent, rightContent];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
