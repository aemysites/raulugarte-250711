/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct children by selector
  function getDirectChildren(parent, selector) {
    return Array.from(parent.children).filter(el => el.matches(selector));
  }

  // Find all cards (grouplist-item)
  const cardEls = element.querySelectorAll('.grouplist-item');

  // Build the header row
  const rows = [
    ['Cards (cards26)']
  ];

  cardEls.forEach(cardEl => {
    // Get image (first .grouplist-item__image img)
    const imgWrapper = cardEl.querySelector('.grouplist-item__image');
    let imageEl = null;
    if (imgWrapper) {
      imageEl = imgWrapper.querySelector('img');
    }

    // Get info container
    const info = cardEl.querySelector('.grouplist-item__info');
    let textContent = [];
    if (info) {
      // h4 (subtitle/category)
      const h4 = info.querySelector('h4');
      if (h4) {
        // Use <div> for subtitle for flexibility
        const subtitle = document.createElement('div');
        subtitle.append(h4.cloneNode(true));
        textContent.push(subtitle);
      }
      // h2 (main title)
      const h2 = info.querySelector('h2');
      if (h2) {
        // Use <h2> as is
        textContent.push(h2.cloneNode(true));
      }
      // ul.subgroups (list)
      const ul = info.querySelector('ul.subgroups');
      if (ul) {
        textContent.push(ul.cloneNode(true));
      }
      // CTA button (last <a.button>)
      const button = info.querySelector('a.button');
      if (button) {
        textContent.push(button.cloneNode(true));
      }
    }

    // Defensive: fallback to empty div if missing
    if (!imageEl) {
      imageEl = document.createElement('div');
    }
    if (textContent.length === 0) {
      textContent.push(document.createElement('div'));
    }

    rows.push([
      imageEl,
      textContent
    ]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
