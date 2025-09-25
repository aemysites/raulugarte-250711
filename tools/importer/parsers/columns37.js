/* global WebImporter */
export default function parse(element, { document }) {
  // Get left and right column elements
  const leftCol = element.querySelector('.col-left');
  const rightCol = element.querySelector('.col-right');

  // Defensive: handle missing columns
  const leftContent = leftCol ? Array.from(leftCol.childNodes) : [];
  let rightContent = [];
  if (rightCol) {
    // If there's an <img>, use it; otherwise, use all content
    const img = rightCol.querySelector('img');
    if (img) {
      rightContent = [img];
    } else {
      rightContent = Array.from(rightCol.childNodes);
    }
  }

  // Table rows
  const headerRow = ['Columns (columns37)'];
  const contentRow = [leftContent, rightContent];

  // Create the table using DOMUtils
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
