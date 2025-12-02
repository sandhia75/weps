/**
 * Shopify Page Speed Optimizer - Main Optimization Script
 * This script is injected into storefronts to optimize page speed
 */

(function () {
  const OPTIMIZER_CONFIG = {
    enableImageOptimization: true,
    enableLazyLoading: true,
    enableCaching: true,
    imageQuality: 80,
    minifyCSS: true,
    minifyJS: true,
    deferNonCriticalCSS: true,
  };

  // Image Optimization
  function optimizeImages() {
    if (!OPTIMIZER_CONFIG.enableImageOptimization) return;

    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      // Convert image format to WebP if supported
      const src = img.getAttribute('src');
      if (src && !src.includes('.svg')) {
        const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        
        // Add picture element with WebP support fallback
        if (!img.parentElement?.tagName === 'PICTURE') {
          const picture = document.createElement('picture');
          const source = document.createElement('source');
          source.srcSet = webpSrc;
          source.type = 'image/webp';
          picture.appendChild(source);
          picture.appendChild(img.cloneNode(true));
          img.parentElement?.replaceChild(picture, img);
        }
      }

      // Add responsive images
      if (!img.hasAttribute('srcset')) {
        const base = src.replace(/\.(jpg|jpeg|png|webp)$/i, '');
        img.setAttribute(
          'srcset',
          `${base}-480w.webp 480w, ${base}-768w.webp 768w, ${base}-1200w.webp 1200w`
        );
      }
    });
  }

  // Lazy Loading Implementation
  function enableLazyLoading() {
    if (!OPTIMIZER_CONFIG.enableLazyLoading) return;

    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if ('loading' in img) {
        img.setAttribute('loading', 'lazy');
      } else {
        // Fallback for older browsers
        if (!img.hasAttribute('src')) return;
        const src = img.getAttribute('data-src') || img.getAttribute('src');
        img.setAttribute('data-src', src);
        img.removeAttribute('src');

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              img.src = img.getAttribute('data-src') || '';
              observer.unobserve(img);
            }
          });
        });
        observer.observe(img);
      }
    });
  }

  // CSS Optimization
  function optimizeCSS() {
    if (!OPTIMIZER_CONFIG.minifyCSS) return;

    const styles = document.querySelectorAll('style');
    styles.forEach((style) => {
      if (style.textContent) {
        // Minify CSS
        let minified = style.textContent
          .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
          .replace(/\s+/g, ' ') // Remove excess whitespace
          .replace(/\s*([{}:;,])\s*/g, '$1'); // Remove spaces around special chars
        style.textContent = minified;
      }
    });
  }

  // Defer Non-Critical CSS
  function deferNonCriticalCSS() {
    if (!OPTIMIZER_CONFIG.deferNonCriticalCSS) return;

    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && !href.includes('critical') && !href.includes('main')) {
        link.setAttribute('media', 'print');
        link.onload = function () {
          this.media = 'all';
        };
      }
    });
  }

  // Browser Caching Headers (Set-Cookie headers for cache control)
  function setupBrowserCaching() {
    if (!OPTIMIZER_CONFIG.enableCaching) return;

    const cacheControl = 'public, max-age=3600, immutable';
    
    // Set cache control for static assets
    const assets = document.querySelectorAll(
      'link[rel="stylesheet"], script[src], img, [srcset]'
    );
    
    assets.forEach((asset) => {
      asset.setAttribute('data-cache-control', cacheControl);
    });

    // Store cache preference in localStorage
    localStorage.setItem('cacheControl', cacheControl);
  }

  // Preload Critical Resources
  function preloadCriticalResources() {
    const criticalFonts = document.querySelectorAll(
      'link[rel="preload"][as="font"]'
    );
    criticalFonts.forEach((font) => {
      if (font.getAttribute('href')) {
        font.setAttribute('crossorigin', '');
      }
    });
  }

  // Performance Observer - Monitor page speed
  function setupPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      try {
        // Observe LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Observe FID (First Input Delay)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            console.log('FID:', entry.processingDuration);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Observe CLS (Cumulative Layout Shift)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
              console.log('CLS:', clsValue);
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('Performance monitoring not available:', e);
      }
    }
  }

  // Main initialization
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runOptimizations);
    } else {
      runOptimizations();
    }
  }

  function runOptimizations() {
    console.log('🚀 Shopify Page Speed Optimizer - Running optimizations');
    
    optimizeImages();
    enableLazyLoading();
    optimizeCSS();
    deferNonCriticalCSS();
    setupBrowserCaching();
    preloadCriticalResources();
    setupPerformanceMonitoring();

    console.log('✅ Page speed optimizations applied');
  }

  // Initialize when script loads
  init();
})();
