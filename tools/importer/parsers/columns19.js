/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Columns (columns19)'];

  // Helper: Replace all non-img elements with a src attribute (e.g., iframes) with a link
  function replaceNonImgSrcWithLinks(root) {
    const nodes = root.querySelectorAll('[src]:not(img)');
    nodes.forEach((node) => {
      const href = node.getAttribute('src');
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = href;
        node.replaceWith(a);
      }
    });
  }

  // Defensive: get immediate left and right columns
  const leftCol = element.querySelector(':scope > .col-left');
  const rightCol = element.querySelector(':scope > .col-right');

  // Defensive: fallback if not found by class
  const children = Array.from(element.children);
  const left = leftCol || children[0];
  const right = rightCol || children[1];

  // For the left column: include the entire form block and ALL text content
  let leftContent = [];
  if (left) {
    const formWrapper = left.querySelector('.gform_wrapper');
    if (formWrapper) {
      // Clone to avoid modifying the original DOM
      const clone = formWrapper.cloneNode(true);
      replaceNonImgSrcWithLinks(clone);
      leftContent.push(clone);
    }
    // Also include any text nodes directly under left (outside form)
    Array.from(left.childNodes).forEach(node => {
      if (node.nodeType === 3 && node.textContent.trim()) {
        leftContent.push(document.createTextNode(node.textContent));
      }
      if (node.nodeType === 1 && node !== formWrapper) {
        // If not the form, include any element with text
        if (node.textContent.trim()) {
          leftContent.push(node.cloneNode(true));
        }
      }
    });
  }

  // For the right column: include the image(s) and ALL text content
  let rightContent = [];
  if (right) {
    // Find all images
    const imgs = Array.from(right.querySelectorAll('img'));
    rightContent.push(...imgs);
    // Find all paragraphs and include their text
    Array.from(right.querySelectorAll('p')).forEach(p => {
      if (p.textContent.trim()) {
        rightContent.push(p.cloneNode(true));
      }
    });
    // Also include any text nodes directly under right
    Array.from(right.childNodes).forEach(node => {
      if (node.nodeType === 3 && node.textContent.trim()) {
        rightContent.push(document.createTextNode(node.textContent));
      }
    });
    rightContent.forEach(node => replaceNonImgSrcWithLinks(node));
  }

  // Second row: two columns, left and right
  const contentRow = [leftContent, rightContent];

  // Build the table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
