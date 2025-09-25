/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image URL from style attribute
  function extractImageUrl(style) {
    if (!style) return null;
    const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
    return match ? match[1] : null;
  }

  // Find the swiper-wrapper (contains slides)
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (!swiperWrapper) return;

  // Get all slides
  const slides = Array.from(swiperWrapper.children).filter((child) => child.classList.contains('swiper-slide'));

  // Build table rows
  const headerRow = ['Carousel (carousel27)'];
  const tableRows = [headerRow];

  slides.forEach((slide) => {
    // Each slide has an <a class="applications-item"> as the main content
    const link = slide.querySelector('a.applications-item');
    if (!link) return;

    // Get <article> for image background
    const article = link.querySelector('article');
    const imgUrl = extractImageUrl(article && article.getAttribute('style'));
    let imgAlt = article && article.getAttribute('data-item-alt');
    if (!imgAlt || imgAlt === 'null') imgAlt = '';

    // Create image element
    let imgEl = null;
    if (imgUrl) {
      imgEl = document.createElement('img');
      imgEl.src = imgUrl;
      if (imgAlt) imgEl.alt = imgAlt;
      else imgEl.alt = '';
    }

    // Get title (h3)
    const h3 = link.querySelector('h3');
    let textCell = null;
    if (h3) {
      // Use <h2> for heading
      const heading = document.createElement('h2');
      heading.textContent = h3.textContent;
      textCell = heading;
    }

    // Compose row: [image, text]
    tableRows.push([
      imgEl || '',
      textCell || '',
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
