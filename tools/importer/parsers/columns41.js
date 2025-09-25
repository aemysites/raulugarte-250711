/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children by selector
  function getDirectChild(parent, selector) {
    return Array.from(parent.children).find((el) => el.matches(selector));
  }

  // Get left and right columns
  const leftCol = getDirectChild(element, '.col-left');
  const rightCol = getDirectChild(element, '.col-right');

  // Defensive: fallback if not found
  const leftContent = leftCol ? Array.from(leftCol.childNodes) : [];
  const rightContent = rightCol ? Array.from(rightCol.childNodes) : [];

  // Table header row
  const headerRow = ['Columns (columns41)'];
  // Table content row: two columns
  const contentRow = [leftContent, rightContent];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
