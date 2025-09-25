/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from each article
  function getCardRow(article) {
    // Find image
    const img = article.querySelector('img');
    // Compose text cell
    const textParts = [];
    // h4 (category)
    const h4 = article.querySelector('h4');
    if (h4) {
      textParts.push(h4);
    }
    // h2 (title)
    const h2 = article.querySelector('h2');
    if (h2) {
      textParts.push(h2);
    }
    // p (description)
    const p = article.querySelector('p');
    if (p) {
      textParts.push(p);
    }
    // CTA link
    const btnContainer = article.querySelector('.button-container');
    let ctaLink = null;
    if (btnContainer) {
      const link = btnContainer.querySelector('a');
      if (link) {
        ctaLink = link;
      }
    }
    // Compose all text elements into one cell
    const textCell = ctaLink ? [...textParts, ctaLink] : textParts;
    return [img, textCell];
  }

  // Build table rows
  const headerRow = ['Cards (cards39)'];
  const rows = [headerRow];
  // Get all cards
  const articles = element.querySelectorAll(':scope > article');
  articles.forEach((article) => {
    rows.push(getCardRow(article));
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
