/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by block spec
  const headerRow = ['Cards (cards63)'];

  // Defensive: find the card container
  const cardRow = element;
  let imageEl = null;
  let textContent = [];

  // Find the image (first column)
  const coverDiv = cardRow.querySelector('.documents-table-col__cover');
  if (coverDiv) {
    const img = coverDiv.querySelector('img');
    if (img) imageEl = img;
  }

  // Find the text content (second column)
  const contentDiv = cardRow.querySelector('.documents-table-col__content');
  if (contentDiv) {
    // Title (h3)
    const h3 = contentDiv.querySelector('h3');
    if (h3) textContent.push(h3);
    // Description/CTA (p)
    const p = contentDiv.querySelector('p');
    if (p) textContent.push(p);
  }

  // Build the table rows
  const rows = [headerRow];
  rows.push([
    imageEl || '',
    textContent.length ? textContent : ''
  ]);

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
