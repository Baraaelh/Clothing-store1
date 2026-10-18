/**
 * متجر الأناقة - EL-ANAQA STORE
 * Storefront Interactive Controller (Cart, Catalog, Wishlist, WhatsApp Checkout)
 */

// ============================================
// 1. الكتالوج الأولي الفاخر ومطابقة الصورة المرفقة
// ============================================
const DEFAULT_CATALOG = [
    {
        id: 'CAT-101',
        name: 'طقم سويت شيرت وبنطال شتوي نبيذي مبطن',
        category: 'رجالي',
        subCategory: 'أطقم شتوية',
        price: 135,
        oldPrice: 175,
        badge: 'الأكثر مبيعاً 🔥',
        badgeType: 'sale',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80',
        colors: [
            { name: 'نبيذي / أحمر', hex: '#881337' },
            { name: 'أسود ملكي', hex: '#0f172a' },
            { name: 'رمادي داكن', hex: '#475569' }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        desc: 'طقم شتوي فاخر مكون من سويت شيرت هودي بسحاب كامل مع بطانة فليس دافئة فائقة النعومة، وبنطال رياضي بقصة مريحة مع جيوب عملية وحزام خصر مطاطي.'
    },
    {
        id: 'CAT-102',
        name: 'طقم رياضي سحاب كامل رمادي أنيق',
        category: 'رجالي',
        subCategory: 'أطقم رياضية',
        price: 125,
        oldPrice: 155,
        badge: 'وصل حديثاً',
        badgeType: 'new',
        image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80',
        colors: [
            { name: 'رمادي فاتح', hex: '#94a3b8' },
            { name: 'كحلي', hex: '#1e3a8a' },
            { name: 'أسود', hex: '#0f172a' }
        ],
        sizes: ['M', 'L', 'XL', 'XXL'],
        desc: 'طقم رياضي عصري بلون رمادي مريح مع ياقة عالية وسحاب متين، نسيج مرن يسمح بمرور الهواء ومثالي للإطلالات اليومية والنشاطات الرياضية.'
    },
    {
        id: 'CAT-103',
        name: 'طقم شتوي رياضي أسود فاخر مع تفاصيل جلدية',
        category: 'رجالي',
        subCategory: 'أطقم شتوية',
        price: 145,
        oldPrice: 190,
        badge: 'خصم 25%',
        badgeType: 'sale',
        image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=900&q=80',
        colors: [
            { name: 'أسود ملكي', hex: '#000000' },
            { name: 'زيتي', hex: '#365314' }
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        desc: 'طقم متكامل بتصميم رجالي فخم وقماش مقاوم للتوبير ومقاوم للرياح، مبطن بطبقة خفيفة من القطن الفاخر لتوفير أقصى درجات الدفء والأناقة.'
    },
    {
        id: 'CAT-104',
        name: 'جاكيت بومبر شتوي مقاوم للمطر والرياح',
        category: 'رجالي',
        subCategory: 'جاكيتات',
        price: 160,
        oldPrice: 210,
        badge: 'شتاء 2026',
        badgeType: 'hot',
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80',
        colors: [
            { name: 'كحلي داكن', hex: '#172554' },
            { name: 'أسود', hex: '#0f172a' },
            { name: 'زيتي عسكري', hex: '#3f6212' }
        ],
        sizes: ['M', 'L', 'XL', 'XXL'],
        desc: 'جاكيت شتوي أنيق بتقنية العزل الحراري وطبقة خارجية طاردة للمياه مع جيوب سحاب داخلية وخارجية وسوار مطاطي مانع لدخول الهواء.'
    },
    {
        id: 'CAT-105',
        name: 'هودي أوفر سايز قطن تركي 100%',
        category: 'رجالي',
        subCategory: 'هوديز',
        price: 85,
        oldPrice: 110,
        badge: 'عرض خاص',
        badgeType: 'sale',
        image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80',
        colors: [
            { name: 'بيج ميلانج', hex: '#d6d3d1' },
            { name: 'أسود', hex: '#18181b' },
            { name: 'زيتي', hex: '#4d7c0f' }
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        desc: 'هودي شبابي بقصة أوفر سايز عصرية منسوج من أجود خيوط القطن الخالص مع جيب كنغر أمامي وغطاء رأس مزدوج الطبقات.'
    },
    {
        id: 'CAT-106',
        name: 'بنطال كارغو عسكري بأربطة وتطريز جانبي',
        category: 'رجالي',
        subCategory: 'بناطيل',
        price: 90,
        oldPrice: 120,
        badge: 'تريند 🔥',
        badgeType: 'hot',
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=80',
        colors: [
            { name: 'رمادي فحمي', hex: '#334155' },
            { name: 'بيج', hex: '#e7e5e4' },
            { name: 'أسود', hex: '#020617' }
        ],
        sizes: ['38', '39', '40', 'S', 'M', 'L', 'XL'],
        desc: 'بنطال كارغو عملي بستة جيوب وسحاب سفلي مع نسيج مقاوم للتمزق، مريح جداً للحركة اليومية والسفر.'
    },
    {
        id: 'CAT-201',
        name: 'معطف ترانش كوت شتوي طويل أنيق',
        category: 'ستاتي',
        subCategory: 'معاطف',
        price: 195,
        oldPrice: 240,
        badge: 'فاخر',
        badgeType: 'new',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=900&q=80',
        colors: [
            { name: 'بيج كلاسيكي', hex: '#d7c4b7' },
            { name: 'أسود', hex: '#0f172a' }
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        desc: 'معطف ستاتي شتوي طويل بقصة كلاسيكية فارهة مع حزام خصر وياقة مزدوجة، يمنحك مظهراً راقياً في المناسبات والخروجات الرسمية.'
    },
    {
        id: 'CAT-202',
        name: 'سويت شيرت وبنطال نسائي مخمل ناعم',
        category: 'ستاتي',
        subCategory: 'أطقم',
        price: 110,
        oldPrice: 145,
        badge: 'الأكثر طلباً',
        badgeType: 'hot',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
        colors: [
            { name: 'وردي ناعم', hex: '#f472b6' },
            { name: 'رمادي', hex: '#94a3b8' }
        ],
        sizes: ['S', 'M', 'L'],
        desc: 'طقم نسائي مريح مصنوع من خامة المخمل الناعمة وفائقة الدفء، مثالي للاسترخاء والأناقة اليومية.'
    },
    {
        id: 'CAT-301',
        name: 'طقم شتوي مبطن للأطفال قطعتين',
        category: 'أطفال',
        subCategory: 'أطقم أطفال',
        price: 65,
        oldPrice: 85,
        badge: 'لطيف ودافئ',
        badgeType: 'sale',
        image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80',
        colors: [
            { name: 'أزرق سماوي', hex: '#38bdf8' },
            { name: 'أصفر', hex: '#facc15' },
            { name: 'رمادي', hex: '#94a3b8' }
        ],
        sizes: ['S', 'M', 'L'],
        desc: 'طقم أطفال قطني آمن على بشرة الطفل ومبطن بطبقة ناعمة من الفرو، مع سحاب سلس وحزام مطاطي ناعم.'
    }
];

// ============================================
// 2. حالة المتجر (State Management)
// ============================================
let currentCategory = 'رجالي'; // القيمة الافتراضية كما في سكرين شوت "قسم الرجالي"
let selectedSizes = new Set();
let selectedColors = new Set();
let sortMode = 'high-to-low'; // الترتيب الافتراضي "السعر من الأعلى إلى الأقل" كالصورة
let searchQuery = '';

let cart = [];
let wishlist = [];

// رقم الواتساب الرسمي للمتجر للطلبات المباشرة
const STORE_WHATSAPP_NUMBER = '970599887766'; // يمكن للمالك تغييره بسهولة

// ============================================
// 3. تهيئة البيانات وقراءة المخزن
// ============================================
function initStore() {
    // قراءة السلة والمفضلة من التخزين المحلي
    try {
        const savedCart = localStorage.getItem('storefront_cart_v1');
        if (savedCart) cart = JSON.parse(savedCart);

        const savedWishlist = localStorage.getItem('storefront_wishlist_v1');
        if (savedWishlist) wishlist = JSON.parse(savedWishlist);
    } catch (e) {
        console.error('Error loading local state:', e);
    }

    updateCartBadge();
    updateWishlistBadge();
    renderProducts();

    // إغلاق الفلاتر عند الضغط خارجها
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.filter-btn-group')) {
            document.querySelectorAll('.filter-popover').forEach(p => p.classList.remove('open'));
        }
    });

    // مراقبة شريط الهيدر وإضافة ظل عند النزول
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.site-header');
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 20);
        }
    });
}

// دمج المنتجات الحقيقية المسجلة بنظام الإدارة (إذا وجدت) مع الكتالوج
function getAllStoreProducts() {
    let combined = [...DEFAULT_CATALOG];
    try {
        const raw = localStorage.getItem('store_products_v6');
        if (raw) {
            const adminProducts = JSON.parse(raw);
            if (Array.isArray(adminProducts) && adminProducts.length > 0) {
                adminProducts.forEach(p => {
                    // تجنب التكرار إذا كان المنتج موجوداً بالفعل
                    if (!combined.some(c => c.name === p.name)) {
                        combined.unshift({
                            id: 'ADM-' + p.id,
                            name: p.name,
                            category: p.category || 'عام',
                            subCategory: p.category || 'ملابس',
                            price: Number(p.price || 50),
                            oldPrice: Math.round(Number(p.price || 50) * 1.25),
                            badge: 'متوفر بالمتجر',
                            badgeType: 'new',
                            image: p.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80',
                            colors: p.color ? [{ name: p.color, hex: '#475569' }] : [{ name: 'أسود', hex: '#0f172a' }],
                            sizes: p.size ? [p.size] : ['M', 'L', 'XL'],
                            desc: `منتج عالي الجودة متوفر لدى متجر الأناقة. كود المنتج: ${p.code || '#' + p.id}`
                        });
                    }
                });
            }
        }
    } catch (e) {}
    return combined;
}

// ============================================
// 4. تصفية وفرز وعرض المنتجات
// ============================================
function setCategory(cat, el) {
    currentCategory = cat;

    // تحديث التحديد على روابط القائمة
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    if (el) el.classList.add('active');

    // تحديث عنوان الصفحة
    const titleEl = document.getElementById('categoryMainTitle');
    if (titleEl) {
        titleEl.textContent = cat === 'الكل' ? 'كافة التشكيلات' : `قسم ${cat}`;
    }

    const breadcrumbEl = document.getElementById('breadcrumbCategory');
    if (breadcrumbEl) {
        breadcrumbEl.textContent = cat === 'الكل' ? 'كافة المنتجات' : `قسم ${cat}`;
    }

    // إغلاق قائمة الموبايل إن كانت مفتوحة
    toggleMobileMenu(false);

    renderProducts();
}

function toggleSizeFilter(size, el) {
    if (selectedSizes.has(size)) {
        selectedSizes.delete(size);
        el.classList.remove('selected');
    } else {
        selectedSizes.add(size);
        el.classList.add('selected');
    }
    updateFilterButtonLabels();
    renderProducts();
}

function toggleColorFilter(color, el) {
    if (selectedColors.has(color)) {
        selectedColors.delete(color);
        el.classList.remove('selected');
    } else {
        selectedColors.add(color);
        el.classList.add('selected');
    }
    updateFilterButtonLabels();
    renderProducts();
}

function updateFilterButtonLabels() {
    const sizeBtn = document.getElementById('sizeFilterBtnText');
    if (sizeBtn) {
        sizeBtn.textContent = selectedSizes.size > 0 ? `المقاسات (${selectedSizes.size})` : 'المقاسات';
    }
    const colorBtn = document.getElementById('colorFilterBtnText');
    if (colorBtn) {
        colorBtn.textContent = selectedColors.size > 0 ? `اللون (${selectedColors.size})` : 'اللون';
    }
}

function toggleFilterPopover(id) {
    const pop = document.getElementById(id);
    if (!pop) return;
    const isOpen = pop.classList.contains('open');
    document.querySelectorAll('.filter-popover').forEach(p => p.classList.remove('open'));
    if (!isOpen) pop.classList.add('open');
}

function handleSortChange(val) {
    sortMode = val;
    renderProducts();
}

function handleSearchInput(val) {
    searchQuery = val.trim().toLowerCase();
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const counter = document.getElementById('productsCountDisplay');
    if (!grid) return;

    const all = getAllStoreProducts();

    // 1. فلترة حسب القسم
    let filtered = all.filter(p => {
        if (currentCategory && currentCategory !== 'الكل') {
            return p.category === currentCategory;
        }
        return true;
    });

    // 2. فلترة حسب المقاس
    if (selectedSizes.size > 0) {
        filtered = filtered.filter(p => p.sizes.some(s => selectedSizes.has(s)));
    }

    // 3. فلترة حسب اللون
    if (selectedColors.size > 0) {
        filtered = filtered.filter(p => p.colors.some(c => selectedColors.has(c.name)));
    }

    // 4. فلترة حسب البحث
    if (searchQuery) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchQuery) ||
            p.desc.toLowerCase().includes(searchQuery) ||
            (p.subCategory && p.subCategory.toLowerCase().includes(searchQuery))
        );
    }

    // 5. الفرز والترتيب
    if (sortMode === 'high-to-low') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortMode === 'low-to-high') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortMode === 'newest') {
        filtered.sort((a, b) => (b.badge === 'وصل حديثاً' ? 1 : 0) - (a.badge === 'وصل حديثاً' ? 1 : 0));
    }

    // تحديث العداد
    if (counter) {
        counter.textContent = `عرض 1-${filtered.length} من أصل ${filtered.length} نتيجة`;
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-catalog-state">
                <i class="fas fa-search"></i>
                <h3>لم نجد أي منتجات تطابق اختياراتك</h3>
                <p style="color:#64748b;margin-bottom:14px;">جرب إزالة بعض الفلاتر أو تغيير التصنيف المعروض</p>
                <button type="button" class="btn-pill" onclick="resetFilters()" style="padding:8px 20px;background:#0f172a;color:#fff;border:none;border-radius:20px;font-family:inherit;font-weight:700;cursor:pointer;">
                    إعادة ضبط الفلاتر
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(p => {
        const isWish = wishlist.includes(p.id);
        const badgeHtml = p.badge ? `<span class="product-tag-badge badge-${p.badgeType || 'sale'}">${p.badge}</span>` : '';

        const dotsHtml = p.colors.map(c => `
            <span class="variant-dot-mini" style="background-color:${c.hex};" title="${c.name}"></span>
        `).join('');

        const sizesText = p.sizes.join(' · ');

        return `
            <div class="product-card-luxury">
                <div class="product-image-box" onclick="openQuickView('${p.id}')">
                    ${badgeHtml}
                    <button type="button" class="btn-wishlist-float ${isWish ? 'active' : ''}" 
                            onclick="event.stopPropagation(); toggleWishlist('${p.id}')" 
                            title="${isWish ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}">
                        <i class="${isWish ? 'fas fa-heart' : 'far fa-heart'}"></i>
                    </button>
                    <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
                </div>

                <div class="product-details">
                    <div class="product-category-label">${p.subCategory || p.category}</div>
                    <h3 class="product-title" onclick="openQuickView('${p.id}')">${p.name}</h3>

                    <div class="product-pricing">
                        <span class="price-current">₪${p.price.toFixed(2)}</span>
                        ${p.oldPrice ? `<span class="price-old">₪${p.oldPrice.toFixed(2)}</span>` : ''}
                    </div>

                    <div class="product-variants-preview">
                        <div class="variant-dots-row">${dotsHtml}</div>
                        <div class="sizes-badge-text">${sizesText}</div>
                    </div>

                    <div class="product-actions-row">
                        <button type="button" class="btn-add-cart-primary" onclick="quickAddToCart('${p.id}')">
                            <i class="fas fa-shopping-bag"></i> أضف للسلة
                        </button>
                        <button type="button" class="btn-whatsapp-direct" onclick="orderSingleViaWhatsApp('${p.id}')" title="طلب مباشر وسريع عبر واتساب">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function resetFilters() {
    selectedSizes.clear();
    selectedColors.clear();
    searchQuery = '';
    const sInput = document.getElementById('storeSearchInput');
    if (sInput) sInput.value = '';
    document.querySelectorAll('.chip-option, .color-chip-option').forEach(el => el.classList.remove('selected'));
    updateFilterButtonLabels();
    renderProducts();
}

// ============================================
// 5. إدارة السلة (Shopping Cart)
// ============================================
function quickAddToCart(productId) {
    const all = getAllStoreProducts();
    const prod = all.find(p => p.id === productId);
    if (!prod) return;

    // إضافة أول مقاس ولون افتراضي
    const size = prod.sizes[0] || 'M';
    const color = prod.colors[0]?.name || 'افتراضي';

    addToCart(prod, size, color, 1);
}

function addToCart(product, size, color, qty) {
    const existingIndex = cart.findIndex(i => i.product_id === product.id && i.size === size && i.color === color);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += qty;
    } else {
        cart.push({
            id: 'ITEM-' + Date.now() + Math.random().toString(36).substr(2, 4),
            product_id: product.id,
            name: product.name,
            price: product.price,
            size: size,
            color: color,
            quantity: qty,
            image: product.image
        });
    }

    saveCart();
    updateCartBadge();
    showToastNotification(`🛒 تمت إضافة (${product.name}) إلى السلة!`);
    openCartDrawer();
}

function updateCartQty(index, change) {
    if (!cart[index]) return;
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartBadge();
    renderCartDrawerItems();
}

function removeCartItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartBadge();
    renderCartDrawerItems();
}

function saveCart() {
    try {
        localStorage.setItem('storefront_cart_v1', JSON.stringify(cart));
    } catch (e) {}
}

function updateCartBadge() {
    const totalCount = cart.reduce((s, i) => s + i.quantity, 0);
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(b => {
        b.textContent = totalCount;
        b.style.display = totalCount > 0 ? 'flex' : 'none';
    });
}

function openCartDrawer() {
    const drawer = document.getElementById('cartDrawerOverlay');
    if (!drawer) return;
    renderCartDrawerItems();
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
    const drawer = document.getElementById('cartDrawerOverlay');
    if (!drawer) return;
    drawer.classList.remove('open');
    document.body.style.overflow = '';
}

function renderCartDrawerItems() {
    const container = document.getElementById('cartDrawerItems');
    const totalEl = document.getElementById('cartDrawerTotal');
    const subtotalEl = document.getElementById('cartDrawerSubtotal');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:50px 20px;color:#94a3b8;">
                <i class="fas fa-shopping-basket" style="font-size:3.5rem;margin-bottom:14px;color:#cbd5e1;"></i>
                <h4 style="color:#0f172a;font-weight:800;margin-bottom:6px;">سلة المشتريات فارغة</h4>
                <p style="font-size:0.85rem;">تصفح الكتالوج وأضف ما يعجبك لإتمام الطلب بسهولة</p>
            </div>
        `;
        if (totalEl) totalEl.textContent = '₪0.00';
        if (subtotalEl) subtotalEl.textContent = '₪0.00';
        return;
    }

    const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);

    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item-drawer">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-meta">
                    <span>مقاس: <strong>${item.size}</strong></span> | 
                    <span>لون: <strong>${item.color}</strong></span>
                </div>
                <div class="cart-qty-stepper">
                    <button type="button" onclick="updateCartQty(${index}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" onclick="updateCartQty(${index}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-price-col">
                <span class="cart-item-total">₪${(item.price * item.quantity).toFixed(2)}</span>
                <button type="button" class="cart-item-remove-btn" onclick="removeCartItem(${index})" title="حذف">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `).join('');

    if (totalEl) totalEl.textContent = `₪${subtotal.toFixed(2)}`;
    if (subtotalEl) subtotalEl.textContent = `₪${subtotal.toFixed(2)}`;
}

// ============================================
// 6. قائمة المفضلة (Wishlist)
// ============================================
function toggleWishlist(productId) {
    const idx = wishlist.indexOf(productId);
    if (idx > -1) {
        wishlist.splice(idx, 1);
        showToastNotification('تمت إزالة المنتج من المفضلة');
    } else {
        wishlist.push(productId);
        showToastNotification('❤️ تمت إضافة المنتج إلى المفضلة!');
    }
    try {
        localStorage.setItem('storefront_wishlist_v1', JSON.stringify(wishlist));
    } catch (e) {}

    updateWishlistBadge();
    renderProducts();
}

function updateWishlistBadge() {
    const badges = document.querySelectorAll('.wishlist-count-badge');
    badges.forEach(b => {
        b.textContent = wishlist.length;
        b.style.display = wishlist.length > 0 ? 'flex' : 'none';
    });
}

function openWishlistModal() {
    const modal = document.getElementById('wishlistModal');
    const body = document.getElementById('wishlistModalBody');
    if (!modal || !body) return;

    const all = getAllStoreProducts();
    const wishItems = all.filter(p => wishlist.includes(p.id));

    if (wishItems.length === 0) {
        body.innerHTML = `
            <div style="text-align:center;padding:40px;color:#94a3b8;">
                <i class="far fa-heart" style="font-size:3rem;margin-bottom:12px;color:#cbd5e1;"></i>
                <h4>قائمة المفضلة فارغة حالياً</h4>
                <p style="font-size:0.85rem;">اضغط على علامة القلب على أي منتج لحفظه هنا والرجوع إليه لاحقاً</p>
            </div>
        `;
    } else {
        body.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:12px;">
                ${wishItems.map(p => `
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px;border:1px solid #e2e8f0;border-radius:10px;gap:12px;">
                        <img src="${p.image}" style="width:60px;height:70px;object-fit:cover;border-radius:8px;">
                        <div style="flex-grow:1;">
                            <h4 style="font-size:0.92rem;margin-bottom:3px;">${p.name}</h4>
                            <strong style="color:#0f172a;">₪${p.price.toFixed(2)}</strong>
                        </div>
                        <div style="display:flex;gap:6px;">
                            <button type="button" class="btn-add-cart-primary" onclick="quickAddToCart('${p.id}'); closeModal('wishlistModal');" style="padding:6px 12px;font-size:0.8rem;">
                                للسلة
                            </button>
                            <button type="button" onclick="toggleWishlist('${p.id}'); openWishlistModal();" style="border:none;background:none;color:#ef4444;cursor:pointer;padding:6px;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    modal.classList.add('open');
}

// ============================================
// 7. المعاينة السريعة للمنتج (Quick View Modal)
// ============================================
let activeQuickViewProduct = null;
let qvSelectedSize = null;
let qvSelectedColor = null;

function openQuickView(productId) {
    const all = getAllStoreProducts();
    const prod = all.find(p => p.id === productId);
    if (!prod) return;

    activeQuickViewProduct = prod;
    qvSelectedSize = prod.sizes[0] || 'M';
    qvSelectedColor = prod.colors[0]?.name || 'افتراضي';

    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');
    if (!modal || !content) return;

    content.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1.2fr;gap:24px;">
            <div style="border-radius:12px;overflow:hidden;background:#f1f5f9;height:380px;">
                <img src="${prod.image}" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div style="display:flex;flex-direction:column;">
                <span style="font-size:0.8rem;color:#be185d;font-weight:800;text-transform:uppercase;">${prod.subCategory || prod.category}</span>
                <h2 style="font-size:1.35rem;font-weight:900;color:#0f172a;margin:6px 0 10px;">${prod.name}</h2>
                
                <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:14px;">
                    <span style="font-size:1.6rem;font-weight:900;color:#0f172a;">₪${prod.price.toFixed(2)}</span>
                    ${prod.oldPrice ? `<span style="font-size:1.05rem;color:#94a3b8;text-decoration:line-through;">₪${prod.oldPrice.toFixed(2)}</span>` : ''}
                    <span style="background:#f0fdf4;color:#16a34a;padding:2px 8px;border-radius:4px;font-size:0.75rem;font-weight:800;">متوفر فوري</span>
                </div>

                <p style="font-size:0.85rem;color:#475569;line-height:1.6;margin-bottom:16px;">
                    ${prod.desc}
                </p>

                <!-- اختيار المقاس -->
                <div style="margin-bottom:14px;">
                    <label style="display:block;font-size:0.8rem;font-weight:800;color:#1e293b;margin-bottom:6px;">المقاس المطلوب:</label>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;">
                        ${prod.sizes.map((s, idx) => `
                            <button type="button" class="chip-option ${idx === 0 ? 'selected' : ''}" onclick="selectQuickViewSize('${s}', this)">
                                ${s}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- اختيار اللون -->
                <div style="margin-bottom:20px;">
                    <label style="display:block;font-size:0.8rem;font-weight:800;color:#1e293b;margin-bottom:6px;">اللون المطلوب:</label>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        ${prod.colors.map((c, idx) => `
                            <button type="button" class="color-chip-option ${idx === 0 ? 'selected' : ''}" onclick="selectQuickViewColor('${c.name}', this)">
                                <span class="color-dot" style="background:${c.hex};"></span> ${c.name}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- كمية وزر الإضافة -->
                <div style="display:flex;gap:10px;margin-top:auto;">
                    <button type="button" class="btn-add-cart-primary" onclick="confirmQuickViewAddToCart()" style="flex:1;padding:12px;font-size:0.95rem;">
                        <i class="fas fa-shopping-bag"></i> إضافة إلى السلة
                    </button>
                    <button type="button" class="btn-whatsapp-direct" onclick="orderSingleViaWhatsApp('${prod.id}')" title="طلب مباشر عبر واتساب">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('open');
}

function selectQuickViewSize(size, el) {
    qvSelectedSize = size;
    el.parentElement.querySelectorAll('.chip-option').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
}

function selectQuickViewColor(color, el) {
    qvSelectedColor = color;
    el.parentElement.querySelectorAll('.color-chip-option').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
}

function confirmQuickViewAddToCart() {
    if (!activeQuickViewProduct) return;
    addToCart(activeQuickViewProduct, qvSelectedSize, qvSelectedColor, 1);
    closeModal('quickViewModal');
}

// ============================================
// 8. إتمام الطلب والربط مع نظام إدارة المتجر والواتساب
// ============================================
function openCheckoutModal() {
    if (cart.length === 0) {
        showToastNotification('السلة فارغة، أضف بعض المنتجات أولاً');
        return;
    }
    closeCartDrawer();
    const modal = document.getElementById('checkoutModal');
    if (!modal) return;

    const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const summaryList = document.getElementById('checkoutOrderSummaryList');
    const totalEl = document.getElementById('checkoutTotalAmount');

    if (summaryList) {
        summaryList.innerHTML = cart.map(i => `
            <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:0.84rem;color:#475569;">
                <span>${i.name} (مقاس ${i.size} | ${i.color}) ×${i.quantity}</span>
                <strong>₪${(i.price * i.quantity).toFixed(2)}</strong>
            </div>
        `).join('');
    }

    if (totalEl) totalEl.textContent = `₪${subtotal.toFixed(2)}`;

    modal.classList.add('open');
}

function submitOnlineOrder(e) {
    if (e) e.preventDefault();

    const name = document.getElementById('custOrderName')?.value.trim();
    const phone = document.getElementById('custOrderPhone')?.value.trim();
    const city = document.getElementById('custOrderCity')?.value.trim();
    const address = document.getElementById('custOrderAddress')?.value.trim();
    const paymentMethod = document.getElementById('custOrderPaymentMethod')?.value || 'cod';
    const notes = document.getElementById('custOrderNotes')?.value.trim() || '';

    if (!name || name.length < 2) {
        showToastNotification('يرجى إدخال اسمك الكريم بشكل صحيح');
        return;
    }
    if (!phone || phone.length < 7) {
        showToastNotification('يرجى إدخال رقم الهاتف أو الواتساب للتواصل');
        return;
    }
    if (!city || !address) {
        showToastNotification('يرجى تحديد المدينة وعنوان التوصيل');
        return;
    }

    const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const orderId = 'WEB-' + Math.floor(Math.random() * 90000 + 10000);
    const orderItemsSummary = cart.map(i => `${i.name} (${i.size}) ×${i.quantity}`).join('، ');

    const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        customer: name,
        phone: phone,
        city: city,
        address: address,
        notes: notes,
        payment_method: paymentMethod,
        productName: orderItemsSummary,
        items: [...cart],
        quantity: cart.reduce((s, i) => s + i.quantity, 0),
        total: subtotal,
        status: 'pending' // Pending approval in store manager system
    };

    // حفظ الطلب في التخزين المحلي ليدخل فوراً لنظام إدارة المتجر (طلبات الموقع)
    try {
        let existingOrders = JSON.parse(localStorage.getItem('store_online_orders_v6')) || [];
        existingOrders.unshift(newOrder);
        localStorage.setItem('store_online_orders_v6', JSON.stringify(existingOrders));
    } catch (err) {
        console.error('Error saving order to system:', err);
    }

    // تفريغ السلة
    cart = [];
    saveCart();
    updateCartBadge();
    closeModal('checkoutModal');

    // إظهار نافذة تأكيد نجاح الطلب
    openOrderSuccessModal(newOrder);
}

function openOrderSuccessModal(order) {
    const modal = document.getElementById('orderSuccessModal');
    const msg = document.getElementById('orderSuccessDetails');
    if (!modal || !msg) return;

    msg.innerHTML = `
        <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:12px;padding:16px;margin:16px 0;text-align:right;">
            <div style="color:#166534;font-size:0.95rem;font-weight:800;margin-bottom:8px;">
                رقم الطلب: <span style="font-family:monospace;font-size:1.1rem;">#${order.id}</span>
            </div>
            <div style="font-size:0.85rem;color:#334155;line-height:1.7;">
                العميل: <strong>${order.customer}</strong> (${order.phone})<br>
                العنوان: <strong>${order.city} - ${order.address}</strong><br>
                الإجمالي: <strong style="color:#0f172a;font-size:1rem;">₪${order.total.toFixed(2)}</strong> (شامل التوصيل)
            </div>
        </div>
        <p style="font-size:0.85rem;color:#64748b;margin-bottom:18px;">
            تم إرسال طلبك بنجاح إلى فريق المتجر وجارٍ تحضيره. يمكنك تأكيد طلبك فوراً والتواصل المباشر مع خدمة الزبائن عبر واتساب:
        </p>
        <button type="button" class="btn-whatsapp-drawer" onclick="sendOrderReceiptToWhatsApp('${order.id}')" style="padding:13px;font-size:0.98rem;">
            <i class="fab fa-whatsapp" style="font-size:1.25rem;"></i> متابعة وتأكيد الطلب عبر واتساب
        </button>
    `;

    modal.classList.add('open');
}

function sendOrderReceiptToWhatsApp(orderId) {
    let order = null;
    try {
        const list = JSON.parse(localStorage.getItem('store_online_orders_v6')) || [];
        order = list.find(o => o.id === orderId);
    } catch(e) {}

    if (!order) {
        showToastNotification('تعذر استرجاع تفاصيل الطلب');
        return;
    }

    const itemsText = (order.items || []).map((i, idx) => `  ${idx + 1}. ${i.name} (مقاس: ${i.size} - لون: ${i.color}) ×${i.quantity} = ₪${(i.price * i.quantity).toFixed(2)}`).join('\n');

    const msg = `مرحباً متجر الأناقة 🛍️\nأرغب بتأكيد طلبي الجديد من الموقع:\n\n*رقم الطلب:* #${order.id}\n*اسم العميل:* ${order.customer}\n*رقم الهاتف:* ${order.phone}\n*المدينة والعنوان:* ${order.city} - ${order.address}\n\n*تفاصيل المنتجات:*\n${itemsText || order.productName}\n\n*المجموع الإجمالي:* ₪${order.total.toFixed(2)}\n*طريقة الدفع:* ${order.payment_method === 'cod' ? 'الدفع عند الاستلام' : 'تحويل إلكتروني'}\n${order.notes ? `*ملاحظات:* ${order.notes}\n` : ''}\nيرجى تأكيد التجهيز وموعد التوصيل، شكراً لكم!`;

    const url = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

function orderSingleViaWhatsApp(productId) {
    const all = getAllStoreProducts();
    const prod = all.find(p => p.id === productId);
    if (!prod) return;

    const msg = `مرحباً متجر الأناقة 🛍️\nأنا مهتم بهذا المنتج من موقعكم وأود الاستفسار والطلب:\n\n*المنتج:* ${prod.name}\n*السعر:* ₪${prod.price.toFixed(2)}\n*القسم:* ${prod.category} (${prod.subCategory || ''})\n\nهل المقاسات والألوان متوفرة حالياً للتوصيل؟`;
    const url = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

// ============================================
// 9. النوافذ والقوائم العامة وتنبيهات التوست
// ============================================
function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
    document.body.style.overflow = '';
}

function toggleMobileMenu(force) {
    const drawer = document.getElementById('mobileNavDrawer');
    if (!drawer) return;
    const shouldOpen = typeof force === 'boolean' ? force : !drawer.classList.contains('open');
    drawer.classList.toggle('open', shouldOpen);
}

function showToastNotification(text) {
    const toast = document.getElementById('storeToast');
    if (!toast) return;
    toast.textContent = text;
    toast.style.display = 'block';
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, 2800);
}

// بدء تشغيل المتجر عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initStore);
