/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block requirements
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Get all card rows
  const cardRows = element.querySelectorAll(':scope > .col_row');

  cardRows.forEach((cardRow) => {
    // Left column: image
    const imgCol = cardRow.querySelector('.col_left img');
    // Defensive: ensure we have an image
    let imageEl = null;
    if (imgCol) {
      imageEl = imgCol;
    }

    // Right column: text content
    const rightCol = cardRow.querySelector('.col_right');
    let textContent = [];
    if (rightCol) {
      // Gather h4 (year), h2 (title), and all paragraphs
      const year = rightCol.querySelector('h4');
      const title = rightCol.querySelector('h2');
      const paragraphs = rightCol.querySelectorAll('p');
      // Compose text content
      if (year) textContent.push(year);
      if (title) textContent.push(title);
      paragraphs.forEach((p) => {
        // Exclude empty paragraphs (e.g., &nbsp;)
        if (p.textContent && p.textContent.trim().replace(/\u00a0/g, '') !== '') {
          textContent.push(p);
        }
      });
    }

    // Add the row if we have both image and text
    if (imageEl && textContent.length) {
      rows.push([imageEl, textContent]);
    }
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
