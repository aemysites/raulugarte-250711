/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for block table
  const headerRow = ['Cards (cardsNoImages2)'];

  // Defensive: Find the <ul> containing the cards (menu items)
  const ul = element.querySelector('ul.sub');
  if (!ul) return;

  // Each <li> is a card; extract the <a> from each
  const cardRows = [];
  ul.querySelectorAll('li').forEach((li) => {
    const a = li.querySelector('a');
    if (a) {
      // Create a card cell: heading (from link text)
      const heading = document.createElement('strong');
      heading.textContent = a.textContent;
      // If the link text and heading are the same, only show heading
      // If you want a CTA, but here the menu is just a heading with a link
      // Place heading in cell
      const cell = document.createElement('div');
      cell.appendChild(heading);
      // If you want the link as a CTA, add below (optional)
      // cell.appendChild(document.createElement('br'));
      // cell.appendChild(a.cloneNode(true));
      cardRows.push([cell]);
    }
  });

  // Build table data: header + cards
  const tableData = [headerRow, ...cardRows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace original element with block table
  element.replaceWith(block);
}
