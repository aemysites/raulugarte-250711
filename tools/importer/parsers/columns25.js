/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Columns (columns25)'];

  // Defensive: get left and right columns
  const leftCol = element.querySelector('.col-left');
  const rightCol = element.querySelector('.col-right');

  // Defensive: fallback to empty arrays if not found
  const leftContent = leftCol ? Array.from(leftCol.childNodes) : [];
  const rightImg = rightCol ? rightCol.querySelector('img') : null;
  // If there are other elements in rightCol, include them as well
  let rightContent = [];
  if (rightImg) {
    rightContent.push(rightImg);
  }

  // Second row: two columns, left is text/button, right is image
  const columnsRow = [
    leftContent,
    rightContent
  ];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  element.replaceWith(table);
}
