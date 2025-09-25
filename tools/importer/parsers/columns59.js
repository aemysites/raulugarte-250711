/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure we have the expected structure
  const grouplistItem = element.querySelector('.grouplist-item');
  if (!grouplistItem) return;

  // Get the image (left column)
  const imageDiv = grouplistItem.querySelector('.grouplist-item__image');
  let imageEl = null;
  if (imageDiv) {
    imageEl = imageDiv.querySelector('img');
  }

  // Get the info (right column)
  const infoDiv = grouplistItem.querySelector('.grouplist-item__info');
  let infoContent = [];
  if (infoDiv) {
    // Grab all children of infoDiv (h4, h2, p, etc.), but filter out empty <p> tags
    infoContent = Array.from(infoDiv.children).filter((el) => {
      if (el.tagName === 'P') {
        return el.textContent.trim().length > 0;
      }
      return true;
    });
  }

  // Compose the columns row
  const columnsRow = [
    imageEl ? imageEl : '',
    infoContent.length ? infoContent : ''
  ];

  // Compose the table
  const headerRow = ['Columns (columns59)'];
  const rows = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
