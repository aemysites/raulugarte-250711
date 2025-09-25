/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Get all product items
  const cards = Array.from(element.querySelectorAll(':scope > .product-item'));

  cards.forEach((card) => {
    // Image cell
    let imgCell = '';
    const img = card.querySelector('.product-item__image img');
    if (img) {
      imgCell = img;
    }

    // Text cell: collect all content from .product-item__info-container
    const infoContainer = card.querySelector('.product-item__info-container');
    let textCell = '';
    if (infoContainer) {
      // Clone the info container to preserve all text, links, and labels
      const clone = infoContainer.cloneNode(true);
      // Remove the image link if present (shouldn't be, but just in case)
      const imgLink = clone.querySelector('.product-item__image');
      if (imgLink) imgLink.remove();
      textCell = clone;
    }

    rows.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
