/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate child by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Get left (image) and right (info) columns
  const imageCol = getChildByClass(element, 'grouplist-item__image');
  const infoCol = getChildByClass(element, 'grouplist-item__info');

  // Defensive: fallback to all children if structure changes
  let leftCell = imageCol || element.children[0];
  let rightCell = infoCol || element.children[1];

  // Table rows
  const headerRow = ['Columns (columns51)'];
  const columnsRow = [leftCell, rightCell];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
