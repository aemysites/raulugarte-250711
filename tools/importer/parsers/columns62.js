/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: get the two columns by class name
  const leftCol = element.querySelector('.col-left');
  const rightCol = element.querySelector('.col-right');

  // If either column is missing, fallback to all children
  let leftContent = leftCol;
  let rightContent = rightCol;
  if (!leftCol || !rightCol) {
    const divs = element.querySelectorAll(':scope > div');
    leftContent = divs[0] || document.createElement('div');
    rightContent = divs[1] || document.createElement('div');
  }

  // Build the table rows
  const headerRow = ['Columns (columns62)'];
  const columnsRow = [leftContent, rightContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  element.replaceWith(table);
}
