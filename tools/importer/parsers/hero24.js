/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the header element (should be only one per block)
  const header = element.querySelector('header.page-header');
  let bgImgEl = null;
  let titleEl = null;

  // 1. Extract background image from inline style
  let bgUrl = '';
  if (header && header.style && header.style.backgroundImage) {
    // backgroundImage: url('...')
    const match = header.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
    if (match && match[1]) {
      bgUrl = match[1];
    }
  }
  if (bgUrl) {
    bgImgEl = document.createElement('img');
    bgImgEl.src = bgUrl;
    // Optionally, add alt text from data-item-alt or data-item-caption
    bgImgEl.alt = header.getAttribute('data-item-alt') || header.getAttribute('data-item-caption') || '';
  }

  // 2. Extract title (h1)
  if (header) {
    titleEl = header.querySelector('h1');
  }

  // Table rows
  const headerRow = ['Hero (hero24)'];
  const imageRow = [bgImgEl ? bgImgEl : ''];
  const contentRow = [titleEl ? titleEl : ''];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
