/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns48)'];

  // Defensive: get direct children
  const children = Array.from(element.children);
  // Expecting two columns: left (image), right (text + button)
  let leftCol = null;
  let rightCol = null;

  // Find left and right columns by class
  children.forEach((child) => {
    if (child.classList.contains('illu')) {
      leftCol = child;
    } else if (child.classList.contains('banner__text')) {
      rightCol = child;
    }
  });

  // Fallback: if not found, just use first and second child
  if (!leftCol && children[0]) leftCol = children[0];
  if (!rightCol && children[1]) rightCol = children[1];

  // Compose the columns row
  const columnsRow = [leftCol, rightCol];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
