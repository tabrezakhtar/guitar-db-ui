class ParallaxBackground {
  constructor(options = {}) {
    this.options = {
      containerSelector: options.containerSelector || "body",
      zIndex: options.zIndex || -1,
      gap: options.gap || "12px",
      rowHeight: options.rowHeight || 230,
      imageUrls: options.imageUrls || [
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/27_vorpi1.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/25_ldhbut.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/26_aipzgr.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/20_q0rxi6.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/21_lukucc.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/24_jdloiq.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/19_inpwgm.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/23_tnmsoo.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/18_vvt30d.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/22_ixcbue.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/12_kyauhv.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/17_w2k92s.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/16_qh0op8.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/14_hpmizd.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/3_vlhaod.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/8_bm8ck0.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/15_swdyo5.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/10_o3cmy3.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/13_filfgx.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/2_iak4vf.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/11_zkis74.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/6_kmujsd.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/9_wiupux.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/4_bsbsnk.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/7_uit5dj.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/1_xekvrv.jpg",
        "https://res.cloudinary.com/dx8d5hlk1/image/upload/w_500,c_limit,q_auto:low,f_auto,fl_progressive/v1754915725/5_mwohvw.jpg"
      ],
      ...options
    };

    this.handleResize = this.handleResize.bind(this);
  }

  async init() {
    this.injectCSS();
    this.imageRatios = await this.loadImageRatios();
    this.createCollage();
    window.addEventListener("resize", this.handleResize);
  }

  injectCSS() {
    if (document.getElementById("parallax-bg-styles")) return;

    const style = document.createElement("style");
    style.id = "parallax-bg-styles";
    style.textContent = `
      .parallax-bg-container {
        position: fixed;
        inset: 0;
        z-index: ${this.options.zIndex};
        pointer-events: none;
        overflow: hidden;
        background: transparent;
      }

      .parallax-bg-track {
        position: absolute;
        inset: 0;
      }
      
      .parallax-bg-container img {
        position: absolute;
        height: auto;
        display: block;
        border-radius: 14px;
        opacity: 0;
        transition: opacity 0.8s ease-in-out;
        object-fit: contain;
      }
      
      .parallax-bg-container img.loaded {
        opacity: 1;
      }
    `;
    
    document.head.appendChild(style);
  }

  loadImageRatios() {
    const ratioPromises = this.options.imageUrls.map(imageUrl => {
      return new Promise(resolve => {
        const image = new Image();

        image.onload = () => {
          if (image.naturalWidth && image.naturalHeight) {
            resolve(image.naturalWidth / image.naturalHeight);
            return;
          }

          resolve(1);
        };

        image.onerror = () => {
          resolve(1);
        };

        image.src = imageUrl;
      });
    });

    return Promise.all(ratioPromises);
  }

  createCollage() {
    const existing = document.querySelector(".parallax-bg-container");
    if (existing) {
      existing.remove();
    }

    const container = document.createElement("div");
    container.className = "parallax-bg-container";
    const track = document.createElement("div");
    track.className = "parallax-bg-track";
    container.appendChild(track);

    const gap = parseFloat(this.options.gap) || 0;
    const rowHeight = this.options.rowHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const overscanX = rowHeight;
    const overscanY = rowHeight;
    const maxY = viewportHeight + overscanY;
    const maxX = viewportWidth + overscanX;
    let imageIndex = 0;
    let rowIndex = 0;

    for (let top = -overscanY; top < maxY; top += rowHeight + gap) {
      let left = rowIndex % 2 === 0 ? -overscanX : -(overscanX / 2);

      while (left < maxX) {
        const currentIndex = imageIndex % this.options.imageUrls.length;
        const ratio = this.imageRatios[currentIndex] || 1;
        const width = Math.max(80, Math.round(rowHeight * ratio));
        const img = document.createElement("img");

        img.src = this.options.imageUrls[currentIndex];
        img.alt = `Collage Image ${imageIndex + 1}`;
        img.loading = "lazy";
        img.style.top = `${top}px`;
        img.style.left = `${left}px`;
        img.style.width = `${width}px`;
        img.style.height = `${rowHeight}px`;

        img.addEventListener("load", () => {
          img.classList.add("loaded");
        });

        if (img.complete) {
          img.classList.add("loaded");
        }

        track.appendChild(img);
        left += width + gap;
        imageIndex++;
      }

      rowIndex++;
    }

    const targetContainer = document.querySelector(this.options.containerSelector);
    if (targetContainer === document.body) {
      document.body.insertBefore(container, document.body.firstChild);
    } else {
      targetContainer.appendChild(container);
    }
  }

  handleResize() {
    this.createCollage();
  }

  destroy() {
    const container = document.querySelector(".parallax-bg-container");
    const styles = document.getElementById("parallax-bg-styles");
    
    window.removeEventListener("resize", this.handleResize);

    if (container) container.remove();
    if (styles) styles.remove();
  }

  static init(options) {
    if (window.__parallaxBackgroundInstance) {
      window.__parallaxBackgroundInstance.destroy();
    }

    const instance = new ParallaxBackground(options);
    instance.init();
    window.__parallaxBackgroundInstance = instance;
    return instance;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const script = document.querySelector("script[src*=\"parallax-bg.js\"]");
  if (script && script.hasAttribute("data-auto-init")) {
    const options = {};
    
    if (script.dataset.zIndex) options.zIndex = parseInt(script.dataset.zIndex);
    if (script.dataset.gap) options.gap = script.dataset.gap;
    if (script.dataset.rowHeight) options.rowHeight = parseInt(script.dataset.rowHeight);
    
    ParallaxBackground.init(options);
  }
});

if (typeof module !== "undefined" && module.exports) {
  module.exports = ParallaxBackground;
}

window.ParallaxBackground = ParallaxBackground;