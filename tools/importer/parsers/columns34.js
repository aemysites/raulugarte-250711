/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns34)'];

  // Defensive: get all immediate children that are columns
  // In this source HTML, each .grouplist-item is a column
  // If element itself is a .grouplist-item, treat it as a single column
  let items = [];
  if (element.classList.contains('grouplist-item')) {
    items = [element];
  } else {
    items = Array.from(element.querySelectorAll(':scope > .grouplist-item'));
    // Fallback: if none found, treat all direct children as columns
    if (items.length === 0) {
      items = Array.from(element.children);
    }
  }

  // For each item, extract its image and info as a single cell
  const columns = items.map((item) => {
    // Defensive: get image block
    const imageDiv = item.querySelector(':scope > .grouplist-item__image');
    // Defensive: get info block
    const infoDiv = item.querySelector(':scope > .grouplist-item__info');
    // Compose cell content
    const cellContent = [];
    if (imageDiv) cellContent.push(imageDiv);
    if (infoDiv) cellContent.push(infoDiv);
    // If both missing, fallback to whole item
    if (cellContent.length === 0) cellContent.push(item);
    return cellContent;
  });

  // Build the table rows
  const rows = [headerRow, columns];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the element with the new block
  element.replaceWith(block);
}
