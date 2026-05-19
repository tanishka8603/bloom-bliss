/* ─── Bloom & Bliss — script.js ─── */

// 1. Navbar scroll + active link
(function () {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        });
    }
    const links = document.querySelectorAll('nav a, .mobile-menu a');
    links.forEach(a => {
        if (a.href === location.href ||
            a.getAttribute('href') === location.pathname.split('/').pop()) {
            a.classList.add('active');
        }
    });
})();

// 2. Hamburger mobile menu
(function () {
    const btn  = document.querySelector('.hamburger');
    const menu = document.querySelector('.mobile-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
        btn.classList.toggle('open');
        menu.classList.toggle('open');
    });
    document.addEventListener('click', e => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
            btn.classList.remove('open');
            menu.classList.remove('open');
        }
    });
})();

// 3. Scroll fade-in
(function () {
    const els = document.querySelectorAll('.fade-in');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('visible'));
        return;
    }
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
})();

// 4. Floating petals (hero only)
(function () {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const colors = ['#f9a8d4','#fda4af','#fcd34d','#f472b6','#fb7185'];
    for (let i = 0; i < 14; i++) {
        const p = document.createElement('div');
        p.className = 'petal';
        Object.assign(p.style, {
            left:             Math.random() * 100 + 'vw',
            top:              '-20px',
            background:       colors[Math.floor(Math.random() * colors.length)],
            width:            (8 + Math.random() * 10) + 'px',
            height:           (8 + Math.random() * 10) + 'px',
            animationDelay:   (Math.random() * 8) + 's',
            animationDuration:(6 + Math.random() * 6) + 's',
        });
        hero.appendChild(p);
    }
})();

// ── 5. CART SYSTEM ────────────────────────────────────
const Cart = (function () {
    let items = [];

    function buildDrawer() {
        if (document.getElementById('cart-drawer')) return;

        const overlay = document.createElement('div');
        overlay.id = 'cart-overlay';
        overlay.addEventListener('click', closeCart);

        const drawer = document.createElement('div');
        drawer.id = 'cart-drawer';
        drawer.innerHTML =
            '<div class="cart-header">' +
                '<h2>&#128Shopping Cart</h2>' +
                '<button id="cart-close">&#10005;</button>' +
            '</div>' +
            '<div class="cart-body" id="cart-body">' +
                '<p class="cart-empty">Your cart is empty &#127800;</p>' +
            '</div>' +
            '<div class="cart-footer" id="cart-footer" style="display:none">' +
                '<div class="cart-total">Total: <span id="cart-total-amount">&#8377;0</span></div>' +
                '<button class="cart-checkout-btn">Proceed to Checkout &#10132;</button>' +
            '</div>';

        document.body.appendChild(overlay);
        document.body.appendChild(drawer);

        document.getElementById('cart-close').addEventListener('click', closeCart);
        drawer.querySelector('.cart-checkout-btn').addEventListener('click', function () {
            alert('Thank you for your order!\nWe will contact you shortly.');
            items = [];
            render();
            closeCart();
        });
    }

    function openCart()  {
        buildDrawer();
        document.getElementById('cart-overlay').classList.add('active');
        document.getElementById('cart-drawer').classList.add('active');
    }

    function closeCart() {
        var o = document.getElementById('cart-overlay');
        var d = document.getElementById('cart-drawer');
        if (o) o.classList.remove('active');
        if (d) d.classList.remove('active');
    }

    function render() {
        buildDrawer();
        var body   = document.getElementById('cart-body');
        var footer = document.getElementById('cart-footer');
        var badge  = document.querySelector('.cart-count');

        if (items.length === 0) {
            body.innerHTML = '<p class="cart-empty">Your cart is empty &#127800;</p>';
            footer.style.display = 'none';
            if (badge) { badge.textContent = '0'; badge.classList.remove('visible'); }
            return;
        }

        var totalQty   = items.reduce(function(s,i){ return s + i.qty; }, 0);
        var totalPrice = items.reduce(function(s,i){ return s + i.price * i.qty; }, 0);

        if (badge) {
            badge.textContent = totalQty;
            badge.classList.add('visible');
        }

        document.getElementById('cart-total-amount').textContent =
            '\u20B9' + totalPrice.toLocaleString('en-IN');

        footer.style.display = 'block';

        var html = '';
        items.forEach(function(item, idx) {
            html +=
                '<div class="cart-item">' +
                    '<div class="cart-item-name">' + item.name + '</div>' +
                    '<div class="cart-item-row">' +
                        '<div class="cart-qty-controls">' +
                            '<button class="qty-btn" data-idx="' + idx + '" data-action="dec">&minus;</button>' +
                            '<span class="qty-num">' + item.qty + '</span>' +
                            '<button class="qty-btn" data-idx="' + idx + '" data-action="inc">+</button>' +
                        '</div>' +
                        '<span class="cart-item-price">\u20B9' + (item.price * item.qty).toLocaleString('en-IN') + '</span>' +
                        '<button class="cart-remove" data-idx="' + idx + '">\uD83D\uDDD1</button>' +
                    '</div>' +
                '</div>';
        });
        body.innerHTML = html;

        body.querySelectorAll('.qty-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var idx    = parseInt(btn.dataset.idx);
                var action = btn.dataset.action;
                if (action === 'inc') items[idx].qty++;
                if (action === 'dec') {
                    items[idx].qty--;
                    if (items[idx].qty <= 0) items.splice(idx, 1);
                }
                render();
            });
        });

        body.querySelectorAll('.cart-remove').forEach(function(btn) {
            btn.addEventListener('click', function() {
                items.splice(parseInt(btn.dataset.idx), 1);
                render();
            });
        });
    }

    function showToast(name) {
        var toast = document.querySelector('.cart-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'cart-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = '\uD83D\uDED2 "' + name + '" added to cart!';
        toast.classList.add('show');
        clearTimeout(toast._t);
        toast._t = setTimeout(function(){ toast.classList.remove('show'); }, 2500);
    }

    return {
        add: function(name, price) {
            var existing = null;
            for (var i = 0; i < items.length; i++) {
                if (items[i].name === name) { existing = items[i]; break; }
            }
            if (existing) {
                existing.qty++;
            } else {
                items.push({ name: name, price: price, qty: 1 });
            }
            render();
            showToast(name);
        },
        open:  openCart,
        close: closeCart
    };
})();

// Cart icon click — open drawer
document.addEventListener('click', function(e) {
    if (e.target.closest('.cart-icon')) {
        Cart.open();
    }
});

// "Add to Cart" buttons
document.addEventListener('click', function(e) {
    var btn = e.target.closest('.btn-add');
    if (!btn) return;
    var card  = btn.closest('.card');
    var name  = card && card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : 'Item';
    var priceText = card && card.querySelector('.price') ? card.querySelector('.price').textContent : '0';
    var price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;

    Cart.add(name, price);
    btn.textContent = '\u2713 Added';
    btn.style.background = '#16a34a';
    setTimeout(function() {
        btn.textContent = 'Add to Cart';
        btn.style.background = '';
    }, 1800);
});

// Wishlist toggle
document.addEventListener('click', function(e) {
    var btn = e.target.closest('.btn-wish');
    if (!btn) return;
    btn.classList.toggle('active');
    btn.textContent = btn.classList.contains('active') ? '\u2665' : '\u2661';
});

// 6. Contact form
(function () {
    var form = document.querySelector('.contact-form-modern');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var valid = true;
        form.querySelectorAll('input[required], textarea[required]').forEach(function(el) {
            el.style.borderColor = '';
            if (!el.value.trim()) { el.style.borderColor = '#f43f5e'; valid = false; }
        });
        var email = form.querySelector('input[type="email"]');
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            email.style.borderColor = '#f43f5e'; valid = false;
        }
        if (!valid) return;
        var submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Sending\u2026';
        submitBtn.disabled = true;
        setTimeout(function() {
            form.innerHTML = '<div style="text-align:center;padding:40px;color:#16a34a;font-size:1.1rem;font-weight:600"><div style="font-size:2.5rem;margin-bottom:12px">\uD83C\uDF38</div>Thank you! We\'ll get back to you shortly.</div>';
        }, 1200);
    });
})();

// 7. Product search
(function () {
    var bar = document.querySelector('#product-search');
    if (!bar) return;
    bar.addEventListener('input', function() {
        var q = bar.value.toLowerCase();
        document.querySelectorAll('.card').forEach(function(card) {
            var name = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
            card.style.display = name.includes(q) ? '' : 'none';
        });
    });
})();

// 8. Product sort
(function () {
    var sel = document.querySelector('#product-sort');
    if (!sel) return;
    sel.addEventListener('change', function() {
        var grid = document.querySelector('.products-grid');
        if (!grid) return;
        var cards = Array.from(grid.querySelectorAll('.card'));
        cards.sort(function(a, b) {
            var pa = parseInt((a.querySelector('.price') ? a.querySelector('.price').textContent : '0').replace(/[^\d]/g,'')) || 0;
            var pb = parseInt((b.querySelector('.price') ? b.querySelector('.price').textContent : '0').replace(/[^\d]/g,'')) || 0;
            return sel.value === 'asc' ? pa - pb : pb - pa;
        });
        cards.forEach(function(c){ grid.appendChild(c); });
    });
})();