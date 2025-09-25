/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a .documents-table-col div
  function extractCard(col) {
    // Image (mandatory)
    const imgWrapper = col.querySelector('.documents-table-col__cover');
    let img = imgWrapper ? imgWrapper.querySelector('img') : null;

    // Text content (mandatory)
    const content = col.querySelector('.documents-table-col__content');
    const textCell = document.createElement('div');
    if (content) {
      // Title: h3
      const title = content.querySelector('h3');
      if (title) textCell.appendChild(title.cloneNode(true));

      // Description: all text and links in <p>
      const p = content.querySelector('p');
      if (p) {
        // Clone the <p> including all links and text
        textCell.appendChild(p.cloneNode(true));
      }
    }
    return [img, textCell];
  }

  // Get all .documents-table-col (cards)
  let cardCols = Array.from(element.querySelectorAll('.documents-table-col'));
  if (cardCols.length === 0) {
    const row = element.querySelector('.documents-table-row');
    if (row) {
      cardCols = Array.from(row.querySelectorAll('.documents-table-col'));
    }
  }

  // Compose table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards38)'];
  rows.push(headerRow);
  // Card rows
  cardCols.forEach(col => {
    rows.push(extractCard(col));
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
