/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children with a class
  function getDirectChildrenByClass(parent, className) {
    return Array.from(parent.children).filter(child => child.classList.contains(className));
  }

  const headerRow = ['Cards (cards18)']; // header row must have exactly one column
  const rows = [headerRow];

  // Each .documents-table-col is a card
  const cardEls = getDirectChildrenByClass(element, 'documents-table-col');
  cardEls.forEach(cardEl => {
    // Image: first child div with class .documents-table-col__cover > img
    const coverDiv = getDirectChildrenByClass(cardEl, 'documents-table-col__cover')[0];
    let imgEl = null;
    if (coverDiv) {
      imgEl = coverDiv.querySelector('img');
    }

    // Content: div.documents-table-col__content
    const contentDiv = getDirectChildrenByClass(cardEl, 'documents-table-col__content')[0];
    let contentCell = [];
    if (contentDiv) {
      // Title: h3
      const h3 = contentDiv.querySelector('h3');
      if (h3) contentCell.push(h3);
      // Description: p (may contain link)
      const p = contentDiv.querySelector('p');
      if (p) contentCell.push(p);
    }

    // Defensive: if no image, cell is empty
    const row = [imgEl || '', contentCell.length ? contentCell : ''];
    rows.push(row);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
