/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the text content, keeping <br> and links
  function getTextContentWithLinks(container) {
    // Clone to avoid modifying the original
    const frag = document.createDocumentFragment();
    container.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'BR' || node.tagName === 'A')) {
        frag.appendChild(node.cloneNode(true));
      } else if (node.nodeType === Node.TEXT_NODE) {
        frag.appendChild(document.createTextNode(node.textContent));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // For other elements, just append their text content
        frag.appendChild(document.createTextNode(node.textContent));
      }
    });
    return frag;
  }

  const headerRow = ['Cards (cards45)'];
  const rows = [headerRow];

  // Find all card rows
  const cardRows = element.querySelectorAll(':scope > .col_row');
  cardRows.forEach((row) => {
    const left = row.querySelector('.col_left');
    const right = row.querySelector('.col_right');
    let img = left ? left.querySelector('img') : null;
    let imgCell = img ? img : '';

    // Build the text cell
    let textCellContent = [];
    if (right) {
      // Title (h3)
      const h3 = right.querySelector('h3');
      if (h3) {
        textCellContent.push(h3);
      }
      // Description and CTA
      const p = right.querySelector('p');
      if (p) {
        // Split description and CTA
        // We'll treat the last <a> as CTA if present
        const a = p.querySelector('a');
        let descFrag = document.createDocumentFragment();
        p.childNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
            // skip, handle as CTA
          } else {
            descFrag.appendChild(node.cloneNode(true));
          }
        });
        // Remove trailing <br> if present
        let lastChild = descFrag.lastChild;
        if (lastChild && lastChild.nodeType === Node.ELEMENT_NODE && lastChild.tagName === 'BR') {
          descFrag.removeChild(lastChild);
        }
        // Only add description if not empty
        if (descFrag.textContent.trim()) {
          const descP = document.createElement('p');
          descP.appendChild(descFrag);
          textCellContent.push(descP);
        }
        // CTA
        if (a) {
          textCellContent.push(a);
        }
      }
    }
    rows.push([imgCell, textCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
