/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Cards (cards8)'];
  const rows = [headerRow];

  // Find all product-item blocks
  const items = element.querySelectorAll(':scope > .product-item');
  items.forEach((item) => {
    // Image cell: find the image inside .product-item__image
    let imageEl = null;
    const imageContainer = item.querySelector('.product-item__image');
    if (imageContainer) {
      imageEl = imageContainer.querySelector('img');
    }
    if (!imageEl) {
      imageEl = item.querySelector('img');
    }

    // Text cell: collect all relevant text content
    const infoContainer = item.querySelector('.product-item__info-container');
    const textCellContent = [];
    if (infoContainer) {
      // Get the title (h2)
      const h2 = infoContainer.querySelector('h2');
      if (h2) textCellContent.push(h2.cloneNode(true));
      // Get the description (p)
      const p = infoContainer.querySelector('p');
      if (p) textCellContent.push(p.cloneNode(true));
      // Get all label spans as text
      const labels = infoContainer.querySelectorAll('.product-item__labels .product-label');
      if (labels.length > 0) {
        const labelsDiv = document.createElement('div');
        labels.forEach((lbl) => {
          const span = document.createElement('span');
          span.textContent = lbl.title || lbl.textContent;
          span.setAttribute('style', 'display:inline-block;margin-right:6px;background:#eee;padding:2px 6px;border-radius:4px;font-size:90%;');
          labelsDiv.appendChild(span);
        });
        textCellContent.push(labelsDiv);
      }
      // Get CTA (link to product)
      const link = infoContainer.querySelector('a[href]');
      if (link) {
        // Use the h2 text as CTA text if available
        let ctaText = '';
        const h2 = infoContainer.querySelector('h2');
        if (h2) {
          ctaText = h2.textContent;
        } else {
          ctaText = link.textContent;
        }
        if (ctaText && link.href) {
          const cta = document.createElement('a');
          cta.href = link.href;
          cta.textContent = ctaText;
          cta.setAttribute('style', 'display:block;margin-top:8px;');
          textCellContent.push(cta);
        }
      }
    }
    rows.push([
      imageEl ? imageEl.cloneNode(true) : '',
      textCellContent.length > 0 ? textCellContent : ''
    ]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
