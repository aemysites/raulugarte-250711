/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate children of a node by selector
  function getImmediateChild(parent, selector) {
    return Array.from(parent.children).find(el => el.matches(selector));
  }

  // 1. Header row
  const headerRow = ['Columns (columns28)'];

  // 2. Find the two main columns visually
  // Left column: headline + description
  const left = getImmediateChild(element, '.productgroup-header.split-hero');
  let leftContent = null;
  if (left) {
    const leftCol = getImmediateChild(left, '.split-hero__left');
    if (leftCol) {
      // Use the article (h1 + p)
      const article = leftCol.querySelector('article');
      if (article) {
        leftContent = article;
      }
    }
  }

  // Right column: carousel with images (background and foreground)
  let rightContent = null;
  if (left) {
    const rightCol = getImmediateChild(left, '.split-hero__right');
    if (rightCol) {
      // Find the swiper-slide
      const swiperSlide = rightCol.querySelector('.swiper-slide');
      if (swiperSlide) {
        // Compose a container for both images
        const bgDiv = swiperSlide.querySelector('.carousel_landing__background');
        const fgDiv = swiperSlide.querySelector('.carousel_landing__foreground');
        // Create a wrapper div for both images
        const rightWrapper = document.createElement('div');
        if (bgDiv && bgDiv.querySelector('img')) {
          rightWrapper.appendChild(bgDiv.querySelector('img'));
        }
        if (fgDiv && fgDiv.querySelector('img')) {
          rightWrapper.appendChild(fgDiv.querySelector('img'));
        }
        rightContent = rightWrapper;
      }
    }
  }

  // 3. Compose the columns row
  const columnsRow = [leftContent, rightContent];

  // 4. Optionally, add the 'Produkte' heading as a third row (single cell)
  // But per block spec, all rows after header must have same number of columns as row 2
  // So we skip adding 'Produkte' as a separate row, unless we want a third row with two empty cells

  // 5. Build the table
  const cells = [
    headerRow,
    columnsRow
  ];

  // 6. Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
