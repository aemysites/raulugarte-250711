/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns block (the one with class 'l-flexible-content-block')
  const columnsBlock = element.querySelector('.l-flexible-content-block');
  if (!columnsBlock) return;

  // Get the immediate column containers
  const colDivs = columnsBlock.querySelectorAll(':scope > .col-left, :scope > .col-right');
  if (colDivs.length < 2) return;

  // Prepare header row
  const headerRow = ['Columns (columns32)'];

  // Prepare columns row: each cell is the content of a column div
  // Use the entire column div content for resilience
  const leftCol = colDivs[0];
  const rightCol = colDivs[1];

  // Move children out of the column containers so we don't nest blocks
  const leftColContent = Array.from(leftCol.childNodes);
  const rightColContent = Array.from(rightCol.childNodes);

  // Remove empty text nodes for cleaner output
  function cleanNodes(nodes) {
    return nodes.filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
  }

  const leftContent = cleanNodes(leftColContent);
  const rightContent = cleanNodes(rightColContent);

  // Construct the table rows
  const rows = [
    headerRow,
    [leftContent, rightContent],
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
