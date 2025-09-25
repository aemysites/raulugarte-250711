/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all relevant text content from the card
  function createTextCell(card, infoDiv, linkHref, labelsDiv) {
    const frag = document.createDocumentFragment();
    // Title (h2)
    let h2 = infoDiv && infoDiv.querySelector('h2');
    if (!h2) {
      // fallback: find first h2 in card
      h2 = card.querySelector('h2');
    }
    if (h2) {
      const h = document.createElement('h3');
      h.textContent = h2.textContent;
      frag.appendChild(h);
    }
    // Description (p)
    let p = infoDiv && infoDiv.querySelector('p');
    if (!p) {
      // fallback: find first p in card
      p = card.querySelector('p');
    }
    if (p) {
      frag.appendChild(p.cloneNode(true));
    }
    // Labels (icons)
    if (labelsDiv && labelsDiv.children.length > 0) {
      const labels = document.createElement('div');
      labels.className = 'product-labels';
      Array.from(labelsDiv.children).forEach(span => {
        const icon = document.createElement('span');
        icon.className = span.className;
        if (span.title) icon.title = span.title;
        labels.appendChild(icon);
      });
      frag.appendChild(labels);
    }
    // CTA (link)
    if (linkHref) {
      const cta = document.createElement('p');
      const a = document.createElement('a');
      a.href = linkHref;
      a.textContent = 'Mehr erfahren';
      cta.appendChild(a);
      frag.appendChild(cta);
    }
    return frag;
  }

  // Build the table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards58)'];
  rows.push(headerRow);

  // Find all product-item cards
  const cards = element.querySelectorAll(':scope > .product-item');
  cards.forEach(card => {
    // Image cell
    let imgEl = null;
    const imageDiv = card.querySelector('.product-item__image');
    if (imageDiv) {
      imgEl = imageDiv.querySelector('img');
    }
    // Text cell
    const infoContainer = card.querySelector('.product-item__info-container');
    let infoDiv = null, labelsDiv = null, linkHref = '';
    if (infoContainer) {
      const link = infoContainer.querySelector('a');
      if (link) {
        linkHref = link.href;
        infoDiv = link.querySelector('.product-item__info');
      }
      labelsDiv = infoContainer.querySelector('.product-item__labels');
    }
    // Compose row
    const textCell = createTextCell(card, infoDiv, linkHref, labelsDiv);
    rows.push([
      imgEl ? imgEl : '',
      textCell
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
