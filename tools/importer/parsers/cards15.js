/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all card rows
  const rows = Array.from(element.querySelectorAll('.col_row'));
  const cells = [];
  // Header row
  cells.push(['Cards (cards15)']);

  rows.forEach((row) => {
    // Left column: image
    const imgCol = row.querySelector('.col_left');
    let img = imgCol && imgCol.querySelector('img');
    // Defensive: If image is lazy-loaded, use data-lazy-src if src is SVG placeholder
    if (img && img.src && img.src.startsWith('data:image/svg+xml')) {
      const realSrc = img.getAttribute('data-lazy-src');
      if (realSrc) img.src = realSrc;
    }
    // Right column: text content
    const textCol = row.querySelector('.col_right');
    // Compose text cell
    const textCell = [];
    if (textCol) {
      // Title: h4 (year) + h2 (main title)
      const h4 = textCol.querySelector('h4');
      const h2 = textCol.querySelector('h2');
      if (h4) textCell.push(h4);
      if (h2) textCell.push(h2);
      // All paragraphs
      const ps = textCol.querySelectorAll('p');
      ps.forEach((p) => textCell.push(p));
    }
    cells.push([
      img || '',
      textCell
    ]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
