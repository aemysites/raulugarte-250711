/* global WebImporter */
export default function parse(element, { document }) {
  // Get all card links (each <a> is a card wrapper)
  const cardLinks = Array.from(element.querySelectorAll(':scope > a'));

  // Table header row
  const headerRow = ['Cards (cards46)'];
  const rows = [headerRow];

  cardLinks.forEach((a) => {
    // Find the card content
    const card = a.querySelector(':scope > .grouplist-item');
    if (!card) return;

    // Image cell: find the image element
    const imgDiv = card.querySelector(':scope > .grouplist-item__image');
    let imgElem = imgDiv && imgDiv.querySelector('img');
    // Defensive: if no image, use empty string
    const imageCell = imgElem ? imgElem : '';

    // Text cell: title, description, CTA
    const infoDiv = card.querySelector(':scope > .grouplist-item__info');
    let textCellContent = [];
    if (infoDiv) {
      // Title: h2
      const h2 = infoDiv.querySelector('h2');
      if (h2) textCellContent.push(h2);
      // Description: all <p> elements (including .excerpt)
      const ps = infoDiv.querySelectorAll('p');
      ps.forEach((p) => {
        if (p.textContent.trim()) textCellContent.push(p);
      });
      // CTA: use the parent <a> as a link if present
      if (a.href) {
        const cta = document.createElement('a');
        cta.href = a.href;
        cta.textContent = 'Mehr erfahren';
        textCellContent.push(cta);
      }
    }
    rows.push([imageCell, textCellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
