/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the relevant card info from a .product-item
  function extractCardInfo(productItem) {
    // Image: first img in .product-item__image
    const imageContainer = productItem.querySelector('.product-item__image');
    let image = null;
    if (imageContainer) {
      image = imageContainer.querySelector('img');
      if (image) image = image.cloneNode(true);
    }

    // Info: title (h2), description (p), link (from wrapping <a>), labels (optional)
    const infoContainer = productItem.querySelector('.product-item__info-container');
    let title = '';
    let desc = '';
    let link = '';
    let cta = null;
    if (infoContainer) {
      const a = infoContainer.querySelector('a');
      if (a) {
        link = a.getAttribute('href');
        const info = a.querySelector('.product-item__info');
        if (info) {
          const h2 = info.querySelector('h2');
          if (h2) title = h2.textContent.trim();
          const p = info.querySelector('p');
          if (p) desc = p.textContent.trim();
        }
        // CTA: use title as link text if present
        if (link) {
          let ctaText = title || link;
          cta = document.createElement('a');
          cta.href = link;
          cta.textContent = ctaText;
        }
      }
    }
    // Labels: collect all .product-label spans (optional)
    const labelsContainer = productItem.querySelector('.product-item__labels');
    let labels = [];
    if (labelsContainer) {
      labels = Array.from(labelsContainer.querySelectorAll('.product-label'));
    }

    // Compose the right cell: title (strong), description, labels, CTA (link)
    const rightCell = document.createElement('div');
    if (title) {
      const h = document.createElement('strong');
      h.textContent = title;
      rightCell.appendChild(h);
    }
    if (desc) {
      const p = document.createElement('div');
      p.textContent = desc;
      rightCell.appendChild(document.createElement('br'));
      rightCell.appendChild(p);
    }
    if (labels.length > 0) {
      const labelsDiv = document.createElement('div');
      labels.forEach(label => {
        // Use the label's title as text
        if (label.title) {
          const span = document.createElement('span');
          span.textContent = label.title;
          labelsDiv.appendChild(span);
        }
      });
      rightCell.appendChild(document.createElement('br'));
      rightCell.appendChild(labelsDiv);
    }
    if (cta) {
      rightCell.appendChild(document.createElement('br'));
      rightCell.appendChild(cta);
    }

    return [image, rightCell];
  }

  // Find all product items
  const productList = element.querySelector('.c-productlistview');
  const productItems = productList ? productList.querySelectorAll('.product-item') : [];

  // Compose the table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards29)'];
  rows.push(headerRow);
  // Card rows
  productItems.forEach((item) => {
    rows.push(extractCardInfo(item));
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
