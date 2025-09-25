/* global WebImporter */
export default function parse(element, { document }) {
  function findMainImage(el) {
    const nav = el.querySelector('.flipbook-nav');
    if (!nav) return null;
    const imgs = Array.from(nav.querySelectorAll('img'));
    for (const img of imgs) {
      if (img.src && !img.src.startsWith('data:image/svg+xml')) {
        return img;
      }
    }
    return null;
  }

  function findMainText(el) {
    const textLayer = el.querySelector('.textLayer');
    if (!textLayer) return null;
    const spans = Array.from(textLayer.querySelectorAll('span[role="presentation"]'));
    // Remove empty spans
    const filteredSpans = spans.filter(s => s.textContent && s.textContent.trim());
    const frag = document.createElement('div');
    if (filteredSpans.length) {
      // Title (first span)
      const h1 = document.createElement('h1');
      h1.textContent = filteredSpans[0].textContent;
      frag.appendChild(h1);
      // Subheading (second span, if present)
      if (filteredSpans[1]) {
        const h2 = document.createElement('h2');
        h2.textContent = filteredSpans[1].textContent;
        frag.appendChild(h2);
      }
      // Additional lines as paragraphs
      for (let i = 2; i < filteredSpans.length; i++) {
        const p = document.createElement('p');
        p.textContent = filteredSpans[i].textContent;
        frag.appendChild(p);
      }
    }
    return frag;
  }

  const headerRow = ['Hero (hero40)'];
  const mainImg = findMainImage(element);
  const mainText = findMainText(element);

  // Always produce 3 rows: header, image (may be empty), content
  const cells = [
    headerRow,
    [mainImg || ''],
    [mainText || ''],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
