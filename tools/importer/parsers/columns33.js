/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: replace all iframes (except images) with links to their src
  function replaceIframesWithLinks(root) {
    const iframes = root.querySelectorAll('iframe');
    iframes.forEach((iframe) => {
      const src = iframe.getAttribute('src');
      if (src) {
        const a = document.createElement('a');
        a.href = src;
        a.textContent = src;
        iframe.replaceWith(a);
      }
    });
  }

  // Get the two main columns: left (text), right (form)
  const textCol = element.querySelector('.text-container');
  const formCol = element.querySelector('.form-container');
  if (!textCol || !formCol) return;

  // Clone and preserve all content (including text nodes)
  const leftCol = textCol.cloneNode(true);
  const rightCol = formCol.cloneNode(true);

  // Replace iframes with links in both columns
  replaceIframesWithLinks(leftCol);
  replaceIframesWithLinks(rightCol);

  // Ensure all text content is included by flattening and appending text nodes if necessary
  // (Not needed here since cloneNode(true) preserves all text and structure)

  // Table header row
  const headerRow = ['Columns (columns33)'];

  // Table content row: two columns, left and right
  const contentRow = [leftCol, rightCol];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
