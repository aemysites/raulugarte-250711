/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards23)'];

  // Find all product cards in the source HTML
  const cardRows = [];
  const resultRows = element.querySelectorAll('.facetresult__row .article-item');
  resultRows.forEach((item) => {
    // Image (mandatory)
    let imageCell = '';
    const imgWrap = item.querySelector('.article-item__image img');
    if (imgWrap) {
      imageCell = imgWrap;
    }

    // Text content (mandatory)
    // Title (from h3)
    let title = '';
    const h3 = item.querySelector('h3');
    if (h3) {
      // h3 may contain a span for subtitle, so build title as: strong(title) + (subtitle)
      const strong = document.createElement('strong');
      strong.textContent = h3.childNodes[0]?.textContent?.trim() || '';
      let subtitle = '';
      if (h3.querySelector('span')) {
        subtitle = ' ' + h3.querySelector('span').textContent.trim();
      }
      title = document.createElement('div');
      title.appendChild(strong);
      if (subtitle) {
        title.append(document.createTextNode(subtitle));
      }
    }

    // Description: specs and more
    const descFrag = document.createDocumentFragment();
    // Defensive: get all .article-item__info children except h3
    const info = item.querySelector('.article-item__info');
    if (info) {
      // Get all children except h3
      Array.from(info.children).forEach((child) => {
        if (child.tagName !== 'H3') {
          // For .article-item__info--specs, get all .row text
          if (child.classList.contains('article-item__info--specs')) {
            child.querySelectorAll('.row').forEach((row) => {
              const label = row.querySelector('.article-item__info--label');
              const values = row.querySelectorAll('.article-item__info--value');
              let line = '';
              if (label) {
                line = label.textContent.trim();
              }
              if (values.length) {
                line += ': ' + Array.from(values).map(v => v.textContent.trim()).join(' | ');
              }
              if (line) {
                const p = document.createElement('div');
                p.textContent = line;
                descFrag.appendChild(p);
              }
            });
          } else if (child.classList.contains('article-item__info--specs-more')) {
            // Add all spans and divs
            child.querySelectorAll('span, div').forEach((el) => {
              if (el.textContent.trim()) {
                const p = document.createElement('div');
                p.textContent = el.textContent.trim();
                descFrag.appendChild(p);
              }
            });
          }
        }
      });
    }

    // CTA: Find .button--kaufen (Inquire)
    let cta = '';
    const ctaBtn = item.querySelector('.button--kaufen');
    if (ctaBtn && ctaBtn.textContent.trim()) {
      const link = document.createElement('a');
      link.href = item.querySelector('a.article-item__main-link')?.href || '#';
      link.textContent = ctaBtn.textContent.trim();
      link.className = 'cta-link';
      cta = link;
    }

    // Compose text cell: title, description, CTA
    const textCell = document.createElement('div');
    if (title) textCell.appendChild(title);
    if (descFrag.childNodes.length) textCell.appendChild(descFrag);
    if (cta) textCell.appendChild(cta);

    cardRows.push([imageCell, textCell]);
  });

  // Build table
  const tableCells = [headerRow, ...cardRows];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
