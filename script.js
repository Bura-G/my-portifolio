// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Update active navigation on scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Contact form submission handler
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = this;
    const formData = new FormData(form);
    const messageDiv = document.getElementById('formMessage');
    
    // Show loading state
    messageDiv.style.display = 'block';
    messageDiv.className = 'form-message';
    messageDiv.textContent = 'Sending message...';
    
    // Submit form via fetch
    fetch('back.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messageDiv.className = 'form-message success';
            messageDiv.textContent = data.message || 'Thank you! Your message has been sent successfully.';
            form.reset();
        } else {
            messageDiv.className = 'form-message error';
            messageDiv.textContent = data.message || 'Sorry, there was an error sending your message. Please try again.';
        }
    })
    .catch(error => {
        messageDiv.className = 'form-message error';
        messageDiv.textContent = 'Sorry, there was an error sending your message. Please try again.';
        console.error('Error:', error);
    });
});

// Add scroll animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .project-card, .about-content, .contact-content');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Section fade-in observer
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const sectionTitle = entry.target.querySelector('.section-title');
                if (sectionTitle) {
                    setTimeout(() => {
                        sectionTitle.classList.add('visible');
                    }, 200);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });

    // Project case study toggle buttons
    document.querySelectorAll('.project-toggle').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.project-card');
            const targetId = this.getAttribute('aria-controls');
            const target = document.getElementById(targetId);

            if (!card || !target) return;

            const expanded = card.classList.toggle('expanded');
            this.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            this.textContent = expanded ? 'Hide Case Study' : 'Read Case Study';

            // If expanding, scroll card into view a bit for mobile
            if (expanded) {
                setTimeout(() => {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 200);
            }
        });
    });

    // PhotoSwipe lightbox initialization for project images
    (function() {
        const pswpElement = document.querySelectorAll('.pswp')[0];

        // Collect items from .project-lightbox anchors
        const links = Array.from(document.querySelectorAll('.project-lightbox'));
        if (!links.length || !pswpElement || typeof PhotoSwipe === 'undefined') return;

        const items = links.map(link => {
            const img = link.querySelector('img');
            const src = link.getAttribute('href') || (img && img.getAttribute('src'));
            const w = (img && img.naturalWidth) || img.width || 1600;
            const h = (img && img.naturalHeight) || img.height || 900;
            return { src, w, h, title: img && img.alt };
        });

        links.forEach((link, index) => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                // Recompute natural sizes in case images just loaded
                items.forEach((item, i) => {
                    const img = links[i].querySelector('img');
                    if (img && img.naturalWidth && img.naturalHeight) {
                        item.w = img.naturalWidth;
                        item.h = img.naturalHeight;
                    }
                });

                const options = {
                    index: index,
                    bgOpacity: 0.85,
                    showHideOpacity: true,
                    history: false,
                };

                const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
                gallery.init();
            });
        });
    })();

    /* Advanced Inspector (OpenSeadragon) */
    (function() {
        const inspectorModal = document.getElementById('inspector-modal');
        const inspectorBackdrop = document.querySelector('.inspector-backdrop');
        const viewerElement = document.getElementById('openseadragon-viewer');
        const navContainer = document.getElementById('inspector-nav');
        const slider = document.getElementById('inspector-zoom-slider');
        const input = document.getElementById('inspector-zoom-input');
        const btnIn = document.getElementById('inspector-zoom-in');
        const btnOut = document.getElementById('inspector-zoom-out');
        const btnReset = document.getElementById('inspector-reset');
        const btnToggleNav = document.getElementById('inspector-toggle-nav');
        const btnClose = document.getElementById('inspector-close');

        if (!inspectorModal || typeof OpenSeadragon === 'undefined') return;

        let viewer = null;
        let currentImage = null;
        let lastPointer = null; // viewport point to center zoom on

        // Helper: open inspector with given image URL and optional hi-res
        function openInspector(imageUrl, highResUrl) {
            inspectorModal.setAttribute('aria-hidden', 'false');
            inspectorModal.style.display = 'flex';

            // Initialize viewer if not exists
            if (!viewer) {
                viewer = OpenSeadragon({
                    element: viewerElement,
                    prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.0.0/images/',
                    showNavigator: false,
                    navigatorPosition: 'TOP_RIGHT',
                    gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: false },
                    maxZoomPixelRatio: 10, // allow high resolution zoom
                    visibilityRatio: 0.4,
                    constrainDuringPan: true,
                    animationTime: 0.35,
                    springStiffness: 6.0,
                });

                // Register pointer move to capture zoom origin
                viewer.addHandler('canvas-enter', function() { viewerElement.style.cursor = 'zoom-in'; });
                viewer.addHandler('canvas-exit', function() { viewerElement.style.cursor = 'default'; });
                viewer.addHandler('canvas-drag', function() { viewerElement.style.cursor = 'grabbing'; });

                // Track last pointer for zoom origin
                viewer.addHandler('canvas-click', function(event) {
                    lastPointer = viewer.viewport.pointFromPixel(event.position, true);
                });
                viewer.addHandler('canvas-drag', function(event) {
                    lastPointer = viewer.viewport.pointFromPixel(event.position, true);
                });

                // Update slider when viewport zoom changes
                viewer.addHandler('zoom', function() {
                    updateSliderFromViewer();
                });
            }

            currentImage = highResUrl || imageUrl;
            viewer.open({ type: 'image', url: currentImage });

            // Give viewer a moment to set home bounds
            setTimeout(() => {
                setZoomTo(100); // default 100% relative zoom
                updateSliderFromViewer();
            }, 300);
        }

        function closeInspector() {
            inspectorModal.setAttribute('aria-hidden', 'true');
            inspectorModal.style.display = 'none';
            if (viewer) viewer.close();
        }

        // Map zoom percentage to viewer.viewport zoom scale using homeZoom as baseline
        function setZoomTo(percent) {
            if (!viewer) return;
            const vp = viewer.viewport;
            const homeZoom = vp.getHomeZoom();
            const targetZoom = homeZoom * (percent / 100);
            const center = lastPointer || vp.getCenter();
            vp.zoomTo(targetZoom, center, true);
        }

        function getCurrentPercent() {
            if (!viewer) return 100;
            const vp = viewer.viewport;
            const homeZoom = vp.getHomeZoom();
            return Math.round((vp.getZoom() / homeZoom) * 100);
        }

        function updateSliderFromViewer() {
            const p = getCurrentPercent();
            slider.value = Math.min(Math.max(p, parseInt(slider.min)), parseInt(slider.max));
            input.value = slider.value;
            // show navigator when beyond 200%
            if (p > 200) {
                navContainer.classList.add('active');
                viewer.setShowNavigator(true);
            } else {
                navContainer.classList.remove('active');
                viewer.setShowNavigator(false);
            }
        }

        // Toolbar bindings
        btnIn.addEventListener('click', () => { sliderStep(10); });
        btnOut.addEventListener('click', () => { sliderStep(-10); });
        btnReset.addEventListener('click', () => { setZoomTo(100); updateSliderFromViewer(); });
        btnToggleNav.addEventListener('click', () => { navContainer.classList.toggle('active'); const shown = navContainer.classList.contains('active'); if (viewer) viewer.setShowNavigator(shown); });
        btnClose.addEventListener('click', closeInspector);
        inspectorBackdrop.addEventListener('click', closeInspector);

        function sliderStep(delta) {
            const v = parseInt(slider.value) + delta;
            const clamped = Math.min(Math.max(v, parseInt(slider.min)), parseInt(slider.max));
            slider.value = clamped; input.value = clamped; setZoomTo(clamped);
        }

        slider.addEventListener('input', () => {
            const val = parseInt(slider.value);
            input.value = val;
            setZoomTo(val);
        });

        input.addEventListener('change', () => {
            let val = parseInt(input.value) || 100;
            val = Math.min(Math.max(val, parseInt(slider.min)), parseInt(slider.max));
            slider.value = val;
            setZoomTo(val);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (inspectorModal.getAttribute('aria-hidden') === 'false') {
                if (e.key === '+') { e.preventDefault(); sliderStep(10); }
                if (e.key === '-') { e.preventDefault(); sliderStep(-10); }
                if (e.key === '0') { e.preventDefault(); btnReset.click(); }
                if (e.key === 'Escape') { e.preventDefault(); closeInspector(); }
                if (e.key === 'ArrowUp') { e.preventDefault(); viewer.viewport.panBy(new OpenSeadragon.Point(0, -0.05)); }
                if (e.key === 'ArrowDown') { e.preventDefault(); viewer.viewport.panBy(new OpenSeadragon.Point(0, 0.05)); }
                if (e.key === 'ArrowLeft') { e.preventDefault(); viewer.viewport.panBy(new OpenSeadragon.Point(-0.05, 0)); }
                if (e.key === 'ArrowRight') { e.preventDefault(); viewer.viewport.panBy(new OpenSeadragon.Point(0.05, 0)); }
            }
        });

        // Double-click to reset zoom
        document.addEventListener('dblclick', function(e) {
            if (inspectorModal.getAttribute('aria-hidden') === 'false') { btnReset.click(); }
        });

        // Hook into project image 'Inspect' activation: make image open inspector on long-press / Alt+click / right-click
        // We'll add a small Inspect button overlay on project images dynamically
        document.querySelectorAll('.project-image').forEach(container => {
            const inspectBtn = document.createElement('button');
            inspectBtn.className = 'inspect-btn tool-btn';
            inspectBtn.textContent = 'Inspect';
            inspectBtn.title = 'Open detailed inspector';
            inspectBtn.style.position = 'absolute';
            inspectBtn.style.right = '12px';
            inspectBtn.style.bottom = '12px';
            inspectBtn.style.zIndex = '5';
            inspectBtn.style.opacity = '0.95';
            container.style.position = 'relative';
            container.appendChild(inspectBtn);

            inspectBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const img = container.querySelector('img');
                if (!img) return;
                const src = img.getAttribute('src');
                const high = img.getAttribute('data-hires') || src;
                lastPointer = null;
                openInspector(src, high);
            });
        });

        // Help hint dismissal stored in localStorage
        const hint = document.getElementById('inspector-hint');
        if (hint && !localStorage.getItem('inspectorHintDismissed')) {
            const dismiss = document.createElement('button');
            dismiss.className = 'tool-btn';
            dismiss.textContent = 'Dismiss';
            dismiss.style.marginLeft = '12px';
            dismiss.addEventListener('click', () => { hint.style.display = 'none'; localStorage.setItem('inspectorHintDismissed','1'); });
            hint.appendChild(dismiss);
        } else if (hint) hint.style.display = 'none';
    })();
    
    // Hero section is immediately visible
    const heroSection = document.querySelector('#home');
    if (heroSection) {
        heroSection.classList.add('visible');
        const heroTitle = heroSection.querySelector('.section-title');
        if (heroTitle) {
            heroTitle.classList.add('visible');
        }
    }
});

// Portfolio Filtering System
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter portfolio items
            portfolioItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    // Show item with animation
                    setTimeout(() => {
                        item.classList.remove('hidden', 'fade-out');
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    }, index * 50);
                } else {
                    // Hide item with animation
                    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
    
    // Tag click filtering
    document.querySelectorAll('.tag[data-tag]').forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.stopPropagation();
            const tagValue = this.getAttribute('data-tag');
            
            // Find and click the corresponding filter button
            filterButtons.forEach(btn => {
                if (btn.getAttribute('data-filter') === tagValue) {
                    btn.click();
                }
            });
            
            // Smooth scroll to portfolio section
            const portfolioSection = document.querySelector('#portfolio');
            if (portfolioSection) {
                const headerOffset = 70;
                const elementPosition = portfolioSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Email copy functionality
    const emailLink = document.querySelector('.contact-link[data-copy]');
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.getAttribute('data-copy');
            
            // Copy to clipboard
            navigator.clipboard.writeText(email).then(() => {
                // Show feedback
                this.classList.add('copied');
                const tooltip = this.querySelector('.copy-tooltip');
                if (tooltip) {
                    tooltip.textContent = 'Copied!';
                    tooltip.style.background = '#10B981';
                }
                
                // Reset after 2 seconds
                setTimeout(() => {
                    this.classList.remove('copied');
                    if (tooltip) {
                        tooltip.textContent = 'Click to copy';
                        tooltip.style.background = '';
                    }
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        });
    }
});

/* -----------------------------
   Portfolio: organized projects + modal
   ----------------------------- */
document.addEventListener('DOMContentLoaded', function() {
    const projectsData = {
        topazion: {
            title: 'Modern Brand Identity for a Contemporary Barber Shop',
            category: 'Brand Identity',
            client: 'Topaziyov Barber Shop (Addis Ababa)',
            goal: 'Create a clean, modern, and memorable visual identity for a new barber shop, "Topaziyov," to establish a strong local presence, signal premium quality, and attract a discerning clientele.',
            solution: 'I developed a sophisticated brand identity centered on bold typography and a structured layout. The design uses a crisp, high-contrast color scheme and geometric elements to convey precision and style, while clearly presenting essential contact information for easy customer access.',
            skill: ['Brand Identity', 'Logo Concepts', 'Business Card Design', 'Print Collateral', 'Typography', 'Layout Design', 'Adobe Illustrator', 'Adobe Photoshop'],
            result: 'Delivered a cohesive brand system and production-ready assets that positioned the shop as a premium local choice for discerning clients.',
            images: ['topazion.jpg']
        },
        agency: {
            title: 'Travel Advertising Poster for Ethiopian Tourism Agency',
            category: 'Marketing',
            client: 'ABI Tour & Travel (Ethiopian tour operator)',
            goal: 'Create a compelling promotional poster for a travel agency to market domestic tour packages and attract new customers.',
            solution: 'I designed a visually striking poster that immediately evokes the wonder of travel. Using a high-quality background image of Lalibela\'s iconic rock-hewn churches, I established an emotional connection. The clean, centered layout with bold typography clearly presents the brand, package destinations (Lalibela, Axum, Gondar), and contact information, making it easy for potential travelers to get the information they need.',
            skill: ['Graphic Design', 'Poster Design', 'Layout & Composition', 'Adobe Photoshop', 'Travel Industry Marketing', 'Print Design'],
            images: ['tour&travel.jpg']
        },
        yene: {
            title: 'Advertising Materials for Yene Stickers Store',
            category: 'Print & Merchandise',
            client: 'YeneStickers.store (local sticker shop)',
            goal: 'Design marketing materials to clearly communicate services, pricing, and personalization options.',
            solution: 'Built a vibrant, flexible visual system using playful typography and iconography for print and social formats.',
            skill: ['Store Advertisement Design', 'Service Icons', 'Social Media Post Templates', 'Contact Layouts'],
            result: 'Delivered versatile marketing assets that helped attract customers seeking personalized stickers.',
            images: ['ynen.jpg.jpg']
        }
        ,
        'food-banner': {
            title: 'Grocery & Food Service Banners',
            category: 'Marketing',
            client: 'Local Grocery & Food Service',
            goal: 'Create high-impact banners for in-store promotions and events.',
            solution: 'Designed bold, appetite-focused banners with clear headlines and strong imagery to attract customers.',
            skill: ['Large-Format Banner', 'Event Variant', 'Print-ready Files'],
            result: 'Assets ready for printing and use in seasonal campaigns.',
            images: ['food banner.jpg']
        },
        'food-poster': {
            title: 'Food & Grocery Promotional Poster',
            category: 'Marketing',
            client: 'Local Food Promotions',
            goal: 'Deliver an eye-catching poster to promote special offers and events.',
            solution: 'Combined photography and clear typographic hierarchy to make offers instantly readable from distance.',
            skill: ['Poster Design', 'Social Adaptations', 'Print-ready Files'],
            result: 'Increased visibility at point-of-sale and social campaign use.',
            images: ['food poster.jpg']
        },
        /* 'jim' project removed per user request */
        mahi: {
            title: 'MAHI Passport / ID Materials',
            category: 'Print & Merchandise',
            client: 'MAHI Passport Services',
            goal: 'Design clear, official-looking signage and print materials for a passport / ID service office.',
            solution: 'Delivered high-visibility banner layouts and identity cues optimized for both print and signage.',
            skill: ['Office Banner', 'Service Posters', 'Signage Guidelines'],
            result: 'Prepared files suitable for immediate production and installation.',
            images: ['mahi.jpg']
        },
        sid: {
            title: 'MC Trades Logo Design',
            category: 'Brand Identity',
            client: 'MC Trades',
            goal: 'Create a strong and trustworthy logo for a trading business that represents professionalism, reliability, and growth.',
            solution: 'I designed a minimalist circular logo using bold typography and a balanced color palette to convey stability and confidence. The “MC” monogram is clean and memorable, making it suitable for both digital platforms and print materials.',
            skill: ['Logo Design', 'Brand Identity', 'Typography', 'Color Theory', 'Visual Branding', 'Adobe Illustrator'],
            result: 'Delivered a concise, versatile monogram that works across digital and print touchpoints.',
            images: ['mc traders logo.jpg']
        },
        nati: {
            title: 'Product Information & Promotional Poster for Local Grocery',
            category: 'Marketing',
            client: 'NATI Grocery Store',
            goal: 'Design an eye-catching yet clear point-of-sale poster for a grocery store to highlight specific product offers, codes, and promotions, helping to drive sales of featured items.',
            solution: 'I created a functional and bold poster with a strong visual hierarchy. The design organizes product codes, names, and key details in a scannable layout using contrasting colors and shapes to make essential information stand out and capture customer attention in-store.',
            skill: ['Print Design', 'Promotional Materials', 'Poster Design', 'Information Hierarchy', 'Layout & Composition', 'Adobe InDesign', 'Adobe Photoshop'],
            result: 'Provided an easy-to-read, promotional poster that improved point-of-sale communication and supported in-store promotions.',
            images: []
        },
        'tech-layout': {
            title: 'Technical Layout & Specification Sheet for Product Packaging',
            category: 'Technical Design',
            client: 'Internal / Manufacturing',
            goal: 'Create a clear, standardized, and technical reference sheet or component layout guide to communicate specific product codes, model identifiers, and measurements for manufacturing or documentation.',
            solution: 'I designed a minimalist and structured layout focused purely on clarity and information hierarchy. The design uses strategic spacing, consistent typography, and a clean visual framework to present alphanumeric codes and technical data without decorative distraction, ensuring error-free reading and implementation.',
            skill: ['Technical Design', 'Information Design', 'Layout & Composition', 'Typography', 'Print-Ready Artwork', 'Adobe InDesign', 'Adobe Illustrator'],
            result: 'Delivered a precise, print-ready specification sheet that reduced ambiguity for production and internal teams.',
            images: []
        }
    };

    const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
    const projectCards = Array.from(document.querySelectorAll('.project-card'));
    const viewBtns = Array.from(document.querySelectorAll('.view-case'));

    const modal = document.getElementById('project-modal');
    const backdrop = document.getElementById('project-backdrop');
    const closeBtn = document.getElementById('project-close');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalClient = document.getElementById('modal-client');
    const modalGoal = document.getElementById('modal-goal');
    const modalSolution = document.getElementById('modal-solution');
    const modalSkill = document.getElementById('modal-skill');
    const modalResult = document.getElementById('modal-result');
    const modalGallery = document.getElementById('modal-gallery');
    const btnPrev = document.getElementById('modal-prev');
    const btnNext = document.getElementById('modal-next');

    let order = projectCards.map(c => c.getAttribute('data-project'));
    let current = -1;
    let lastFocus = null;

    // Filtering
    filterBtns.forEach(btn => {
        btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
            this.classList.add('active'); this.setAttribute('aria-pressed','true');
            const f = this.getAttribute('data-filter');
            projectCards.forEach(card => {
                const cat = card.getAttribute('data-category');
                if (f === 'all' || cat === f) {
                    card.style.display = '';
                    setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 20);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(6px)';
                    setTimeout(() => { card.style.display = 'none'; }, 250);
                }
            });
        });
    });

    // Modal open
    function openProject(key) {
        const d = projectsData[key];
        if (!d) return;
        lastFocus = document.activeElement;
        modalTitle.textContent = d.title;
        modalCategory.textContent = d.category;
        modalClient.textContent = d.client;
        modalGoal.textContent = d.goal;
        modalSolution.textContent = d.solution;
        modalResult.textContent = d.result || '';
        modalSkill.innerHTML = '';
        (d.skill || []).forEach(s => { const li = document.createElement('li'); li.textContent = s; modalSkill.appendChild(li); });
        modalGallery.innerHTML = '';
        d.images.forEach(src => { const img = document.createElement('img'); img.src = src; img.alt = d.title; img.loading = 'lazy'; modalGallery.appendChild(img); });
        modal.setAttribute('aria-hidden','false'); modal.style.display = 'flex';
        current = order.indexOf(key);
        closeBtn.focus();
        trapTab(modal);
    }

    function closeModal() {
        modal.setAttribute('aria-hidden','true'); modal.style.display = 'none'; current = -1;
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    viewBtns.forEach(b => b.addEventListener('click', function(e) { e.stopPropagation(); const k = this.getAttribute('data-project'); openProject(k); }));
    projectCards.forEach(card => card.addEventListener('click', function(e) { if (e.target.tagName.toLowerCase() === 'button') return; const k = this.getAttribute('data-project'); openProject(k); }));

    btnPrev.addEventListener('click', function() { if (current <= 0) current = order.length -1; else current--; openProject(order[current]); });
    btnNext.addEventListener('click', function() { if (current >= order.length -1) current = 0; else current++; openProject(order[current]); });
    closeBtn.addEventListener('click', closeModal); backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e) { if (modal.getAttribute('aria-hidden') === 'false') { if (e.key === 'Escape') closeModal(); if (e.key === 'ArrowLeft') btnPrev.click(); if (e.key === 'ArrowRight') btnNext.click(); } });

    // focus trap - simple
    function trapTab(container) {
        const focusable = Array.from(container.querySelectorAll('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])')).filter(el => el.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length -1];
        function handler(e) {
            if (e.key !== 'Tab') return;
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
        container.addEventListener('keydown', handler);
        const obs = new MutationObserver(() => { if (container.getAttribute('aria-hidden') === 'true') { container.removeEventListener('keydown', handler); obs.disconnect(); } });
        obs.observe(container, { attributes: true });
    }
});

