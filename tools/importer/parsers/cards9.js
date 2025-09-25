/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a single <a> element
  function extractCard(cardAnchor) {
    // Find image (first img inside)
    const img = cardAnchor.querySelector('img');

    // Find info container
    const info = cardAnchor.querySelector('.grouplist-item__info');
    const cellContent = document.createElement('div');
    if (info) {
      // Get all children of info (to ensure all text is included)
      Array.from(info.childNodes).forEach((node) => {
        // Only skip empty <p> (with only whitespace)
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'P' && !node.textContent.trim()) {
            return;
          }
          cellContent.appendChild(node.cloneNode(true));
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // Add stray text nodes
          cellContent.appendChild(document.createTextNode(node.textContent));
        }
      });
    }
    // Add CTA: link to the card's href, using the h2 text or fallback
    const href = cardAnchor.getAttribute('href');
    if (href) {
      const h2 = info ? info.querySelector('h2') : null;
      const link = document.createElement('a');
      link.href = href;
      link.textContent = h2 && h2.textContent.trim() ? h2.textContent : 'Read more';
      cellContent.appendChild(link);
    }
    return [img, cellContent];
  }

  // Get all card anchors (direct children or self)
  let cardAnchors = [];
  if (element.tagName === 'A') {
    cardAnchors = [element];
  } else {
    cardAnchors = Array.from(element.querySelectorAll(':scope > a'));
  }

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards9)'];
  rows.push(headerRow);
  // Card rows
  cardAnchors.forEach(cardAnchor => {
    const [img, cellContent] = extractCard(cardAnchor);
    rows.push([img, cellContent]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
