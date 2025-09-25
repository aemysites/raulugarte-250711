/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child by selector
  function getDirectChild(parent, selector) {
    return parent.querySelector(`:scope > ${selector}`);
  }

  // 1. Header row
  const headerRow = ['Columns (columns7)'];

  // 2. Get left and right columns
  const leftCol = getDirectChild(element, '.split-hero__left');
  const rightCol = getDirectChild(element, '.split-hero__right');

  // --- LEFT COLUMN CONTENT ---
  let leftContent = [];
  if (leftCol) {
    // Instead of just the article, include all content from leftCol
    Array.from(leftCol.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        leftContent.push(node.cloneNode(true));
      }
    });
  }

  // --- RIGHT COLUMN CONTENT ---
  let rightContent = [];
  if (rightCol) {
    // Find the carousel slides
    const swiperWrapper = rightCol.querySelector('.swiper-wrapper');
    if (swiperWrapper) {
      // Only use the first slide (active) for the main block visual
      const firstSlide = swiperWrapper.querySelector('.swiper-slide');
      if (firstSlide) {
        // Compose: background image, foreground image, text
        // Include all children of the first slide
        Array.from(firstSlide.children).forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
            rightContent.push(node.cloneNode(true));
          }
        });
      }
    }
    // Defensive fallback: if still empty, use all children of rightCol
    if (rightContent.length === 0) {
      Array.from(rightCol.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          rightContent.push(node.cloneNode(true));
        }
      });
    }
  }

  // Defensive fallback: if no content found, use the columns themselves
  if (leftContent.length === 0 && leftCol) leftContent.push(leftCol.cloneNode(true));
  if (rightContent.length === 0 && rightCol) rightContent.push(rightCol.cloneNode(true));

  // 3. Build table rows
  const columnsRow = [leftContent, rightContent];

  // 4. Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // 5. Replace element
  element.replaceWith(table);
}
