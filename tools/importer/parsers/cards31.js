/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the actual image element (handles lazy-loaded SVG placeholder)
  function getRealImage(img) {
    // If data-lazy-src is present and src is a placeholder SVG, update src
    if (
      img.dataset && img.dataset.lazySrc &&
      img.src && img.src.startsWith('data:image/svg+xml')
    ) {
      const realImg = document.createElement('img');
      realImg.src = img.dataset.lazySrc;
      realImg.alt = img.alt || '';
      realImg.title = img.title || '';
      // Copy any other attributes as needed
      return realImg;
    }
    return img;
  }

  // Find all cards
  const cards = [];
  // Defensive: Find the swiper wrapper
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;
  const slides = swiperWrapper.querySelectorAll(':scope > .swiper-slide');

  slides.forEach((slide) => {
    // Each slide contains an anchor with an article
    const link = slide.querySelector('a');
    if (!link) return;
    const article = link.querySelector('article');
    if (!article) return;
    // Find image
    const img = article.querySelector('img');
    const imageEl = img ? getRealImage(img) : null;
    // Find heading
    const heading = article.querySelector('h3');
    // Find description
    const desc = article.querySelector('p');
    // Find button (for CTA)
    const button = article.querySelector('button');
    // Compose text cell
    const textCell = document.createElement('div');
    if (heading) {
      const h = document.createElement('h3');
      h.textContent = heading.textContent;
      textCell.appendChild(h);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      textCell.appendChild(p);
    }
    if (button) {
      // Wrap button text in a link to the card href
      const ctaLink = document.createElement('a');
      ctaLink.href = link.href;
      ctaLink.textContent = button.textContent;
      ctaLink.className = 'cta';
      textCell.appendChild(ctaLink);
    }
    // Add row: [image, textCell]
    cards.push([
      imageEl,
      textCell
    ]);
  });

  // Build table
  const headerRow = ['Cards (cards31)'];
  const tableCells = [headerRow, ...cards];
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(blockTable);
}
