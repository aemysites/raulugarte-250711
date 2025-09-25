/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Convert all iframes (except images) to links
  function replaceIframesWithLinks(node) {
    if (!node) return;
    // Recursively process children
    node.querySelectorAll('iframe').forEach((iframe) => {
      // Only replace if not inside <picture> or <img>
      if (!iframe.closest('picture') && !iframe.closest('img')) {
        const a = document.createElement('a');
        a.href = iframe.src;
        a.textContent = iframe.src;
        iframe.replaceWith(a);
      }
    });
  }

  // Find the two main blocks: the two-columns and the cta
  const blocks = Array.from(element.querySelectorAll(':scope > .l-flexible-content-block'));
  const twoColumns = blocks.find(b => b.classList.contains('two-columns'));
  const ctaBlock = blocks.find(b => b.classList.contains('cta'));

  // --- First columns block (two-columns) ---
  let twoColRow = null;
  if (twoColumns) {
    const left = twoColumns.querySelector(':scope > .col-left');
    const right = twoColumns.querySelector(':scope > .col-right');
    // Defensive: If left or right missing, use empty div
    const leftCell = left ? left.cloneNode(true) : document.createElement('div');
    const rightCell = right ? right.cloneNode(true) : document.createElement('div');
    // Replace iframes with links in both cells
    replaceIframesWithLinks(leftCell);
    replaceIframesWithLinks(rightCell);
    twoColRow = [leftCell, rightCell];
  }

  // --- Second columns block (cta) ---
  let ctaRow = null;
  if (ctaBlock) {
    const ctaLeft = ctaBlock.querySelector(':scope > .col-left');
    const ctaRight = ctaBlock.querySelector(':scope > .col-right');
    let rightCell = ctaRight ? ctaRight.cloneNode(true) : document.createElement('div');
    // If ctaRight has an image, use the image only (matches screenshot)
    if (ctaRight) {
      const img = ctaRight.querySelector('img');
      if (img) {
        rightCell = img.cloneNode(true);
      }
    }
    // Replace iframes with links in left cell (right cell is image or div)
    const leftCell = ctaLeft ? ctaLeft.cloneNode(true) : document.createElement('div');
    replaceIframesWithLinks(leftCell);
    ctaRow = [leftCell, rightCell];
  }

  // Build the table rows
  const headerRow = ['Columns (columns30)'];
  const rows = [headerRow];
  if (twoColRow) rows.push(twoColRow);
  if (ctaRow) rows.push(ctaRow);

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
