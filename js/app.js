
function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('show');
    const firstInput = modal.querySelector('input:not([type="hidden"]), select');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);
}
window.openModal = openModal;

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('show');
}
window.closeModal = closeModal;

/* ============================================
   نظام إدارة المتجر - طبقة الوظائف
   ============================================ */

/* ============================================
   1. تسجيل الدخول
   ============================================ */
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const user = getUsers().find(u => u.email === email && u.password === password);

    if (!user) {
        showToast('البريد أو كلمة المرور غير صحيحة', 'error');
        return;
    }

    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    startApp();
}

function quickLogin(email) {
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').value = '123456';
    handleLogin(new Event('submit'));
}

function logout() {
    if (!confirm('تسجيل الخروج؟')) return;
    localStorage.removeItem(KEYS.CURRENT_USER);
    location.reload();
}

/* ============================================
   2. تشغيل التطبيق
   ============================================ */
function startApp() {
    const user = getCurrentUser();
    if (!user) return;

    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appScreen').style.display = 'block';

    document.getElementById('userAvatar').textContent = user.name.charAt(0);
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userRole').textContent = {
        owner: 'المالك 👑',
        manager: 'مدير فرع',
        cashier: 'كاشير',
    }[user.role] || user.role;

    buildSidebar();
    showDemoBanner();
    fillAllDropdowns();
    initTopBarAndNotifications();

    loadDashboard();
    loadInventoryTable();
    loadPurchasesManagement();
    loadPosProducts();
    loadSalesHistory();
    loadPurchasesTable();
    loadDebtsTable();
    loadEmployeesTable();
    loadBranchesTable();
    loadMerchantsTable();
    loadExpensesTable();
    loadReports();
    renderOnlineOrders();
    updateOnlineOrdersBadge();

    if (user.role === 'cashier') switchScreen('pos');
}

function showDemoBanner() {
    if (!IS_DEMO) return;
    const banner = document.getElementById('demoBanner');
    if (!banner) return;
    banner.innerHTML = `
        <div class="demo-badge">
            <i class="fas fa-info-circle"></i>
            <span>أنت تستخدم <strong>النسخة الإعلانية التجريبية</strong> - للعرض فقط</span>
            <a onclick="showDemoLimit('ميزة إضافية', '')">اطلب النسخة الحقيقية ←</a>
        </div>
    `;
}

/* ============================================
   3. القائمة الجانبية
   ============================================ */
function buildSidebar() {
    const user = getCurrentUser();
    const isCashier = user.role === 'cashier';

    let nav = '';

    if (!isCashier) {
        nav += `
            <div class="nav-title">الرئيسية</div>
            <div class="nav-item active" onclick="switchScreen('dashboard')">
                <i class="fas fa-chart-pie"></i><span>لوحة التحكم</span>
            </div>
        `;
    }

    nav += `
        <div class="nav-title">العمليات</div>
        <div class="nav-item ${isCashier ? 'active' : ''}" onclick="switchScreen('pos')">
            <i class="fas fa-cash-register"></i><span>الكاشير</span>
        </div>
        <div class="nav-item" onclick="switchScreen('online-orders')">
            <i class="fas fa-globe"></i><span>طلبات الموقع</span>
            <span class="badge danger" id="onlineOrdersBadge" style="margin-right:auto;border-radius:50%;padding:2px 6px;font-size:0.7rem;display:none;">0</span>
        </div>
        <div class="nav-item" onclick="switchScreen('sales-record')">
            <i class="fas fa-history"></i><span>سجل المبيعات</span>
        </div>
    `;

    if (!isCashier) {
        nav += `
            <div class="nav-item" onclick="switchScreen('inventory')">
                <i class="fas fa-dolly-flatbed"></i><span>إدارة المشتريات</span>
            </div>
            <div class="nav-item" onclick="switchScreen('categories')">
                <i class="fas fa-tags"></i><span>التصنيفات والسمات</span>
            </div>

            <div class="nav-title">الإدارة</div>
            <div class="nav-item" onclick="switchScreen('branches')">
                <i class="fas fa-store"></i><span>الفروع</span>
            </div>
            <div class="nav-item" onclick="switchScreen('employees')">
                <i class="fas fa-users"></i><span>الموظفين</span>
            </div>
            <div class="nav-item" onclick="switchScreen('merchants')">
                <i class="fas fa-handshake"></i><span>حسابات التجار</span>
            </div>
            <div class="nav-item" onclick="switchScreen('debts')">
                <i class="fas fa-hand-holding-usd"></i><span>ديون العملاء</span>
            </div>
            <div class="nav-item" onclick="switchScreen('expenses')">
                <i class="fas fa-money-bill-wave"></i><span>المصروفات</span>
            </div>
            <div class="nav-item" onclick="switchScreen('reports')">
                <i class="fas fa-chart-line"></i><span>التقارير</span>
            </div>
        `;
    }

    nav += `
        <div class="nav-title">النظام</div>
        <div class="nav-item" onclick="logout()">
            <i class="fas fa-sign-out-alt"></i><span>تسجيل الخروج</span>
        </div>
    `;

    document.getElementById('sidebarNav').innerHTML = nav;
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
    document.getElementById('sidebarOverlay').classList.toggle('show');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('show');
    document.getElementById('sidebarOverlay').classList.remove('show');
}

/* ============================================
   4. التنقل بين الشاشات
   ============================================ */
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById('screen-' + screenId);
    if (screen) screen.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(n => {
        n.classList.remove('active');
        const onclick = n.getAttribute('onclick') || '';
        if (onclick.includes(`'${screenId}'`)) n.classList.add('active');
    });

    if (screenId === 'dashboard') loadDashboard();
    if (screenId === 'inventory') {
        loadPurchasesManagement();
        loadInventoryTable();
        loadPurchasesTable();
    }
    if (screenId === 'categories') {
        loadCategoriesTable();
        loadColorsTable();
        loadSizesTable();
    }
    if (screenId === 'pos') loadPosProducts();
    if (screenId === 'sales-record') loadSalesHistory();
    if (screenId === 'online-orders') renderOnlineOrders();
    if (screenId === 'purchases') {
        switchScreen('inventory');
        return;
    }
    if (screenId === 'debts') loadDebtsTable();
    if (screenId === 'employees') loadEmployeesTable();
    if (screenId === 'branches') loadBranchesTable();
    if (screenId === 'merchants') loadMerchantsTable();
    if (screenId === 'expenses') loadExpensesTable();
    if (screenId === 'reports') loadReports();

    if (typeof updateNotifications === 'function') updateNotifications();
    if (window.innerWidth < 768) closeSidebar();
    window.scrollTo(0, 0);
}

/* ============================================
   5. تعبئة القوائم المنسدلة
   ============================================ */
function fillAllDropdowns() {
    const catSelect = document.getElementById('p-category');
    if (catSelect) {
        catSelect.innerHTML = '<option value="">-- اختر تصنيف --</option>' +
            getCategories().map(c => `<option value="${c}">${c}</option>`).join('');
    }

    const colorDropdown = document.getElementById('ms-color-dropdown');
    if (colorDropdown) {
        colorDropdown.innerHTML = getColors().map(c => `
            <label class="ms-item">
                <input type="checkbox" name="p-colors" value="${c}" onchange="handleColorSelection()"> ${c}
            </label>
        `).join('');
    }

    const sizeDropdown = document.getElementById('ms-size-dropdown');
    if (sizeDropdown) {
        sizeDropdown.innerHTML = getSizes().map(s => `
            <label class="ms-item">
                <input type="checkbox" name="p-sizes" value="${s}" onchange="updateSizeLabel()"> ${s}
            </label>
        `).join('');
    }

    const restockSelect = document.getElementById('restockProduct');
    if (restockSelect) {
        restockSelect.innerHTML = '<option value="">-- اختر منتج --</option>' +
            getProducts().map(p =>
                `<option value="${p.id}">${p.name} (${p.size || '-'}) - متوفر: ${getProductQuantity(p.id)}</option>`
            ).join('');
    }

    const branchSelect = document.getElementById('emp-branch');
    if (branchSelect) {
        branchSelect.innerHTML = '<option value="">بدون</option>' +
            getBranches().map(b => `<option value="${b.id}">${b.name}</option>`).join('');
    }
}

let colorImages = {};

function updateSizeLabel() {
    const selected = Array.from(document.querySelectorAll('input[name="p-sizes"]:checked')).map(cb => cb.value);
    const label = document.getElementById('ms-size-label');
    if (label) {
        label.textContent = selected.length > 0 ? selected.join('، ') : '-- اختر المقاسات --';
    }
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.multi-select')) {
        document.querySelectorAll('.ms-dropdown').forEach(d => d.classList.remove('show'));
    }
});

function handleColorSelection() {
    const container = document.getElementById('color-images-container');
    if (!container) return;
    
    const checkboxes = document.querySelectorAll('input[name="p-colors"]:checked');
    const selectedColors = Array.from(checkboxes).map(cb => cb.value);
    
    const label = document.getElementById('ms-color-label');
    if (label) {
        label.textContent = selectedColors.length > 0 ? selectedColors.join('، ') : '-- اختر الألوان --';
    }

    Object.keys(colorImages).forEach(c => {
        if (!selectedColors.includes(c)) delete colorImages[c];
    });

    if (selectedColors.length === 0) {
        container.innerHTML = '';
        return;
    }

    let html = '<strong style="color:var(--gray);">صور الألوان المختارة:</strong>';
    selectedColors.forEach(c => {
        const hasImg = colorImages[c] ? 'تم رفع صورة' : 'لا يوجد صورة';
        const colorStyle = colorImages[c] ? 'green' : '#64748b';
        html += `
            <div style="display:flex; align-items:center; gap:10px; background:#f8fafc; padding:10px; border-radius:8px; border:1px solid #e2e8f0;">
                <div style="width:80px; font-weight:bold; color:var(--primary);">${c}</div>
                <input type="file" accept="image/*" class="form-control" style="font-size: 0.9rem; padding: 6px 10px; flex:1;" onchange="handleColorImageUpload(this, '${c}')">
                <span style="font-size:0.8rem; color:${colorStyle}; white-space:nowrap;" id="img-status-${c}">${hasImg}</span>
            </div>
        `;
    });
    container.innerHTML = html;
}

function handleColorImageUpload(input, color) {
    if (input.files && input.files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
            colorImages[color] = e.target.result;
            const status = document.getElementById(`img-status-${color}`);
            if (status) {
                status.textContent = 'تم رفع صورة';
                status.style.color = 'green';
            }
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        delete colorImages[color];
        const status = document.getElementById(`img-status-${color}`);
        if (status) {
            status.textContent = 'لا يوجد صورة';
            status.style.color = '#64748b';
        }
    }
}

/* ============================================
   6. لوحة التحكم
   ============================================ */
function loadDashboard() {
    const todaySales = getTodaySales();
    const netProfit = getNetProfit();
    const revenue = getActualRevenue();
    const receivables = getReceivables();
    const lowStock = getProducts().filter(p => {
        const q = getProductQuantity(p.id);
        return q > 0 && q <= LOW_STOCK;
    }).length;

    document.getElementById('dashboardStats').innerHTML = `
        <div class="stat-card">
            <div class="stat-icon success"><i class="fas fa-dollar-sign"></i></div>
            <div class="stat-label">مبيعات اليوم</div>
            <div class="stat-value">₪${todaySales.toFixed(2)}</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon primary"><i class="fas fa-chart-line"></i></div>
            <div class="stat-label">صافي الربح</div>
            <div class="stat-value" style="color:${netProfit >= 0 ? 'var(--success)' : 'var(--danger)'};">₪${netProfit.toFixed(2)}</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon info"><i class="fas fa-receipt"></i></div>
            <div class="stat-label">إجمالي الإيرادات الفعلية</div>
            <div class="stat-value">₪${revenue.toFixed(2)}</div>
        </div>
        <div class="stat-card">
            <div class="stat-icon danger"><i class="fas fa-hand-holding-usd"></i></div>
            <div class="stat-label">الذمم المدينة</div>
            <div class="stat-value" style="color:var(--danger);">₪${receivables.toFixed(2)}</div>
        </div>
    `;

    const recentSales = getSales().slice().reverse().slice(0, 5);
    const tbody = document.getElementById('recentSalesTable');

    if (recentSales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty">لا توجد مبيعات</td></tr>';
    } else {
        tbody.innerHTML = recentSales.map(s => `
            <tr>
                <td><strong>#${s.id}</strong></td>
                <td>${s.customer}</td>
                <td><strong style="color:var(--success);">₪${Number(s.total).toFixed(2)}</strong></td>
                <td style="font-size:.8rem;">${new Date(s.created_at).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}</td>
            </tr>
        `).join('');
    }

    const out = getOutOfStockProducts();
    const loss = getLossProducts();
    let alertsHTML = '';

    if (out.length === 0 && loss.length === 0) {
        alertsHTML = '<div style="text-align:center;padding:20px;color:var(--gray);"><i class="fas fa-check-circle" style="font-size:2rem;color:var(--success);margin-bottom:10px;display:block;"></i>كل شيء ممتاز! لا توجد تنبيهات</div>';
    } else {
        if (out.length > 0) alertsHTML += `<div style="background:#fff5f5;border:1px solid #fed7d7;padding:12px;border-radius:10px;margin-bottom:10px;"><strong style="color:#dc2626;font-size:.9rem;">⚠️ ${out.length} منتج نفد من المخزون</strong></div>`;
        if (loss.length > 0) alertsHTML += `<div style="background:#fffaf0;border:1px solid #feebc8;padding:12px;border-radius:10px;"><strong style="color:#d97706;font-size:.9rem;">🔻 ${loss.length} منتج بسعر خاسر</strong></div>`;
    }

    document.getElementById('inventoryAlerts').innerHTML = alertsHTML;
}

/* ============================================
   7. المخزون
   ============================================ */
function loadInventoryTable() {
    const tbody = document.getElementById('inventoryTableBody');
    const search = (document.getElementById('inventorySearch')?.value || '').toLowerCase().trim();
    let products = getProducts();

    if (search) {
        products = products.filter(p =>
            p.name.toLowerCase().includes(search) ||
            (p.code || '').toLowerCase().includes(search)
        );
    }

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty">لا توجد منتجات</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(p => {
        const qty = getProductQuantity(p.id);
        const avgCost = getProductAvgCost(p.id);
        const isLow = qty > 0 && qty <= LOW_STOCK;
        const isOut = qty <= 0;
        const stockBadge = isOut ? 'danger' : (isLow ? 'warning' : 'success');
        const isLoss = Number(p.price) <= avgCost;

        const imageHtml = p.image 
            ? `<img src="${p.image}" alt="${p.name}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #eee;">`
            : `<div style="width: 48px; height: 48px; border-radius: 12px; background: #f8fafc; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 18px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); border: 1px solid #e2e8f0;"><i class="fas fa-tshirt"></i></div>`;

        return `
            <tr>
                <td><span class="badge primary">${p.code || '-'}</span></td>
                <td>
                    <div style="display: flex; align-items: center; gap: 14px;">
                        ${imageHtml}
                        <div style="display: flex; flex-direction: column; align-items: start;">
                            <strong style="font-size: 1.05rem; color: #1e293b;">${p.name}</strong>
                            ${isLoss ? '<span class="badge danger" style="margin-top: 4px; font-size: 0.7rem; padding: 2px 6px;">خاسر</span>' : ''}
                        </div>
                    </div>
                </td>
                <td>${p.category}</td>
                <td>${p.size || '-'} ${p.color ? '<span style="color:#64748b; margin:0 4px;">•</span> ' + p.color : ''}</td>
                <td>₪${avgCost.toFixed(2)}</td>
                <td><strong style="color:var(--primary);">₪${Number(p.price).toFixed(2)}</strong></td>
                <td><span class="badge ${stockBadge}">${qty}</span></td>
            </tr>
        `;
    }).join('');
}

/* ============================================
   8. حفظ / تعديل المنتج
   ============================================ */
function saveProduct() {
    const editId = document.getElementById('editingProductId').value;
    const code = document.getElementById('p-code').value.trim();
    const name = document.getElementById('p-name').value.trim();
    const category = document.getElementById('p-category').value;
    const cost = parseFloat(document.getElementById('p-cost').value);
    const price = parseFloat(document.getElementById('p-price').value);
    const qty = parseInt(document.getElementById('p-qty').value) || 0;

    const sizeCheckboxes = document.querySelectorAll('input[name="p-sizes"]:checked');
    const colorCheckboxes = document.querySelectorAll('input[name="p-colors"]:checked');
    
    let sizes = Array.from(sizeCheckboxes).map(cb => cb.value);
    let colors = Array.from(colorCheckboxes).map(cb => cb.value);
    
    if (sizes.length === 0) sizes = [''];
    if (colors.length === 0) colors = [''];

    if (!name || !category || isNaN(cost) || isNaN(price)) {
        showToast('يرجى تعبئة الحقول المطلوبة', 'error');
        return;
    }

    const products = getProducts();
    const purchases = getPurchases();

    if (editId) {
        const id = parseInt(editId);
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            const size = sizes[0] || '';
            const color = colors[0] || '';
            const imgStr = colorImages[color] || products[index].image;
            
            products[index] = {
                ...products[index],
                code: code || products[index].code,
                name, category, size, color,
                base_cost: cost, price
            };
            if (imgStr) products[index].image = imgStr;
        }
        saveProducts(products);
        showToast('تم تحديث المنتج');
    } else {
        if (IS_DEMO && products.length + (sizes.length * colors.length) >= DEMO_LIMITS.products) {
            showDemoLimit('منتج', DEMO_LIMITS.products);
            return;
        }

        let newId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
        let newPurchaseId = purchases.length > 0 ? Math.max(...purchases.map(p => p.id)) : 0;
        const newCode = code || '#' + (100 + newId + 1);

        sizes.forEach(s => {
            colors.forEach(c => {
                newId++;
                const imgStr = colorImages[c] || null;
                
                products.push({ 
                    id: newId, 
                    code: newCode, 
                    name, 
                    category, 
                    size: s, 
                    color: c, 
                    base_cost: cost, 
                    price, 
                    image: imgStr 
                });

                if (qty > 0) {
                    newPurchaseId++;
                    purchases.push({
                        id: newPurchaseId,
                        product_id: newId,
                        product_name: name,
                        size: s,
                        quantity: qty,
                        unit_cost: cost,
                        total_cost: qty * cost,
                        supplier: 'رصيد افتتاحي',
                        note: 'كمية أولية',
                        created_at: new Date().toISOString(),
                    });
                }
            });
        });
        
        saveProducts(products);
        if (qty > 0) savePurchases(purchases);

        showToast('تمت إضافة المنتجات بنجاح');
    }

    cancelProductEdit();
    fillAllDropdowns();
    loadInventoryTable();
    switchScreen('inventory');
}

function editProduct(id) {
    const p = getProductById(id);
    if (!p) return;

    document.getElementById('editingProductId').value = p.id;
    document.getElementById('p-code').value = p.code || '';
    document.getElementById('p-name').value = p.name;
    document.getElementById('p-category').value = p.category;
    document.getElementById('p-cost').value = p.base_cost || 0;
    document.getElementById('p-price').value = p.price;
    document.getElementById('p-qty').value = getProductQuantity(p.id);
    
    document.querySelectorAll('input[name="p-sizes"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="p-colors"]').forEach(cb => cb.checked = false);
    
    if (p.size) {
        const sCb = document.querySelector(`input[name="p-sizes"][value="${p.size}"]`);
        if (sCb) sCb.checked = true;
    }
    if (p.color) {
        const cCb = document.querySelector(`input[name="p-colors"][value="${p.color}"]`);
        if (cCb) cCb.checked = true;
        if (p.image) {
            colorImages[p.color] = p.image;
        }
    }
    
    handleColorSelection();
    updateSizeLabel();

    document.getElementById('productFormTitle').innerHTML = '<i class="fas fa-edit text-warning"></i> تعديل المنتج';
    document.getElementById('cancelEditBtn').style.display = 'inline-flex';
    switchScreen('add-product');
}

function cancelProductEdit() {
    document.getElementById('editingProductId').value = '';
    ['p-code', 'p-name', 'p-category', 'p-cost', 'p-price'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    document.querySelectorAll('input[name="p-sizes"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="p-colors"]').forEach(cb => cb.checked = false);
    
    colorImages = {};
    handleColorSelection();
    updateSizeLabel();

    document.getElementById('p-qty').value = '0';
    document.getElementById('productFormTitle').innerHTML = '<i class="fas fa-plus-circle text-primary"></i> إضافة منتج جديد';
    document.getElementById('cancelEditBtn').style.display = 'none';
}

/* ============================================
   9. التصنيفات
   ============================================ */
function loadCategoriesTable() {
    const tbody = document.getElementById('categoriesTableBody');
    const categories = getCategories();
    const products = getProducts();

    if (categories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="empty">لا توجد تصنيفات</td></tr>';
        return;
    }

    tbody.innerHTML = categories.map(cat => {
        const count = products.filter(p => p.category === cat).length;
        return `
            <tr>
                <td><strong>${cat}</strong></td>
                <td><span class="badge primary">${count} منتج</span></td>
                <td>
                    <button class="btn-icon" onclick="editCategory('${cat}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon danger" onclick="deleteCategory('${cat}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function saveCategory() {
    const input = document.getElementById('newCategoryInput');
    const name = input.value.trim();
    const editId = document.getElementById('editingCategoryId').value;

    if (!name) {
        showToast('أدخل اسم التصنيف', 'error');
        return;
    }

    const categories = getCategories();

    if (editId) {
        const index = categories.indexOf(editId);
        if (index !== -1) categories[index] = name;

        const products = getProducts();
        products.forEach(p => {
            if (p.category === editId) p.category = name;
        });
        saveProducts(products);

        document.getElementById('editingCategoryId').value = '';
        showToast('تم تحديث التصنيف');
    } else {
        if (IS_DEMO && categories.length >= DEMO_LIMITS.categories) {
            showDemoLimit('تصنيف', DEMO_LIMITS.categories);
            return;
        }
        if (categories.includes(name)) {
            showToast('التصنيف موجود مسبقاً', 'error');
            return;
        }
        categories.push(name);
        showToast('تمت إضافة التصنيف');
    }

    saveCategories(categories);
    input.value = '';
    fillAllDropdowns();
    loadCategoriesTable();
}

function editCategory(name) {
    document.getElementById('newCategoryInput').value = name;
    document.getElementById('editingCategoryId').value = name;
    document.getElementById('newCategoryInput').focus();
}

function deleteCategory(name) {
    const products = getProducts().filter(p => p.category === name);

    if (products.length > 0) {
        if (!confirm(`يوجد ${products.length} منتج في هذا التصنيف. سيتم حذف التصنيف فقط. متابعة؟`)) return;
    } else {
        if (!confirm('حذف هذا التصنيف؟')) return;
    }

    saveCategories(getCategories().filter(c => c !== name));
    fillAllDropdowns();
    loadCategoriesTable();
    showToast('تم حذف التصنيف');
}

/* --- ألوان --- */
function loadColorsTable() {
    const tbody = document.getElementById('colorsTableBody');
    const colors = getColors();
    const products = getProducts();

    if (colors.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="empty">لا توجد ألوان</td></tr>';
        return;
    }

    tbody.innerHTML = colors.map(col => {
        const count = products.filter(p => p.color === col).length;
        return `
            <tr>
                <td><strong>${col}</strong></td>
                <td><span class="badge primary">${count} منتج</span></td>
                <td>
                    <button class="btn-icon" onclick="editColor('${col}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon danger" onclick="deleteColor('${col}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function saveColor() {
    const input = document.getElementById('newColorInput');
    const name = input.value.trim();
    const editId = document.getElementById('editingColorId').value;

    if (!name) {
        showToast('أدخل اسم اللون', 'error');
        return;
    }

    const colors = getColors();

    if (editId) {
        const index = colors.indexOf(editId);
        if (index !== -1) colors[index] = name;

        const products = getProducts();
        products.forEach(p => {
            if (p.color === editId) p.color = name;
        });
        saveProducts(products);

        document.getElementById('editingColorId').value = '';
        showToast('تم تحديث اللون');
    } else {
        if (colors.includes(name)) {
            showToast('اللون موجود مسبقاً', 'error');
            return;
        }
        colors.push(name);
        showToast('تمت إضافة اللون');
    }

    saveColors(colors);
    input.value = '';
    fillAllDropdowns();
    loadColorsTable();
}

function editColor(name) {
    document.getElementById('newColorInput').value = name;
    document.getElementById('editingColorId').value = name;
    document.getElementById('newColorInput').focus();
}

function deleteColor(name) {
    const products = getProducts().filter(p => p.color === name);

    if (products.length > 0) {
        if (!confirm(`يوجد ${products.length} منتج بهذا اللون. سيتم حذف اللون فقط. متابعة؟`)) return;
    } else {
        if (!confirm('حذف هذا اللون؟')) return;
    }

    saveColors(getColors().filter(c => c !== name));
    fillAllDropdowns();
    loadColorsTable();
    showToast('تم حذف اللون');
}

/* --- مقاسات --- */
function loadSizesTable() {
    const tbody = document.getElementById('sizesTableBody');
    const sizes = getSizes();
    const products = getProducts();

    if (sizes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="empty">لا توجد مقاسات</td></tr>';
        return;
    }

    tbody.innerHTML = sizes.map(sz => {
        const count = products.filter(p => p.size === sz).length;
        return `
            <tr>
                <td><strong>${sz}</strong></td>
                <td><span class="badge primary">${count} منتج</span></td>
                <td>
                    <button class="btn-icon" onclick="editSize('${sz}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon danger" onclick="deleteSize('${sz}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

function saveSize() {
    const input = document.getElementById('newSizeInput');
    const name = input.value.trim();
    const editId = document.getElementById('editingSizeId').value;

    if (!name) {
        showToast('أدخل اسم المقاس', 'error');
        return;
    }

    const sizes = getSizes();

    if (editId) {
        const index = sizes.indexOf(editId);
        if (index !== -1) sizes[index] = name;

        const products = getProducts();
        products.forEach(p => {
            if (p.size === editId) p.size = name;
        });
        saveProducts(products);

        document.getElementById('editingSizeId').value = '';
        showToast('تم تحديث المقاس');
    } else {
        if (sizes.includes(name)) {
            showToast('المقاس موجود مسبقاً', 'error');
            return;
        }
        sizes.push(name);
        showToast('تمت إضافة المقاس');
    }

    saveSizes(sizes);
    input.value = '';
    fillAllDropdowns();
    loadSizesTable();
}

function editSize(name) {
    document.getElementById('newSizeInput').value = name;
    document.getElementById('editingSizeId').value = name;
    document.getElementById('newSizeInput').focus();
}

function deleteSize(name) {
    const products = getProducts().filter(p => p.size === name);

    if (products.length > 0) {
        if (!confirm(`يوجد ${products.length} منتج بهذا المقاس. سيتم حذف المقاس فقط. متابعة؟`)) return;
    } else {
        if (!confirm('حذف هذا المقاس؟')) return;
    }

    saveSizes(getSizes().filter(c => c !== name));
    fillAllDropdowns();
    loadSizesTable();
    showToast('تم حذف المقاس');
}

/* ============================================
   10. نقطة البيع (POS)
   ============================================ */
let cart = [];
let selectedPaymentMethod = 'cash';
let paymentScreenshotData = null;

function loadPosProducts(filter = '') {
    const grid = document.getElementById('posProductsGrid');
    let products = getProducts();

    if (filter) {
        const q = filter.toLowerCase();
        products = products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            (p.code || '').toLowerCase().includes(q)
        );
    }

    if (products.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:30px;color:var(--gray);">لا توجد منتجات</div>';
        return;
    }

    grid.innerHTML = products.map(p => {
        const qty = getProductQuantity(p.id);
        const isOut = qty <= 0;

        return `
            <div class="product-card ${isOut ? 'disabled' : ''}" onclick="${isOut ? '' : `addToCart(${p.id})`}">
                <div class="product-img">
                    ${p.image ? `<img src="${p.image}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover;">` : '<i class="fas fa-tshirt"></i>'}
                </div>
                <h6>${p.name}</h6>
                <span class="code">${p.size || '-'} ${p.color ? '• ' + p.color : ''}</span>
                <div class="price">₪${Number(p.price).toFixed(2)}</div>
                <div class="stock ${isOut ? 'out' : (qty <= LOW_STOCK ? 'low' : '')}">
                    ${isOut ? 'نفد' : 'متوفر: ' + qty}
                </div>
            </div>
        `;
    }).join('');
}

function filterPosProducts() {
    const q = document.getElementById('posSearch').value.trim();
    loadPosProducts(q);
}

function addToCart(productId) {
    const p = getProductById(productId);
    if (!p) return;

    const qty = getProductQuantity(productId);
    const avgCost = getProductAvgCost(productId);

    if (qty <= 0) {
        showToast('المنتج نفد', 'error');
        return;
    }

    const existing = cart.find(i => i.product_id === productId);

    if (existing) {
        if (existing.quantity >= qty) {
            showToast('الكمية المتوفرة غير كافية', 'error');
            return;
        }
        existing.quantity++;
        existing.subtotal = existing.sold_price * existing.quantity;
    } else {
        cart.push({
            product_id: productId,
            name: p.name,
            size: p.size,
            color: p.color,
            base_price: Number(p.price),
            sold_price: Number(p.price),
            cost_at_sale: Number(avgCost.toFixed(2)),
            quantity: 1,
            subtotal: Number(p.price),
        });
    }

    renderCart();
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.product_id !== productId);
    renderCart();
}

function updateCartQty(productId, delta) {
    const item = cart.find(i => i.product_id === productId);
    if (!item) return;

    const qty = getProductQuantity(productId);
    const newQty = item.quantity + delta;

    if (newQty > qty) {
        showToast('الكمية المتوفرة غير كافية', 'error');
        return;
    }
    if (newQty <= 0) {
        removeFromCart(productId);
        return;
    }

    item.quantity = newQty;
    item.subtotal = item.sold_price * newQty;
    renderCart();
}

function updateCartPrice(productId, newPrice) {
    const item = cart.find(i => i.product_id === productId);
    if (!item) return;

    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) {
        showToast('سعر غير صحيح', 'error');
        return;
    }

    item.sold_price = price;
    item.subtotal = price * item.quantity;
    renderCart();
}

/* ============================================
   مساعدات ألوان ومقاسات السلة في الكاشير
   ============================================ */
function getColorHex(color) {
    if (!color) return '#64748b';
    const c = String(color).trim().toLowerCase();
    const map = {
        'أبيض': '#f8fafc',
        'ابيض': '#f8fafc',
        'white': '#f8fafc',
        'أسود': '#1e293b',
        'اسود': '#1e293b',
        'black': '#1e293b',
        'أحمر': '#ef4444',
        'احمر': '#ef4444',
        'red': '#ef4444',
        'أزرق': '#3b82f6',
        'ازرق': '#3b82f6',
        'blue': '#3b82f6',
        'وردي': '#ec4899',
        'زهري': '#ec4899',
        'pink': '#ec4899',
        'رمادي': '#94a3b8',
        'رصاصي': '#94a3b8',
        'gray': '#94a3b8',
        'grey': '#94a3b8',
        'أخضر': '#10b981',
        'اخضر': '#10b981',
        'green': '#10b981',
        'أصفر': '#f59e0b',
        'اصفر': '#f59e0b',
        'yellow': '#f59e0b',
        'برتقالي': '#f97316',
        'orange': '#f97316',
        'كحلي': '#1e3a8a',
        'navy': '#1e3a8a',
        'بني': '#78350f',
        'brown': '#78350f',
        'بيج': '#d7c4a3',
        'beige': '#d7c4a3',
        'بنفسجي': '#8b5cf6',
        'موف': '#8b5cf6',
        'purple': '#8b5cf6',
        'خمري': '#881337',
        'عنابي': '#881337',
        'maroon': '#881337',
        'سماوي': '#38bdf8',
        'cyan': '#38bdf8',
        'زيتي': '#4d7c0f',
        'olive': '#4d7c0f',
        'ذهبي': '#eab308',
        'gold': '#eab308',
        'فضي': '#cbd5e1',
        'silver': '#cbd5e1',
        'جينز': '#2563eb',
        'خردلي': '#d97706',
        'سكري': '#fef3c7',
        'أوف وايت': '#fdfbf7',
        'اوف وايت': '#fdfbf7',
        'مشجر': '#06b6d4',
        'كروهات': '#6366f1'
    };
    return map[c] || '#64748b';
}

function renderCartVariantChip(v, currentProductId, inColorGroup) {
    const vStock = typeof getProductQuantity === 'function' ? getProductQuantity(v.id) : 0;
    const isCurrent = (v.id === currentProductId);
    const isOut = vStock <= 0;
    const sizeLabel = v.size ? `مقاس ${v.size}` : 'عادي';
    const label = inColorGroup ? sizeLabel : `${v.color || 'عام'} - ${sizeLabel}`;
    const stockClass = isOut ? 'out' : (vStock <= 3 ? 'low' : 'ok');
    const stockText = isOut ? 'نفد (0)' : `${vStock} متوفر`;

    return `
        <div class="cart-variant-chip ${isCurrent ? 'current' : ''} ${isOut ? 'out' : ''} ${!isCurrent && !isOut ? 'clickable' : ''}"
             ${!isCurrent && !isOut ? `onclick="addToCart(${v.id})"` : ''}
             title="${isCurrent ? 'الصنف المحدد حالياً بالسلة' : (isOut ? 'نفد من المخزون' : `اضغط لإضافة ${label} إلى السلة`)}">
            ${!inColorGroup && v.color ? `<span class="variant-dot" style="background:${getColorHex(v.color)};"></span>` : ''}
            <span class="chip-label">${label}</span>
            <span class="chip-qty ${stockClass}">${stockText}</span>
            ${isCurrent ? '<span class="chip-badge-current"><i class="fas fa-check"></i> الحالي</span>' : (!isOut ? '<span class="chip-badge-add"><i class="fas fa-plus"></i></span>' : '')}
        </div>
    `;
}

function renderCartVariantsBox(item) {
    const allProducts = typeof getProducts === 'function' ? getProducts() : [];
    const prod = typeof getProductById === 'function' ? getProductById(item.product_id) : null;
    const targetName = (item.name || (prod && prod.name) || '').trim().toLowerCase();

    if (!targetName) return '';

    const variants = allProducts.filter(p => (p.name || '').trim().toLowerCase() === targetName);
    if (variants.length === 0) return '';

    // تجميع الخيارات حسب اللون
    const colorGroups = {};
    variants.forEach(v => {
        const c = (v.color || '').trim() || 'عام';
        if (!colorGroups[c]) colorGroups[c] = [];
        colorGroups[c].push(v);
    });

    const totalStock = variants.reduce((sum, v) => sum + Math.max(0, typeof getProductQuantity === 'function' ? getProductQuantity(v.id) : 0), 0);
    const colorKeys = Object.keys(colorGroups);

    let bodyHtml = '';

    if (colorKeys.length === 1 && colorKeys[0] === 'عام') {
        bodyHtml = `
            <div class="cart-variants-chips">
                ${variants.map(v => renderCartVariantChip(v, item.product_id, false)).join('')}
            </div>
        `;
    } else {
        bodyHtml = colorKeys.map(color => {
            const groupVars = colorGroups[color];
            const groupTotal = groupVars.reduce((sum, v) => sum + Math.max(0, typeof getProductQuantity === 'function' ? getProductQuantity(v.id) : 0), 0);
            const hex = getColorHex(color);

            return `
                <div class="cart-color-group">
                    <div class="cart-color-title">
                        <span class="variant-dot" style="background:${hex};"></span>
                        <span class="cart-color-name">${color}</span>
                        <span class="cart-color-qty">(${groupTotal} متوفر)</span>
                    </div>
                    <div class="cart-variants-chips">
                        ${groupVars.map(v => renderCartVariantChip(v, item.product_id, true)).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    return `
        <div class="cart-variants-box">
            <div class="cart-variants-header" onclick="this.closest('.cart-variants-box').classList.toggle('collapsed')">
                <span class="cart-variants-title">
                    <i class="fas fa-boxes text-primary"></i> المتوفر لكل لون ومقاس (${variants.length} خيارات):
                </span>
                <span class="cart-variants-total">
                    إجمالي: <strong>${totalStock} قطعة</strong>
                    <i class="fas fa-chevron-down chevron-icon"></i>
                </span>
            </div>
            <div class="cart-variants-body">
                ${bodyHtml}
            </div>
        </div>
    `;
}

function renderCart() {
    const container = document.getElementById('cartItems');

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>السلة فارغة</p>
            </div>
        `;
        updateCartTotals();
        return;
    }

    container.innerHTML = cart.map(item => {
        const isModified = item.sold_price !== item.base_price;
        const variantsHtml = renderCartVariantsBox(item);

        return `
            <div class="cart-item">
                <div class="cart-item-header">
                    <div class="cart-item-title-wrap">
                        <span class="cart-item-name">${item.name}</span>
                        <div class="cart-item-tags">
                            ${item.color ? `<span class="cart-item-badge color-badge"><span class="variant-dot" style="background:${getColorHex(item.color)};"></span>${item.color}</span>` : ''}
                            ${item.size ? `<span class="cart-item-badge size-badge">مقاس ${item.size}</span>` : ''}
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.product_id})" title="حذف من السلة">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-item-body">
                    <div class="cart-item-price">
                        <label>₪</label>
                        <input type="number" step="0.5" value="${item.sold_price}"
                               class="${isModified ? 'modified' : ''}"
                               onchange="updateCartPrice(${item.product_id}, this.value)">
                    </div>
                    <div class="cart-item-qty">
                        <button onclick="updateCartQty(${item.product_id}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQty(${item.product_id}, 1)">+</button>
                    </div>
                    <div class="cart-item-subtotal">₪${item.subtotal.toFixed(2)}</div>
                </div>
                ${variantsHtml}
            </div>
        `;
    }).join('');

    updateCartTotals();
}

window.getColorHex = getColorHex;
window.renderCartVariantChip = renderCartVariantChip;
window.renderCartVariantsBox = renderCartVariantsBox;
window.renderCart = renderCart;

function updateCartTotals() {
    const subtotal = cart.reduce((s, i) => s + i.subtotal, 0);
    const discount = parseFloat(document.getElementById('cartDiscount').value) || 0;
    const total = Math.max(0, subtotal - discount);

    document.getElementById('cartSubtotal').textContent = '₪' + subtotal.toFixed(2);
    document.getElementById('cartTotal').textContent = '₪' + total.toFixed(2);
}

function clearCart() {
    if (cart.length === 0) return;
    if (!confirm('تفريغ السلة؟')) return;
    cart = [];
    renderCart();
    selectPaymentMethod('cash');
}

/* ============================================
   11. طرق الدفع
   ============================================ */

/* ============================================
   حسابات المتجر البنكية والمحافظ للدفع الإلكتروني
   ============================================ */
const STORE_PAYMENT_ACCOUNTS = {
    'PalPay': {
        name: 'محفظة PalPay',
        type: 'محفظة إلكترونية',
        label: 'رقم المحفظة / الهاتف:',
        accountNo: '0599-887766',
        iban: '',
        title: 'متجر الأناقة للملابس'
    },
    'Jawwal Pay': {
        name: 'جوال باي (Jawwal Pay)',
        type: 'محفظة إلكترونية',
        label: 'رقم المحفظة:',
        accountNo: '0599-887766',
        iban: '',
        title: 'متجر الأناقة للملابس'
    },
    'بنك فلسطين': {
        name: 'بنك فلسطين',
        type: 'حساب بنكي',
        label: 'رقم الحساب / الفرع:',
        accountNo: '1234567 (فرع 450)',
        iban: 'PS04 PALS 0000 0000 0001 2345 67',
        title: 'متجر الأناقة للملابس'
    },
    'البنك الإسلامي الفلسطيني': {
        name: 'البنك الإسلامي الفلسطيني',
        type: 'حساب بنكي',
        label: 'رقم الحساب / الفرع:',
        accountNo: '2345678 (فرع 210)',
        iban: 'PS50 ISBK 0000 0000 0002 3456 78',
        title: 'متجر الأناقة للملابس'
    },
    'البنك العربي': {
        name: 'البنك العربي',
        type: 'حساب بنكي',
        label: 'رقم الحساب:',
        accountNo: '3456789',
        iban: 'PS30 ARAB 0000 0000 0003 4567 89',
        title: 'متجر الأناقة للملابس'
    },
    'Zain Cash': {
        name: 'زين كاش (Zain Cash)',
        type: 'محفظة إلكترونية',
        label: 'رقم المحفظة:',
        accountNo: '0799-887766',
        iban: '',
        title: 'متجر الأناقة للملابس'
    },
    'PayPal': {
        name: 'PayPal',
        type: 'حساب باي بال',
        label: 'البريد الإلكتروني:',
        accountNo: 'payments@el-anaqa-store.com',
        iban: '',
        title: 'متجر الأناقة للملابس'
    },
    'أخرى': {
        name: 'حساب آخر',
        type: 'حساب دفع',
        label: 'رقم الحساب:',
        accountNo: '0599-887766',
        iban: '',
        title: 'متجر الأناقة للملابس'
    }
};

function updateStoreAccountDisplay() {
    const sel = document.getElementById('appName');
    const card = document.getElementById('storeAccountInfoCard');
    if (!sel || !card) return;

    const val = sel.value;
    const info = STORE_PAYMENT_ACCOUNTS[val] || STORE_PAYMENT_ACCOUNTS['PalPay'];

    const typeBadge = document.getElementById('storeAccTypeBadge');
    const titleEl = document.getElementById('storeAccTitle');
    const labelEl = document.getElementById('storeAccLabel');
    const noEl = document.getElementById('storeAccNo');
    const ibanRow = document.getElementById('storeAccIbanRow');
    const ibanEl = document.getElementById('storeAccIban');

    if (typeBadge) typeBadge.textContent = info.type;
    if (titleEl) titleEl.textContent = info.title;
    if (labelEl) labelEl.textContent = info.label;
    if (noEl) noEl.textContent = info.accountNo;

    if (ibanRow && ibanEl) {
        if (info.iban) {
            ibanRow.style.display = 'block';
            ibanEl.textContent = info.iban;
        } else {
            ibanRow.style.display = 'none';
        }
    }
}

function copyStoreAccNo() {
    const text = document.getElementById('storeAccNo')?.textContent || '';
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        showToast('تم نسخ رقم الحساب بنجاح! 📋');
    }).catch(() => {
        showToast('تعذر النسخ التلقائي', 'info');
    });
}

function copyStoreIban() {
    const text = document.getElementById('storeAccIban')?.textContent || '';
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        showToast('تم نسخ رقم الآيبان بنجاح! 📋');
    }).catch(() => {
        showToast('تعذر النسخ التلقائي', 'info');
    });
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;

    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.borderColor = '#e2e8f0';
        btn.style.background = '#fff';
        btn.style.color = 'var(--gray)';
    });

    const activeBtn = document.querySelector(`.payment-btn[data-method="${method}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    const appFields = document.getElementById('appPaymentFields');
    const debtFields = document.getElementById('debtFields');

    appFields.style.display = 'none';
    debtFields.style.display = 'none';

    if (method === 'app') {
        appFields.style.display = 'block';
    } else if (method === 'debt') {
        debtFields.style.display = 'block';
    }
}

function removeScreenshot() {
    paymentScreenshotData = null;
    const preview = document.getElementById('screenshotPreview');
    const input = document.getElementById('paymentScreenshot');
    if (preview) preview.style.display = 'none';
    if (input) input.value = '';
}

document.addEventListener('change', function (e) {
    if (e.target && e.target.id === 'paymentScreenshot') {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 3 * 1024 * 1024) {
            showToast('حجم الصورة كبير (الحد 3 ميجا)', 'error');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (evt) {
            paymentScreenshotData = evt.target.result;
            document.getElementById('previewImg').src = paymentScreenshotData;
            document.getElementById('screenshotPreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

/* ============================================
   12. إتمام البيع
   ============================================ */
function checkout() {
    if (cart.length === 0) {
        showToast('السلة فارغة', 'error');
        return;
    }

    if (IS_DEMO && getSales().length >= DEMO_LIMITS.sales) {
        showDemoLimit('فاتورة بيع', DEMO_LIMITS.sales);
        return;
    }

    for (let item of cart) {
        if (getProductQuantity(item.product_id) < item.quantity) {
            showToast(`الكمية غير كافية: ${item.name}`, 'error');
            return;
        }
    }

    let paymentData = null;
    let debtCustomerName = null;
    let debtCustomerPhone = null;
    let debtNote = null;
    let debtPaidAmount = 0;

    if (selectedPaymentMethod === 'app') {
        const senderName = document.getElementById('senderName').value.trim();
        const senderPhone = document.getElementById('senderPhone').value.trim();
        const appName = document.getElementById('appName').value;

        if (!senderName || senderName.length < 3) {
            showToast('يرجى إدخال اسم المرسل', 'error');
            return;
        }
        if (!senderPhone || senderPhone.length < 8) {
            showToast('يرجى إدخال رقم هاتف المرسل', 'error');
            return;
        }

        paymentData = {
            method: 'app',
            app_name: appName,
            sender_name: senderName,
            sender_phone: senderPhone,
            screenshot: paymentScreenshotData || null,
        };
    } else if (selectedPaymentMethod === 'debt') {
        debtCustomerName = document.getElementById('debtCustomerName').value.trim();
        debtCustomerPhone = document.getElementById('debtCustomerPhone').value.trim();
        debtNote = document.getElementById('debtNote').value.trim();
        debtPaidAmount = parseFloat(document.getElementById('debtPaidAmount').value) || 0;

        if (!debtCustomerName || debtCustomerName.length < 3) {
            showToast('يرجى إدخال اسم العميل', 'error');
            return;
        }
        if (!debtCustomerPhone || debtCustomerPhone.length < 8) {
            showToast('يرجى إدخال رقم هاتف العميل', 'error');
            return;
        }

        paymentData = { method: 'debt', paid_upfront: debtPaidAmount };
    } else {
        paymentData = { method: 'cash' };
    }

    const subtotal = cart.reduce((s, i) => s + i.subtotal, 0);
    const discount = parseFloat(document.getElementById('cartDiscount').value) || 0;
    const total = Math.max(0, subtotal - discount);

    if (debtPaidAmount > total) {
        showToast('الدفعة الأولى لا يمكن أن تكون أكبر من الإجمالي', 'error');
        return;
    }

    const user = getCurrentUser();

    const sale = {
        id: Math.floor(Math.random() * 90000) + 10000,
        customer: debtCustomerName || document.getElementById('customerName').value.trim() || 'عميل نقدي',
        items: cart.map(i => ({ ...i })),
        subtotal, discount, total,
        payment: paymentData,
        cashier_id: user.id,
        cashier_name: user.name,
        status: 'completed',
        voided_reason: null,
        voided_by: null,
        voided_at: null,
        created_at: new Date().toISOString(),
    };

    const sales = getSales();
    sales.push(sale);
    saveSales(sales);

    if (selectedPaymentMethod === 'debt') {
        const debts = getCustomerDebts();
        let newId = debts.length > 0 ? Math.max(...debts.map(d => d.id)) : 0;
        
        // سجل الفاتورة (إجمالي الدين)
        newId++;
        debts.push({
            id: newId,
            customer_name: debtCustomerName,
            customer_phone: debtCustomerPhone,
            type: 'invoice',
            amount: total,
            sale_id: sale.id,
            note: debtNote || 'دين فاتورة #' + sale.id,
            created_at: new Date().toISOString(),
        });
        
        // سجل الدفعة الأولى إن وجدت
        if (debtPaidAmount > 0) {
            newId++;
            debts.push({
                id: newId,
                customer_name: debtCustomerName,
                customer_phone: debtCustomerPhone,
                type: 'payment',
                amount: debtPaidAmount,
                sale_id: sale.id,
                note: 'دفعة أولى لفاتورة #' + sale.id,
                created_at: new Date().toISOString(),
            });
        }
        
        saveCustomerDebts(debts);
        // Refresh Debts UI if active
        if (document.getElementById('debtsTableBody')) {
            loadDebtsTable();
        }
    }

    printInvoice(sale);

    cart = [];
    document.getElementById('cartDiscount').value = 0;
    document.getElementById('customerName').value = '';
    document.getElementById('senderName').value = '';
    document.getElementById('senderPhone').value = '';
    document.getElementById('debtCustomerName').value = '';
    document.getElementById('debtCustomerPhone').value = '';
    document.getElementById('debtPaidAmount').value = '';
    document.getElementById('debtNote').value = '';
    document.getElementById('paymentScreenshot').value = '';
    removeScreenshot();
    selectPaymentMethod('cash');
    renderCart();
    loadPosProducts();

    showToast(`✅ تم البيع بنجاح! ₪${total.toFixed(2)}`);
}

/* ============================================
   13. طباعة الفاتورة
   ============================================ */
function printInvoice(sale) {
    const itemsHTML = sale.items.map(item => `
        <tr>
            <td>${item.name} (${item.size || '-'})</td>
            <td>${item.quantity}</td>
            <td>₪${item.sold_price.toFixed(2)}</td>
            <td>₪${item.subtotal.toFixed(2)}</td>
        </tr>
    `).join('');

    const paymentInfo = sale.payment && sale.payment.method === 'app'
        ? `<div style="text-align:center;font-size:12px;margin:10px 0;padding:8px;background:#fffbeb;border-radius:6px;"><strong>دفع عبر ${sale.payment.app_name}</strong><br>المرسل: ${sale.payment.sender_name}<br>الهاتف: ${sale.payment.sender_phone}</div>`
        : '';

    const w = window.open('', '_blank', 'width=400,height=600');
    w.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>فاتورة #${sale.id}</title>
            <style>
                body{font-family:'Cairo',sans-serif;padding:20px;max-width:350px;margin:0 auto}
                h2{text-align:center;margin:0 0 5px}
                .center{text-align:center;color:#666;font-size:12px;margin-bottom:15px}
                table{width:100%;border-collapse:collapse;font-size:12px;margin:15px 0}
                th{background:#f0f0f0;padding:8px;text-align:right}
                td{padding:8px;border-bottom:1px solid #eee}
                .total{font-size:18px;font-weight:bold;text-align:left;margin-top:15px;padding-top:15px;border-top:2px solid #000}
                .footer{text-align:center;margin-top:20px;font-size:11px;color:#999}
            </style>
        </head>
        <body>
            <h2>متجر الأناقة</h2>
            <div class="center">
                فاتورة #${sale.id}<br>
                ${new Date(sale.created_at).toLocaleString('ar-EG')}<br>
                الكاشير: ${sale.cashier_name}<br>
                العميل: ${sale.customer}
            </div>
            ${paymentInfo}
            <table>
                <thead>
                    <tr><th>المنتج</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr>
                </thead>
                <tbody>${itemsHTML}</tbody>
            </table>
            <div style="text-align:left;font-size:13px;padding-top:10px;border-top:1px dashed #ccc;">
                المجموع: ₪${sale.subtotal.toFixed(2)}<br>
                ${sale.discount > 0 ? `الخصم: -₪${sale.discount.toFixed(2)}<br>` : ''}
            </div>
            <div class="total">الإجمالي: ₪${sale.total.toFixed(2)}</div>
            <div class="footer">شكراً لزيارتكم! 🛍️</div>
        </body>
        </html>
    `);
    w.document.close();
    setTimeout(() => w.print(), 500);
}

function printInvoiceById(id) {
    const sale = getSales().find(s => s.id === id);
    if (sale) printInvoice(sale);
}

/* ============================================
   14. سجل المبيعات
   ============================================ */
function loadSalesHistory() {
    const tbody = document.getElementById('salesHistoryTable');
    const filterDate = document.getElementById('filterSalesDate')?.value;
    let sales = getSales().slice().reverse();

    if (filterDate) {
        sales = sales.filter(s => new Date(s.created_at).toISOString().split('T')[0] === filterDate);
    }

    if (sales.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty">لا توجد مبيعات</td></tr>';
        return;
    }

    const user = getCurrentUser();
    const isOwner = user.role === 'owner';

    tbody.innerHTML = sales.map(s => {
        const isVoided = s.status === 'voided';
        const itemsSummary = s.items.map(i => `${i.name} (${i.size || '-'}) ×${i.quantity}`).join('، ');
        const hasPriceChange = s.items.some(i => i.sold_price !== i.base_price);
        const isAppPayment = s.payment && s.payment.method === 'app';
        const isDebtPayment = s.payment && s.payment.method === 'debt';

        let paymentIcon = '<i class="fas fa-money-bill-wave" style="color:var(--success);"></i> كاش';
        if (isAppPayment) paymentIcon = '<i class="fas fa-mobile-alt" style="color:var(--warning);"></i> تطبيق';
        if (isDebtPayment) paymentIcon = '<i class="fas fa-hand-holding-usd" style="color:var(--danger);"></i> دين';

        return `
            <tr style="${isVoided ? 'opacity:0.55;background:#fef2f2;' : ''}">
                <td>
                    <strong>#${s.id}</strong>
                    ${isVoided ? '<br><span class="badge danger" style="font-size:0.65rem;">ملغاة</span>' : ''}
                </td>
                <td style="font-size:.8rem;">${new Date(s.created_at).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td>${s.customer}</td>
                <td style="font-size:0.8rem;"><strong><i class="fas fa-user-tie"></i> ${s.cashier_name || '-'}</strong></td>
                <td style="font-size:.8rem;color:var(--gray);max-width:230px;">
                    ${itemsSummary}
                    ${hasPriceChange ? '<br><span style="color:var(--warning);font-weight:700;font-size:.72rem;"><i class="fas fa-tag"></i> تعديل أسعار</span>' : ''}
                    ${isVoided ? `<br><span style="color:var(--danger);font-size:0.7rem;"><i class="fas fa-ban"></i> السبب: ${s.voided_reason}</span>` : ''}
                </td>
                <td>
                    <strong style="color:${isVoided ? 'var(--gray)' : 'var(--success)'};${isVoided ? 'text-decoration:line-through;' : ''}">₪${Number(s.total).toFixed(2)}</strong>
                    <br><small style="font-size:0.7rem;">${paymentIcon}</small>
                </td>
                <td>
                    ${isAppPayment ? `
                        <button class="btn-icon warning" onclick="viewPaymentDetails(${s.id})" title="بيانات الدفع">
                            <i class="fas fa-receipt"></i>
                        </button>
                    ` : ''}
                    <button class="btn-icon" onclick="printInvoiceById(${s.id})" title="طباعة">
                        <i class="fas fa-print"></i>
                    </button>
                    ${!isVoided ? `
                        <button class="btn-icon warning" onclick="voidSale(${s.id})" title="إلغاء">
                            <i class="fas fa-ban"></i>
                        </button>
                    ` : ''}
                    ${isOwner ? `
                        <button class="btn-icon danger" onclick="deleteSale(${s.id})" title="حذف (للمالك)">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

/* ============================================
   15. إلغاء الفاتورة (Void)
   ============================================ */
function voidSale(id) {
    const sale = getSales().find(s => s.id === id);
    if (!sale) return;

    if (sale.status === 'voided') {
        showToast('الفاتورة ملغاة مسبقاً', 'warning');
        return;
    }

    const reason = prompt(
        `⚠️ إلغاء الفاتورة #${sale.id}\n\n` +
        `المبلغ: ₪${sale.total.toFixed(2)}\n` +
        `العميل: ${sale.customer}\n\n` +
        `يرجى إدخال سبب الإلغاء (إجباري):`,
        'إرجاع العميل للبضاعة'
    );

    if (!reason || reason.trim().length < 3) {
        showToast('يجب إدخال سبب الإلغاء', 'error');
        return;
    }

    const managerPin = prompt('🔐 أدخل رمز المدير للموافقة (افتراضي: 1234):', '1234');
    if (managerPin !== '1234') {
        showToast('رمز الموافقة غير صحيح', 'error');
        return;
    }

    const sales = getSales();
    const index = sales.findIndex(s => s.id === id);
    if (index !== -1) {
        sales[index] = {
            ...sales[index],
            status: 'voided',
            voided_reason: reason.trim(),
            voided_by: getCurrentUser().id,
            voided_by_name: getCurrentUser().name,
            voided_at: new Date().toISOString(),
        };
        saveSales(sales);
    }

    if (sale.payment && sale.payment.method === 'debt') {
        const debts = getCustomerDebts().filter(d => d.sale_id !== id);
        saveCustomerDebts(debts);
    }

    showToast(`✅ تم إلغاء الفاتورة #${sale.id}`);

    loadSalesHistory();
    loadInventoryTable();
    loadPosProducts();
    loadDashboard();
    loadReports();
    loadDebtsTable();
}

/* ============================================
   16. حذف نهائي (للمالك فقط)
   ============================================ */
function deleteSale(id) {
    const user = getCurrentUser();
    if (user.role !== 'owner') {
        showToast('⚠️ الحذف النهائي للمالك فقط', 'error');
        return;
    }

    const sale = getSales().find(s => s.id === id);
    if (!sale) return;

    if (!confirm(`🚨 حذف نهائي للفاتورة #${sale.id}\n\nالمبلغ: ₪${sale.total.toFixed(2)}\n\n⚠️ لا يمكن التراجع!`)) return;

    const auditLog = getAuditLog();
    auditLog.push({
        id: auditLog.length + 1,
        action: 'delete_sale',
        sale_id: sale.id,
        sale_total: sale.total,
        deleted_by: user.id,
        deleted_by_name: user.name,
        deleted_at: new Date().toISOString(),
    });
    saveAuditLog(auditLog);

    if (sale.payment && sale.payment.method === 'debt') {
        const debts = getCustomerDebts().filter(d => d.sale_id !== id);
        saveCustomerDebts(debts);
    }

    saveSales(getSales().filter(s => s.id !== id));

    showToast('تم حذف الفاتورة نهائياً');
    loadSalesHistory();
    loadInventoryTable();
    loadPosProducts();
    loadDashboard();
    loadReports();
    loadDebtsTable();
}

/* ============================================
   17. عرض بيانات الدفع
   ============================================ */
function viewPaymentDetails(id) {
    const sale = getSales().find(s => s.id === id);
    if (!sale || !sale.payment) return;

    const p = sale.payment;

    if (p.method === 'cash') {
        showToast('هذه الفاتورة دفع كاش', 'warning');
        return;
    }

    let html = `
        <div style="text-align:right;">
            <div style="background:#fef3c7;border-radius:12px;padding:14px;margin-bottom:14px;">
                <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #fcd34d;">
                    <span style="color:#92400e;font-weight:700;">التطبيق:</span>
                    <strong style="color:#78350f;">${p.app_name}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #fcd34d;">
                    <span style="color:#92400e;font-weight:700;">المرسل:</span>
                    <strong style="color:#78350f;">${p.sender_name}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #fcd34d;">
                    <span style="color:#92400e;font-weight:700;">الهاتف:</span>
                    <strong style="color:#78350f;" dir="ltr">${p.sender_phone}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;padding:6px 0;">
                    <span style="color:#92400e;font-weight:700;">المبلغ:</span>
                    <strong style="color:#16a34a;font-size:1.05rem;">₪${Number(sale.total).toFixed(2)}</strong>
                </div>
            </div>
    `;

    if (p.screenshot) {
        html += `
            <div style="margin-bottom:14px;">
                <h6 style="font-weight:800;margin-bottom:8px;color:var(--dark);">
                    <i class="fas fa-image"></i> صورة الإشعار:
                </h6>
                <img src="${p.screenshot}" style="width:100%;border-radius:12px;border:2px solid #e2e8f0;cursor:pointer;" onclick="window.open('${p.screenshot}','_blank')">
                <small style="display:block;text-align:center;color:var(--gray);font-size:.72rem;margin-top:5px;">
                    اضغط على الصورة لعرضها بحجم كامل
                </small>
            </div>
        `;
    }

    html += `
            <div style="border-top:1px solid #e2e8f0;padding-top:12px;margin-top:12px;">
                <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:.85rem;">
                    <span style="color:var(--gray);">الكاشير:</span>
                    <strong>${sale.cashier_name || '-'}</strong>
                </div>
                <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:.85rem;">
                    <span style="color:var(--gray);">التاريخ:</span>
                    <strong>${new Date(sale.created_at).toLocaleString('ar-EG')}</strong>
                </div>
            </div>
        </div>
    `;

    const modal = document.createElement('div');
    modal.id = 'paymentDetailsModal';
    modal.className = 'modal-overlay show';
    modal.innerHTML = `
        <div class="modal-box" style="max-width:460px;">
            <div class="modal-header">
                <h5><i class="fas fa-receipt"></i> بيانات الدفع - #${sale.id}</h5>
                <button class="modal-close" onclick="document.getElementById('paymentDetailsModal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${html}
                <div class="modal-actions">
                    <button class="btn btn-outline" onclick="document.getElementById('paymentDetailsModal').remove()">إغلاق</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

/* ============================================
   18. إدارة المشتريات التفاعلية (Purchases Management)
   ============================================ */
let purchActiveItems = [];
let purchActiveInvoiceId = 'INV-' + Math.floor(Math.random() * 9000 + 1000);
let purchPosted = false;

const PURCH_COLORS = [
    ['أحمر', '#e34b54'],
    ['أسود', '#222831'],
    ['أبيض', '#f1f5f9'],
    ['أزرق', '#3b82f6'],
    ['بني', '#9a633e'],
    ['أخضر', '#10b981'],
    ['رمادي', '#64748b'],
    ['وردي', '#ec4899'],
    ['أصفر', '#eab308']
];
const PURCH_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '39', '40', '41', '42'];

function switchPurchSubtab(tab) {
    ['invoice', 'stock', 'history'].forEach(t => {
        const btn = document.getElementById(`tabBtn-purch-${t}`);
        const content = document.getElementById(`purchSubtab-${t}`);
        if (btn) btn.classList.toggle('active', t === tab);
        if (content) content.style.display = (t === tab ? 'block' : 'none');
    });
    if (tab === 'stock') loadInventoryTable();
    if (tab === 'history') loadPurchasesTable();
}

function loadPurchasesManagement() {
    fillPurchSuppliers();
    fillPurchNewCategories();
    const dateInput = document.getElementById('purchDate');
    if (dateInput && !dateInput.value) {
        dateInput.value = new Date().toISOString().slice(0, 10);
    }
    const invInput = document.getElementById('purchInvoiceNo');
    if (invInput && !invInput.value) {
        invInput.value = 'SUP-' + Math.floor(Math.random() * 9000 + 1000);
    }

    const hasDraft = loadPurchDraft();
    if (!hasDraft) {
        renderPurchProducts();
        calcPurchTotals();
        renderPurchDraftBox();
    }
}

function fillPurchSuppliers() {
    const merchants = typeof getMerchants === 'function' ? getMerchants() : [];
    
    // 1. Datalist for input combo
    const dl = document.getElementById('purchSupplierList');
    if (dl) {
        dl.innerHTML = merchants.map(m => `<option value="${m.name}">${m.name} ${m.phone ? '(' + m.phone + ')' : ''}</option>`).join('');
    }

    // 2. Fallback if purchSupplier is still a select
    const sel = document.getElementById('purchSupplier');
    if (sel && sel.tagName === 'SELECT') {
        const currentVal = sel.value;
        let html = '<option value="">اختر المورد</option>';
        merchants.forEach(m => {
            html += `<option value="${m.name}">${m.name} (${m.phone || 'مورد'})</option>`;
        });
        html += '<option value="__new__">+ مورد جديد...</option>';
        sel.innerHTML = html;
        if (currentVal) sel.value = currentVal;
    }
}

function onPurchMethodChange() {
    const sel = document.getElementById('purchMethod');
    const bankBox = document.getElementById('purchBankDetailsBox');
    const paidInput = document.getElementById('purchPaid');
    if (!sel) return;

    if (bankBox) {
        if (sel.value === 'bank') {
            bankBox.style.display = 'block';
        } else {
            bankBox.style.display = 'none';
        }
    }

    if (sel.value === 'credit' && paidInput) {
        paidInput.value = '0';
    } else if ((sel.value === 'cash' || sel.value === 'bank') && paidInput) {
        const t = typeof calcPurchTotals === 'function' ? calcPurchTotals() : null;
        if ((!paidInput.value || Number(paidInput.value) === 0) && t && t.totalAmount > 0) {
            paidInput.value = t.totalAmount;
        }
    }

    if (typeof calcPurchTotals === 'function') calcPurchTotals();
    savePurchDraft(true);
}

function onPurchSupplierInput() {
    savePurchDraft(true);
}

function openQuickAddSupplierModal() {
    const currentVal = (document.getElementById('purchSupplier')?.value || '').trim();
    if (document.getElementById('quickSupplierName')) {
        document.getElementById('quickSupplierName').value = currentVal;
    }
    if (document.getElementById('quickSupplierPhone')) {
        document.getElementById('quickSupplierPhone').value = '';
    }
    if (document.getElementById('quickSupplierNote')) {
        document.getElementById('quickSupplierNote').value = '';
    }
    openModal('quickSupplierModal');
}

function saveQuickSupplier() {
    const name = (document.getElementById('quickSupplierName')?.value || '').trim();
    const phone = (document.getElementById('quickSupplierPhone')?.value || '').trim();
    if (!name) {
        showToast('يرجى إدخال اسم المورد', 'error');
        return;
    }
    const merchants = typeof getMerchants === 'function' ? getMerchants() : [];
    let existing = merchants.find(m => m.name.toLowerCase() === name.toLowerCase());
    if (!existing) {
        let newId = merchants.length > 0 ? Math.max(...merchants.map(m => m.id)) : 0;
        merchants.push({ id: newId + 1, name: name, phone: phone, balance: 0 });
        if (typeof saveMerchants === 'function') saveMerchants(merchants);
    } else if (phone && !existing.phone) {
        existing.phone = phone;
        if (typeof saveMerchants === 'function') saveMerchants(merchants);
    }

    fillPurchSuppliers();
    const supInput = document.getElementById('purchSupplier');
    if (supInput) supInput.value = name;
    savePurchDraft(true);
    closeModal('quickSupplierModal');
    showToast('تمت إضافة المورد واختياره بنجاح! ✅');
}

function onPurchSearchInput() {
    const q = (document.getElementById('purchSearch')?.value || '').toLowerCase().trim();
    const resultsContainer = document.getElementById('purchSearchResults');
    if (!resultsContainer) return;

    if (!q) {
        resultsContainer.innerHTML = '';
        return;
    }

    const allProducts = getProducts();
    const grouped = [];
    allProducts.forEach(p => {
        const existing = grouped.find(g => (g.name || '').toLowerCase() === (p.name || '').toLowerCase() || (g.code && p.code && g.code === p.code));
        if (!existing) {
            grouped.push({
                id: p.id,
                name: p.name,
                code: p.code || '',
                category: p.category || '',
                price: p.price,
                base_cost: p.base_cost
            });
        }
    });

    const matches = grouped.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.code || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
    );

    if (matches.length > 0) {
        resultsContainer.innerHTML = matches.map(p => `
            <div class="purch-search-item">
                <div>
                    <strong style="color:var(--dark);font-size:0.92rem;">${p.name}</strong>
                    <div style="font-size:0.75rem;color:var(--gray);margin-top:2px;">
                        ${p.code ? `<span class="badge primary" style="font-size:0.7rem;padding:2px 6px;">${p.code}</span>` : ''} 
                        ${p.category ? `• ${p.category}` : ''}
                    </div>
                </div>
                <button class="btn btn-outline btn-sm" onclick="addExistingToPurchInvoice(${p.id})">
                    <i class="fas fa-plus"></i> إضافة للفاتورة
                </button>
            </div>
        `).join('');
    } else {
        const cleanQuery = (document.getElementById('purchSearch')?.value || '').replace(/'/g, "\\'");
        resultsContainer.innerHTML = `
            <div class="purch-search-item" style="border-style:dashed;">
                <div>
                    <strong style="color:var(--dark);">لم يُعثر على تطابق واضح</strong>
                    <small style="color:var(--gray);display:block;margin-top:2px;">تحقق من الاسم أو أدخل منتجاً جديداً مباشرة</small>
                </div>
                <button class="btn btn-primary btn-sm" onclick="openPurchNewProductModal('${cleanQuery}')">
                    <i class="fas fa-plus"></i> إدخال منتج جديد
                </button>
            </div>
        `;
    }
}

function clearPurchSearch() {
    const input = document.getElementById('purchSearch');
    if (input) input.value = '';
    const resultsContainer = document.getElementById('purchSearchResults');
    if (resultsContainer) resultsContainer.innerHTML = '';
}

function addExistingToPurchInvoice(productId) {
    if (purchPosted) {
        showToast('الفاتورة معتمدة. ابدأ فاتورة جديدة.', 'warning');
        return;
    }
    const allProducts = getProducts();
    const baseProd = allProducts.find(p => p.id === productId);
    if (!baseProd) return;

    if (purchActiveItems.some(p => p.catalogId === baseProd.id || (p.code && baseProd.code && p.code === baseProd.code))) {
        showToast('المنتج موجود بالفعل في الفاتورة؛ يمكنك تعديل جدول كمياته.', 'info');
        clearPurchSearch();
        return;
    }

    const matchingVariants = allProducts.filter(p =>
        p.name === baseProd.name && (baseProd.code ? p.code === baseProd.code : true)
    );

    const variants = matchingVariants.map(mv => {
        const col = PURCH_COLORS.find(c => c[0] === mv.color);
        const stock = getProductQuantity(mv.id);
        const avg = getProductAvgCost(mv.id);
        return {
            productId: mv.id,
            color: mv.color || '',
            hex: col ? col[1] : '#cbd5e1',
            size: mv.size || '',
            stock: stock,
            avg: avg,
            qty: 1, cost: mv.base_cost || avg || 0
        };
    });

    const hasColor = variants.some(v => v.color);
    const hasSize = variants.some(v => v.size);
    let mode = 'none';
    if (hasColor && hasSize) mode = 'both';
    else if (hasColor) mode = 'color';
    else if (hasSize) mode = 'size';

    if (variants.length === 0) {
        variants.push({
            productId: baseProd.id,
            color: baseProd.color || '',
            hex: '#cbd5e1',
            size: baseProd.size || '',
            stock: getProductQuantity(baseProd.id),
            avg: getProductAvgCost(baseProd.id),
            qty: 0,
            cost: baseProd.base_cost || 0
        });
    }

    purchActiveItems.push({
        uid: 'UID-' + Math.random().toString(36).slice(2, 9),
        catalogId: baseProd.id,
        name: baseProd.name,
        code: baseProd.code || '',
        category: baseProd.category || 'عام',
        retail: Number(baseProd.price || 0),
        min: Number(baseProd.price || 0) * 0.8,
        mode: mode,
        isNew: false,
        variants: variants
    });

    clearPurchSearch();
    renderPurchProducts();
    calcPurchTotals();
    savePurchDraft(true);
    showToast('أُضيف المنتج إلى الفاتورة');
}

function fillPurchNewCategories() {
    const sel = document.getElementById('purchNewCategory');
    if (!sel) return;
    const cats = typeof getCategories === 'function' ? getCategories() : [];
    sel.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
}

function onPurchNewModeChange() {
    const mode = document.getElementById('purchNewMode')?.value || 'both';
    const colorGrp = document.getElementById('purchNewColorGroup');
    const sizeGrp = document.getElementById('purchNewSizeGroup');
    if (colorGrp) colorGrp.style.display = (mode === 'both' || mode === 'color') ? 'block' : 'none';
    if (sizeGrp) sizeGrp.style.display = (mode === 'both' || mode === 'size') ? 'block' : 'none';
}

function openPurchNewProductModal(prefillName = '') {
    fillPurchNewCategories();

    // Populate colors
    const colSel = document.getElementById('purchNewColor');
    if (colSel) {
        colSel.innerHTML = PURCH_COLORS.map(c => `<option value="${c[0]}">${c[0]}</option>`).join('');
    }

    // Populate sizes
    const sizeSel = document.getElementById('purchNewSize');
    if (sizeSel) {
        sizeSel.innerHTML = PURCH_SIZES.map(s => `<option value="${s}">${s}</option>`).join('');
    }

    if (document.getElementById('purchNewName')) document.getElementById('purchNewName').value = prefillName || '';
    if (document.getElementById('purchNewCode')) document.getElementById('purchNewCode').value = '';
    if (document.getElementById('purchNewCost')) document.getElementById('purchNewCost').value = '';
    if (document.getElementById('purchNewQty')) document.getElementById('purchNewQty').value = '1';
    if (document.getElementById('purchNewRetail')) document.getElementById('purchNewRetail').value = '';
    if (document.getElementById('purchNewMinPrice')) document.getElementById('purchNewMinPrice').value = '';
    if (document.getElementById('purchNewMode')) document.getElementById('purchNewMode').value = 'both';

    onPurchNewModeChange();
    openModal('purchNewProductModal');
    setTimeout(() => document.getElementById('purchNewName')?.focus(), 200);
}

function addPurchNewProduct() {
    const name = (document.getElementById('purchNewName')?.value || '').trim();
    const code = (document.getElementById('purchNewCode')?.value || '').trim();
    const category = document.getElementById('purchNewCategory')?.value || 'عام';
    const cost = Math.max(0, parseFloat(document.getElementById('purchNewCost')?.value) || 0);
    const qty = Math.max(1, parseInt(document.getElementById('purchNewQty')?.value) || 1);
    let retail = parseFloat(document.getElementById('purchNewRetail')?.value) || 0;
    const mode = document.getElementById('purchNewMode')?.value || 'both';

    if (!name) {
        showToast('يرجى إدخال اسم المنتج المطلوب', 'error');
        document.getElementById('purchNewName')?.focus();
        return;
    }

    if (retail <= 0 && cost > 0) {
        retail = Math.round(cost * 1.5);
    }
    const min = parseFloat(document.getElementById('purchNewMinPrice')?.value) || (retail * 0.8);

    const chosenColor = (mode === 'both' || mode === 'color') ? (document.getElementById('purchNewColor')?.value || 'أسود') : '';
    const chosenSize = (mode === 'both' || mode === 'size') ? (document.getElementById('purchNewSize')?.value || 'M') : '';

    const colObj = PURCH_COLORS.find(c => c[0] === chosenColor);
    const hex = colObj ? colObj[1] : (chosenColor ? '#222831' : '#cbd5e1');

    const variants = [{
        color: chosenColor,
        hex: hex,
        size: chosenSize,
        stock: 0,
        avg: 0,
        qty: qty,
        cost: cost
    }];

    purchActiveItems.push({
        uid: 'UID-' + Math.random().toString(36).slice(2, 9),
        catalogId: null,
        name: name,
        code: code || 'NEW-' + Math.floor(Math.random() * 900 + 100),
        category: category,
        retail: retail,
        min: min,
        mode: mode,
        isNew: true,
        variants: variants
    });

    closeModal('purchNewProductModal');
    renderPurchProducts();
    calcPurchTotals();
    savePurchDraft(true);
    showToast('✅ تم إضافة المنتج بنجاح إلى الفاتورة!');
}

function addVariantToPurchProduct(pUid) {
    const p = purchActiveItems.find(x => x.uid === pUid);
    if (!p) return;
    const colSel = document.getElementById(`sel-col-${pUid}`);
    const sizeSel = document.getElementById(`sel-size-${pUid}`);

    const color = (p.mode === 'both' || p.mode === 'color') ? (colSel ? colSel.value : 'أسود') : '';
    const size = (p.mode === 'both' || p.mode === 'size') ? (sizeSel ? sizeSel.value : 'M') : '';

    if (p.variants.some(v => v.color === color && v.size === size)) {
        showToast('هذه التركيبة مضافة بالفعل لهذا المنتج', 'warning');
        return;
    }

    const cObj = PURCH_COLORS.find(c => c[0] === color);
    p.variants.push({
        color: color,
        hex: cObj ? cObj[1] : '#cbd5e1',
        size: size,
        stock: 0,
        avg: 0,
        qty: 0,
        cost: 0
    });

    renderPurchProducts();
    calcPurchTotals();
    savePurchDraft(true);
}

function removeVariantFromPurchProduct(pUid, index) {
    const p = purchActiveItems.find(x => x.uid === pUid);
    if (!p) return;
    p.variants.splice(index, 1);
    if (p.variants.length === 0) {
        p.variants.push({ color: '', hex: '', size: '', stock: 0, avg: 0, qty: 0, cost: 0 });
    }
    renderPurchProducts();
    calcPurchTotals();
    savePurchDraft(true);
}

function removeProductFromPurchInvoice(pUid) {
    if (!confirm('هل تريد إزالة هذا الصنف بالكامل من الفاتورة؟')) return;
    purchActiveItems = purchActiveItems.filter(x => x.uid !== pUid);
    renderPurchProducts();
    calcPurchTotals();
    savePurchDraft(true);
}

function onPurchVariantFieldChange(pUid, index, field, val) {
    const p = purchActiveItems.find(x => x.uid === pUid);
    if (!p || !p.variants[index]) return;
    const num = Math.max(0, parseFloat(val) || 0);
    p.variants[index][field] = (field === 'qty' ? Math.floor(num) : num);
    renderPurchProducts();
    calcPurchTotals();
    savePurchDraft(true);
}

function onPurchProductControlChange(pUid, field, val) {
    const p = purchActiveItems.find(x => x.uid === pUid);
    if (!p) return;
    if (field === 'mode') {
        p.mode = val;
        if (val === 'none') {
            p.variants.forEach(v => { v.color = ''; v.size = ''; });
        } else if (val === 'color') {
            p.variants.forEach(v => { v.size = ''; });
        } else if (val === 'size') {
            p.variants.forEach(v => { v.color = ''; });
        }
    } else {
        p[field] = Math.max(0, parseFloat(val) || 0);
    }
    renderPurchProducts();
    calcPurchTotals();
    savePurchDraft(true);
}

function renderPurchProducts() {
    const container = document.getElementById('purchProductsContainer');
    if (!container) return;

    if (purchActiveItems.length === 0) {
        container.innerHTML = `
            <div class="empty" style="border:2px dashed #cbd5e1;border-radius:14px;padding:36px;text-align:center;color:var(--gray);">
                <i class="fas fa-boxes" style="font-size:2.4rem;color:#cbd5e1;margin-bottom:12px;display:block;"></i>
                لم تتم إضافة أصناف بعد. ابحث عن منتج موجود أو أدخل منتجاً جديداً من الزر أعلاه.
            </div>
        `;
        return;
    }

    container.innerHTML = purchActiveItems.map(p => {
        const colorMode = (p.mode === 'both' || p.mode === 'color');
        const sizeMode = (p.mode === 'both' || p.mode === 'size');

        let headers = '';
        if (colorMode) headers += '<th>اللون</th>';
        if (sizeMode) headers += '<th>المقاس</th>';
        headers += `
            <th>المخزون الحالي</th>
            <th>كمية الدفعة</th>
            <th>سعر شراء الوحدة</th>
            <th>إجمالي السطر</th>
            <th>المخزون بعد الاعتماد</th>
            <th>متوسط التكلفة الجديد</th>
            <th>إجراء</th>
        `;

        const rows = p.variants.map((v, i) => {
            const qty = Number(v.qty || 0);
            const cost = Number(v.cost || 0);
            const stock = Number(v.stock || 0);
            const avg = Number(v.avg || 0);
            const lineTotal = qty * cost;
            const newStock = stock + qty;
            const newAvg = newStock > 0 ? ((stock * avg) + (qty * cost)) / newStock : 0;

            let rowHtml = '<tr>';
            if (colorMode) {
                rowHtml += `
                    <td>
                        <span class="variant-pill">
                            <span class="variant-dot" style="background:${v.hex || '#222831'};"></span>
                            ${v.color || 'بدون'}
                        </span>
                    </td>
                `;
            }
            if (sizeMode) {
                rowHtml += `<td><strong>${v.size || 'بدون'}</strong></td>`;
            }
            rowHtml += `
                <td style="color:var(--gray);">${stock}</td>
                <td>
                    <input type="number" min="0" step="1" class="purch-qty-input" value="${v.qty || ''}" placeholder="كمية"
                        onchange="onPurchVariantFieldChange('${p.uid}', ${i}, 'qty', this.value)" ${purchPosted ? 'disabled' : ''}>
                </td>
                <td>
                    <input type="number" min="0" step="0.01" class="purch-cost-input" value="${v.cost || ''}" placeholder="السعر"
                        onchange="onPurchVariantFieldChange('${p.uid}', ${i}, 'cost', this.value)" ${purchPosted ? 'disabled' : ''}>
                </td>
                <td><strong style="color:var(--primary);">₪${lineTotal.toFixed(2)}</strong></td>
                <td><span class="badge ${newStock > 0 ? 'success' : 'danger'}">${newStock}</span></td>
                <td><strong>${newStock > 0 ? '₪' + newAvg.toFixed(2) : '—'}</strong></td>
                <td>
                    <button class="btn-icon danger" onclick="removeVariantFromPurchProduct('${p.uid}', ${i})" ${purchPosted ? 'disabled' : ''} title="حذف التركيبة">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>`;
            return rowHtml;
        }).join('');

        const colOptions = PURCH_COLORS.map(c => `<option value="${c[0]}">${c[0]}</option>`).join('');
        const sizeOptions = PURCH_SIZES.map(s => `<option value="${s}">${s}</option>`).join('');

        const totalBatchQty = p.variants.reduce((acc, v) => acc + (Number(v.qty) || 0), 0);
        const totalBatchCost = p.variants.reduce((acc, v) => acc + ((Number(v.qty) || 0) * (Number(v.cost) || 0)), 0);

        return `
            <article class="purch-product">
                <div class="purch-prod-head">
                    <div>
                        <h4>${p.name}</h4>
                        <div style="font-size:0.78rem;color:var(--gray);margin-top:2px;">
                            ${p.code ? `<span class="badge primary" style="font-size:0.7rem;padding:2px 6px;">${p.code}</span>` : ''} 
                            • ${p.category || 'ملابس'} 
                            • <span style="color:${p.isNew ? 'var(--warning)' : 'var(--success)'};font-weight:700;">${p.isNew ? 'منتج جديد — مسودة' : 'منتج موجود في المتجر'}</span>
                        </div>
                    </div>
                    <button class="btn btn-outline btn-sm" style="color:var(--danger);border-color:#fecaca;" onclick="removeProductFromPurchInvoice('${p.uid}')" ${purchPosted ? 'disabled' : ''}>
                        <i class="fas fa-times"></i> إزالة الصنف
                    </button>
                </div>
                <div class="purch-prod-body">
                    <div class="purch-prod-controls">
                        <div class="form-group">
                            <label style="font-size:0.78rem;margin-bottom:4px;">سعر البيع الافتراضي</label>
                            <input type="number" step="0.01" style="height:38px!important;" value="${p.retail || 0}"
                                onchange="onPurchProductControlChange('${p.uid}', 'retail', this.value)" ${purchPosted ? 'disabled' : ''}>
                        </div>
                        <div class="form-group">
                            <label style="font-size:0.78rem;margin-bottom:4px;">الحد الأدنى للبيع</label>
                            <input type="number" step="0.01" style="height:38px!important;" value="${p.min || 0}"
                                onchange="onPurchProductControlChange('${p.uid}', 'min', this.value)" ${purchPosted ? 'disabled' : ''}>
                        </div>
                        <div class="form-group">
                            <label style="font-size:0.78rem;margin-bottom:4px;">طبيعة المنتج</label>
                            <select style="height:38px!important;" onchange="onPurchProductControlChange('${p.uid}', 'mode', this.value)" ${purchPosted ? 'disabled' : ''}>
                                <option value="both" ${p.mode === 'both' ? 'selected' : ''}>لون ومقاس</option>
                                <option value="color" ${p.mode === 'color' ? 'selected' : ''}>لون فقط</option>
                                <option value="size" ${p.mode === 'size' ? 'selected' : ''}>مقاس فقط</option>
                                <option value="none" ${p.mode === 'none' ? 'selected' : ''}>بدون لون أو مقاس</option>
                            </select>
                        </div>
                    </div>

                    <div style="display:flex;justify-content:space-between;align-items:center;margin:12px 0 8px;font-size:0.85rem;font-weight:700;">
                        <span><i class="fas fa-layer-group text-primary"></i> تركيبات المنتج وكميات هذه الدفعة</span>
                        <small style="color:var(--gray);font-weight:normal;font-size:0.75rem;">سعر الوحدة هو سعر الشراء في هذه الفاتورة</small>
                    </div>

                    <div class="table-responsive" style="border:1px solid #e2e8f0;border-radius:10px;">
                        <table class="purch-variant-table">
                            <thead><tr>${headers}</tr></thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>

                    <div class="purch-tools">
                        ${colorMode ? `<select id="sel-col-${p.uid}">${colOptions}</select>` : ''}
                        ${sizeMode ? `<select id="sel-size-${p.uid}">${sizeOptions}</select>` : ''}
                        <button class="btn btn-outline btn-sm" onclick="addVariantToPurchProduct('${p.uid}')" ${purchPosted ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i> إضافة تركيبة / لون / مقاس
                        </button>
                    </div>

                    <div class="purch-metrics">
                        <div class="purch-metric-chip">كمية الدفعة: <b>${totalBatchQty}</b></div>
                        <div class="purch-metric-chip">قيمة المنتج: <b>₪${totalBatchCost.toFixed(2)}</b></div>
                        <div class="purch-metric-chip">عدد التركيبات: <b>${p.variants.length}</b></div>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function calcPurchTotals() {
    let totalItems = purchActiveItems.length;
    let totalQty = 0;
    let totalAmount = 0;

    purchActiveItems.forEach(p => {
        p.variants.forEach(v => {
            const q = Number(v.qty || 0);
            const c = Number(v.cost || 0);
            totalQty += q;
            totalAmount += (q * c);
        });
    });

    const paidInput = document.getElementById('purchPaid');
    const paid = Math.max(0, parseFloat(paidInput ? paidInput.value : 0) || 0);
    const remaining = Math.max(0, totalAmount - paid);

    const cView = document.getElementById('purchCountView');
    const qView = document.getElementById('purchQtyTotalView');
    const tView = document.getElementById('purchTotalView');
    const pView = document.getElementById('purchPaidView');
    const rView = document.getElementById('purchRemainingView');

    if (cView) cView.textContent = totalItems;
    if (qView) qView.textContent = totalQty;
    if (tView) tView.textContent = '₪' + totalAmount.toFixed(2);
    if (pView) pView.textContent = '₪' + paid.toFixed(2);
    if (rView) rView.textContent = '₪' + remaining.toFixed(2);

    return { totalItems, totalQty, totalAmount, paid, remaining };
}

function savePurchDraft(silent = false) {
    if (purchPosted) return;
    const draftData = {
        invoiceId: purchActiveInvoiceId,
        supplier: document.getElementById('purchSupplier')?.value || '',
        invoiceNo: document.getElementById('purchInvoiceNo')?.value || '',
        date: document.getElementById('purchDate')?.value || '',
        method: document.getElementById('purchMethod')?.value || 'cash',
        paid: document.getElementById('purchPaid')?.value || 0,
        note: document.getElementById('purchNote')?.value || '',
        bankName: document.getElementById('purchBankName')?.value || '',
        bankAccount: document.getElementById('purchBankAccount')?.value || '',
        bankRef: document.getElementById('purchBankRef')?.value || '',
        items: purchActiveItems,
        savedAt: new Date().toISOString()
    };

    localStorage.setItem('clothing_store_purch_draft', JSON.stringify(draftData));
    const statusBadge = document.getElementById('purchSaveStatus');
    if (statusBadge) {
        statusBadge.className = 'purch-status-badge saved';
        statusBadge.innerHTML = '<i class="fas fa-check"></i> تم حفظ المسودة محلياً';
    }
    renderPurchDraftBox();
    if (!silent) showToast('تم حفظ مسودة الفاتورة');
}

function loadPurchDraft() {
    const raw = localStorage.getItem('clothing_store_purch_draft');
    if (!raw) return false;
    try {
        const d = JSON.parse(raw);
        if (!d || !d.items) return false;
        purchActiveInvoiceId = d.invoiceId || purchActiveInvoiceId;
        if (document.getElementById('purchSupplier')) document.getElementById('purchSupplier').value = d.supplier || '';
        if (document.getElementById('purchInvoiceNo')) document.getElementById('purchInvoiceNo').value = d.invoiceNo || '';
        if (document.getElementById('purchDate')) document.getElementById('purchDate').value = d.date || '';
        if (document.getElementById('purchMethod')) document.getElementById('purchMethod').value = d.method || 'cash';
        if (document.getElementById('purchPaid')) document.getElementById('purchPaid').value = d.paid || 0;
        if (document.getElementById('purchNote')) document.getElementById('purchNote').value = d.note || '';
        if (document.getElementById('purchBankName')) document.getElementById('purchBankName').value = d.bankName || '';
        if (document.getElementById('purchBankAccount')) document.getElementById('purchBankAccount').value = d.bankAccount || '';
        if (document.getElementById('purchBankRef')) document.getElementById('purchBankRef').value = d.bankRef || '';

        const bankBox = document.getElementById('purchBankDetailsBox');
        if (bankBox) {
            bankBox.style.display = (d.method === 'bank' ? 'block' : 'none');
        }

        purchActiveItems = d.items || [];
        purchPosted = false;

        const statusBadge = document.getElementById('purchSaveStatus');
        if (statusBadge) {
            statusBadge.className = 'purch-status-badge saved';
            statusBadge.innerHTML = '<i class="fas fa-history"></i> تم استرجاع المسودة';
        }

        renderPurchProducts();
        calcPurchTotals();
        renderPurchDraftBox();
        return true;
    } catch (e) {
        return false;
    }
}

function discardPurchDraft() {
    if (!confirm('هل تريد حذف المسودة المحلية والبدء من جديد؟')) return;
    localStorage.removeItem('clothing_store_purch_draft');
    startNewPurchInvoice();
    showToast('تم حذف المسودة المحلية');
}

function renderPurchDraftBox() {
    const box = document.getElementById('purchDraftListView');
    if (!box) return;
    const raw = localStorage.getItem('clothing_store_purch_draft');
    if (!raw) {
        box.innerHTML = 'لا توجد مسودة محفوظة.';
        return;
    }
    try {
        const d = JSON.parse(raw);
        box.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                <div>
                    <strong style="display:block;color:var(--dark);">${d.invoiceNo || 'فاتورة بدون رقم'}</strong>
                    <small style="color:var(--gray);">${d.supplier || 'لم يحدد المورد'} · ${d.date || ''}</small>
                </div>
                <button class="btn btn-outline btn-sm" onclick="loadPurchDraft();showToast('تم استرجاع المسودة');">
                    استكمال
                </button>
            </div>
        `;
    } catch (e) {
        box.innerHTML = 'تعذر قراءة المسودة.';
    }
}

function startNewPurchInvoice() {
    purchActiveItems = [];
    purchPosted = false;
    purchActiveInvoiceId = 'INV-' + Math.floor(Math.random() * 9000 + 1000);

    if (document.getElementById('purchSupplier')) document.getElementById('purchSupplier').value = '';
    if (document.getElementById('purchInvoiceNo')) document.getElementById('purchInvoiceNo').value = 'SUP-' + Math.floor(Math.random() * 9000 + 1000);
    if (document.getElementById('purchDate')) document.getElementById('purchDate').value = new Date().toISOString().slice(0, 10);
    if (document.getElementById('purchMethod')) document.getElementById('purchMethod').value = 'cash';
    if (document.getElementById('purchPaid')) document.getElementById('purchPaid').value = '0';
    if (document.getElementById('purchNote')) document.getElementById('purchNote').value = '';
    if (document.getElementById('purchBankName')) document.getElementById('purchBankName').value = '';
    if (document.getElementById('purchBankAccount')) document.getElementById('purchBankAccount').value = '';
    if (document.getElementById('purchBankRef')) document.getElementById('purchBankRef').value = '';
    const bBox = document.getElementById('purchBankDetailsBox');
    if (bBox) bBox.style.display = 'none';

    const statusBadge = document.getElementById('purchSaveStatus');
    if (statusBadge) {
        statusBadge.className = 'purch-status-badge';
        statusBadge.innerHTML = 'مسودة — غير معتمدة';
    }

    renderPurchProducts();
    calcPurchTotals();
    renderPurchDraftBox();
}

function loadPurchDemo() {
    purchPosted = false;
    purchActiveInvoiceId = 'DEMO-1258';

    const supSel = document.getElementById('purchSupplier');
    if (supSel) {
        supSel.value = 'شركة الملابس المتحدة';
    }

    if (document.getElementById('purchInvoiceNo')) document.getElementById('purchInvoiceNo').value = 'SUP-1258';
    if (document.getElementById('purchDate')) document.getElementById('purchDate').value = new Date().toISOString().slice(0, 10);
    if (document.getElementById('purchMethod')) document.getElementById('purchMethod').value = 'partial';
    if (document.getElementById('purchPaid')) document.getElementById('purchPaid').value = 250;
    if (document.getElementById('purchNote')) document.getElementById('purchNote').value = 'فاتورة تجريبية تضم منتجات موجودة وجديدة';

    purchActiveItems = [
        {
            uid: 'UID-demo-1',
            catalogId: 1,
            name: 'تيشيرت Nike',
            code: 'NK-100',
            category: 'ملابس رجالية',
            retail: 50,
            min: 40,
            mode: 'both',
            isNew: false,
            variants: [
                { color: 'أحمر', hex: '#e34b54', size: 'M', stock: 7, avg: 18, qty: 5, cost: 20 },
                { color: 'أحمر', hex: '#e34b54', size: 'L', stock: 4, avg: 18.5, qty: 3, cost: 21 },
                { color: 'أحمر', hex: '#e34b54', size: 'XL', stock: 2, avg: 19, qty: 0, cost: 0 },
                { color: 'أسود', hex: '#222831', size: 'M', stock: 9, avg: 17, qty: 0, cost: 0 },
                { color: 'أسود', hex: '#222831', size: 'L', stock: 6, avg: 17.5, qty: 0, cost: 0 },
                { color: 'أسود', hex: '#222831', size: 'XL', stock: 3, avg: 18, qty: 0, cost: 0 }
            ]
        },
        {
            uid: 'UID-demo-2',
            catalogId: null,
            name: 'جاكيت شتوي بريميوم',
            code: 'JK-2026',
            category: 'ملابس رجالية',
            retail: 120,
            min: 95,
            mode: 'both',
            isNew: true,
            variants: [
                { color: 'أزرق', hex: '#3b82f6', size: 'M', stock: 0, avg: 0, qty: 6, cost: 48 },
                { color: 'أزرق', hex: '#3b82f6', size: 'L', stock: 0, avg: 0, qty: 4, cost: 50 },
                { color: 'أسود', hex: '#222831', size: 'M', stock: 0, avg: 0, qty: 3, cost: 47 }
            ]
        }
    ];

    renderPurchProducts();
    calcPurchTotals();
    savePurchDraft(true);
    showToast('تم تحميل مثال الفاتورة بنجاح!');
}

function exportPurchJSON() {
    const t = calcPurchTotals();
    const invoiceData = {
        invoiceId: purchActiveInvoiceId,
        supplier: document.getElementById('purchSupplier')?.value || '',
        invoiceNo: document.getElementById('purchInvoiceNo')?.value || '',
        date: document.getElementById('purchDate')?.value || '',
        method: document.getElementById('purchMethod')?.value || '',
        paid: t.paid,
        remaining: t.remaining,
        totals: t,
        items: purchActiveItems,
        exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(invoiceData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchase-invoice-${invoiceData.invoiceNo || 'draft'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('تم تصدير ملف الفاتورة بنجاح');
}

function requestConfirmPurchInvoice() {
    const sup = document.getElementById('purchSupplier')?.value || '';
    const invNo = (document.getElementById('purchInvoiceNo')?.value || '').trim();
    if (!sup) {
        showToast('يرجى اختيار المورد أولاً', 'error');
        return;
    }
    if (!invNo) {
        showToast('يرجى إدخال رقم فاتورة المورد', 'error');
        return;
    }
    const t = calcPurchTotals();
    if (purchActiveItems.length === 0 || t.totalQty <= 0) {
        showToast('يرجى إدخال كمية لمنتج واحد على الأقل', 'error');
        return;
    }
    if (t.paid > t.totalAmount) {
        showToast('المبلغ المدفوع لا يمكن أن يتجاوز إجمالي الفاتورة', 'error');
        return;
    }

    let missingCost = false;
    purchActiveItems.forEach(p => {
        p.variants.forEach(v => {
            if (Number(v.qty) > 0 && (!v.cost || Number(v.cost) <= 0)) {
                missingCost = true;
            }
        });
    });
    if (missingCost) {
        showToast('يرجى تحديد سعر الشراء لكل صنف تم إدخال كمية له', 'error');
        return;
    }

    openModal('purchConfirmModal');
}

function postPurchInvoice() {
    closeModal('purchConfirmModal');
    const sup = document.getElementById('purchSupplier')?.value || 'مورد عام';
    const invNo = (document.getElementById('purchInvoiceNo')?.value || '').trim();
    const date = document.getElementById('purchDate')?.value || new Date().toISOString().slice(0, 10);
    const method = document.getElementById('purchMethod')?.value || 'cash';
    const note = (document.getElementById('purchNote')?.value || '').trim();
    const t = calcPurchTotals();

    const products = getProducts();
    const purchases = getPurchases();
    let maxProdId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
    let maxPurchId = purchases.length > 0 ? Math.max(...purchases.map(p => p.id)) : 0;

    purchActiveItems.forEach(item => {
        item.variants.forEach(v => {
            const qty = Number(v.qty || 0);
            const cost = Number(v.cost || 0);
            if (qty <= 0) return;

            let prodRecord = products.find(p =>
                (p.name || '').toLowerCase() === (item.name || '').toLowerCase() &&
                (p.size || '') === (v.size || '') &&
                (p.color || '') === (v.color || '')
            );

            if (!prodRecord) {
                maxProdId++;
                prodRecord = {
                    id: maxProdId,
                    code: item.code || '#' + (100 + maxProdId),
                    name: item.name,
                    category: item.category || 'عام',
                    size: v.size || '',
                    color: v.color || '',
                    base_cost: cost,
                    price: Number(item.retail) || (cost * 1.5),
                    image: null
                };
                products.push(prodRecord);
            } else {
                if (item.retail && Number(item.retail) > 0) {
                    prodRecord.price = Number(item.retail);
                }
                prodRecord.base_cost = cost;
            }

            maxPurchId++;
            purchases.push({
                id: maxPurchId,
                invoice_id: invNo,
                product_id: prodRecord.id,
                product_name: prodRecord.name,
                size: prodRecord.size || '',
                color: prodRecord.color || '',
                quantity: qty,
                unit_cost: cost,
                total_cost: qty * cost,
                supplier: sup,
                payment_method: method,
                bank_name: (document.getElementById('purchBankName')?.value || '').trim() || null,
                bank_account: (document.getElementById('purchBankAccount')?.value || '').trim() || null,
                bank_ref: (document.getElementById('purchBankRef')?.value || '').trim() || null,
                note: note || `توريد من فاتورة ${invNo}`,
                created_at: new Date(date).toISOString()
            });
        });
    });

    saveProducts(products);
    savePurchases(purchases);

    const merchants = typeof getMerchants === 'function' ? getMerchants() : [];
    let merchant = merchants.find(m => m.name === sup);
    if (!merchant && sup) {
        let maxMId = merchants.length > 0 ? Math.max(...merchants.map(m => m.id)) : 0;
        merchant = { id: maxMId + 1, name: sup, phone: '', balance: 0 };
        merchants.push(merchant);
        if (typeof saveMerchants === 'function') saveMerchants(merchants);
    }

    if (sup && typeof getMerchantTransactions === 'function' && typeof saveMerchantTransactions === 'function') {
        const txs = getMerchantTransactions();
        let maxTxId = txs.length > 0 ? Math.max(...txs.map(x => x.id)) : 0;

        maxTxId++;
        txs.push({
            id: maxTxId,
            merchant_name: sup,
            type: 'invoice',
            reference: invNo,
            amount: t.totalAmount,
            note: note || `فاتورة مشتريات #${invNo}`,
            created_at: new Date(date).toISOString()
        });

        if (t.paid > 0) {
            maxTxId++;
            txs.push({
                id: maxTxId,
                merchant_name: sup,
                type: 'payment',
                reference: 'PAY-' + invNo,
                amount: t.paid,
                note: `دفعة لفاتورة مشتريات #${invNo}`,
                created_at: new Date(date).toISOString()
            });
        }
        saveMerchantTransactions(txs);
    }

    localStorage.removeItem('clothing_store_purch_draft');
    purchPosted = true;

    showToast('🎉 تم اعتماد فاتورة المشتريات وتحديث المخزون بنجاح!', 'success');

    fillAllDropdowns();
    fillPurchSuppliers();
    loadPurchasesTable();
    loadInventoryTable();
    loadPosProducts();
    loadDashboard();
    loadReports();

    setTimeout(() => {
        startNewPurchInvoice();
    }, 1200);
}

function deletePurchaseInvoice(invId) {
    if (!confirm('هل أنت متأكد من حذف هذه الفاتورة بالكامل؟ سيتم إعادة حساب المخزون.')) return;
    
    const purchases = getPurchases().filter(p => (p.invoice_id || 'OLD-' + p.id) !== invId);
    savePurchases(purchases);
    
    showToast('✅ تم حذف الفاتورة');
    fillAllDropdowns();
    loadPurchasesTable();
    loadInventoryTable();
    loadPosProducts();
    loadDashboard();
}

function loadPurchasesTable() {
    const tbody = document.getElementById('purchasesTableBody');
    if (!tbody) return;
    
    const purchases = getPurchases();
    
    if (purchases.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty">لا توجد فواتير مشتريات مسجلة</td></tr>';
        return;
    }

    const invoicesMap = {};
    purchases.forEach(p => {
        const invId = p.invoice_id || 'OLD-' + p.id; 
        if (!invoicesMap[invId]) {
            invoicesMap[invId] = {
                id: invId,
                date: p.created_at,
                supplier: p.supplier || '-',
                note: p.note || '',
                itemsCount: 0,
                totalQty: 0,
                totalCost: 0,
                items: []
            };
        }
        invoicesMap[invId].itemsCount++;
        invoicesMap[invId].totalQty += Number(p.quantity);
        invoicesMap[invId].totalCost += Number(p.total_cost);
        invoicesMap[invId].items.push(p);
    });

    const invoices = Object.values(invoicesMap).sort((a, b) => new Date(b.date) - new Date(a.date));

    tbody.innerHTML = invoices.map((inv) => `
        <tr>
            <td><strong style="color:var(--primary);font-family:monospace;font-size:0.95rem;">#${inv.id}</strong></td>
            <td style="font-size:.82rem;">${new Date(inv.date).toLocaleDateString('ar-EG')}</td>
            <td><strong>${inv.supplier}</strong> ${inv.note ? '<br><small style="color:var(--gray); font-size:0.75rem;">' + inv.note + '</small>' : ''}</td>
            <td><span class="badge primary">${inv.itemsCount} أصناف</span></td>
            <td><span class="badge success">${inv.totalQty} قطع</span></td>
            <td><strong style="color:var(--primary);font-size:0.95rem;">₪${inv.totalCost.toFixed(2)}</strong></td>
            <td>
                <div style="display:flex;gap:6px;">
                    <button class="btn-icon" onclick="viewPurchaseInvoiceDetails('${inv.id}')" title="عرض تفاصيل الفاتورة">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon danger" onclick="deletePurchaseInvoice('${inv.id}')" title="حذف الفاتورة بالكامل">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function viewPurchaseInvoiceDetails(invId) {
    const purchases = getPurchases().filter(p => (p.invoice_id || 'OLD-' + p.id) === invId);
    if (purchases.length === 0) {
        showToast('لم يتم العثور على بيانات الفاتورة', 'error');
        return;
    }

    const first = purchases[0];
    const totalQty = purchases.reduce((s, p) => s + Number(p.quantity), 0);
    const totalCost = purchases.reduce((s, p) => s + Number(p.total_cost), 0);

    const titleEl = document.getElementById('purchModalTitle');
    if (titleEl) {
        titleEl.innerHTML = `<i class="fas fa-file-invoice text-primary"></i> فاتورة مشتريات #${invId}`;
    }

    const bodyEl = document.getElementById('purchInvoiceDetailsBody');
    if (!bodyEl) return;

    let rowsHtml = purchases.map((p, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${p.product_name}</strong></td>
            <td>${p.size || '—'}</td>
            <td>${p.color || '—'}</td>
            <td><span class="badge success">${p.quantity}</span></td>
            <td>₪${Number(p.unit_cost).toFixed(2)}</td>
            <td><strong>₪${Number(p.total_cost).toFixed(2)}</strong></td>
        </tr>
    `).join('');

    bodyEl.innerHTML = `
        <div style="background:#f8fafc;padding:14px;border-radius:12px;margin-bottom:16px;border:1px solid #e2e8f0;display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:10px;">
            <div><span style="color:var(--gray);font-size:0.8rem;">رقم الفاتورة:</span> <strong style="display:block;">#${invId}</strong></div>
            <div><span style="color:var(--gray);font-size:0.8rem;">المورد:</span> <strong style="display:block;">${first.supplier || 'مورد عام'}</strong></div>
            <div><span style="color:var(--gray);font-size:0.8rem;">التاريخ:</span> <strong style="display:block;">${new Date(first.created_at).toLocaleDateString('ar-EG')}</strong></div>
            <div><span style="color:var(--gray);font-size:0.8rem;">طريقة الدفع:</span> <strong style="display:block;">${first.payment_method === 'bank' ? 'تحويل بنكي / محفظة' : (first.payment_method === 'credit' ? 'آجل' : 'نقدي')}</strong></div>
            ${first.bank_name ? `<div><span style="color:var(--gray);font-size:0.8rem;">البنك:</span> <strong style="display:block;">${first.bank_name}</strong></div>` : ''}
            ${first.bank_ref ? `<div><span style="color:var(--gray);font-size:0.8rem;">رقم الحوالة:</span> <strong style="display:block;">${first.bank_ref}</strong></div>` : ''}
        </div>

        <div class="table-responsive" style="max-height:300px;overflow-y:auto;border:1px solid #e2e8f0;border-radius:10px;">
            <table>
                <thead>
                    <tr><th>#</th><th>المنتج</th><th>المقاس</th><th>اللون</th><th>الكمية</th><th>سعر الشراء</th><th>الإجمالي</th></tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;background:#eef2ff;padding:12px 16px;border-radius:10px;margin-top:14px;">
            <div><span>إجمالي القطع: </span><strong style="color:var(--primary);">${totalQty} قطعة</strong></div>
            <div><span>التكلفة الإجمالية: </span><strong style="color:var(--primary);font-size:1.15rem;">₪${totalCost.toFixed(2)}</strong></div>
        </div>
    `;

    const printBtn = document.getElementById('purchPrintBtn');
    if (printBtn) {
        printBtn.onclick = () => printPurchaseInvoice(invId);
    }

    openModal('purchInvoiceDetailsModal');
}

function printPurchaseInvoice(invId) {
    const purchases = getPurchases().filter(p => (p.invoice_id || 'OLD-' + p.id) === invId);
    if (purchases.length === 0) return;
    const first = purchases[0];
    const totalCost = purchases.reduce((s, p) => s + Number(p.total_cost), 0);

    const itemsHTML = purchases.map(p => `
        <tr>
            <td>${p.product_name} (${p.size || '-'} ${p.color ? '• ' + p.color : ''})</td>
            <td>${p.quantity}</td>
            <td>₪${Number(p.unit_cost).toFixed(2)}</td>
            <td>₪${Number(p.total_cost).toFixed(2)}</td>
        </tr>
    `).join('');

    const w = window.open('', '_blank', 'width=500,height=700');
    w.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>فاتورة توريد مشتريات #${invId}</title>
            <style>
                body{font-family:'Cairo',sans-serif;padding:24px;max-width:480px;margin:0 auto}
                h2{text-align:center;margin:0 0 5px}
                .meta{font-size:13px;color:#475569;margin-bottom:15px;line-height:1.8;border-bottom:1px solid #e2e8f0;padding-bottom:10px;}
                table{width:100%;border-collapse:collapse;font-size:13px;margin:15px 0}
                th{background:#f1f5f9;padding:8px;text-align:right}
                td{padding:8px;border-bottom:1px solid #eee}
                .total{font-size:18px;font-weight:bold;text-align:left;margin-top:15px;padding-top:10px;border-top:2px solid #000}
            </style>
        </head>
        <body>
            <h2>متجر الأناقة للملابس</h2>
            <div style="text-align:center;color:#64748b;font-size:12px;margin-bottom:10px;">سند استلام بضاعة / فاتورة مشتريات</div>
            <div class="meta">
                <strong>رقم الفاتورة:</strong> #${invId}<br>
                <strong>المورد:</strong> ${first.supplier || 'مورد عام'}<br>
                <strong>التاريخ:</strong> ${new Date(first.created_at).toLocaleString('ar-EG')}<br>
            </div>
            <table>
                <thead>
                    <tr><th>الصنف</th><th>الكمية</th><th>سعر الوحدة</th><th>الإجمالي</th></tr>
                </thead>
                <tbody>${itemsHTML}</tbody>
            </table>
            <div class="total">الإجمالي الكلي: ₪${totalCost.toFixed(2)}</div>
        </body>
        </html>
    `);
    w.document.close();
    setTimeout(() => w.print(), 500);
}

/* ============================================
   19. ديون العملاء
   ============================================ */
function loadDebtsTable() {
    const summary = getCustomerDebtSummary();
    const tbody = document.getElementById('debtsTableBody');
    const search = (document.getElementById('debtsSearch')?.value || '').toLowerCase().trim();

    let totalDebt = 0, totalPaid = 0, totalBalance = 0, customerCount = 0;

    Object.values(summary).forEach(c => {
        totalDebt += c.totalDebt;
        totalPaid += c.totalPaid;
        if (c.balance > 0) {
            totalBalance += c.balance;
            customerCount++;
        }
    });

    document.getElementById('debtsStatsGrid').innerHTML = `
        <div class="stat-card"><div class="stat-icon danger"><i class="fas fa-hand-holding-usd"></i></div><div class="stat-label">إجمالي الديون</div><div class="stat-value">₪${totalDebt.toFixed(2)}</div></div>
        <div class="stat-card"><div class="stat-icon success"><i class="fas fa-check-circle"></i></div><div class="stat-label">المدفوعات</div><div class="stat-value">₪${totalPaid.toFixed(2)}</div></div>
        <div class="stat-card"><div class="stat-icon warning"><i class="fas fa-hourglass-half"></i></div><div class="stat-label">المتبقي</div><div class="stat-value" style="color:var(--danger);">₪${totalBalance.toFixed(2)}</div></div>
        <div class="stat-card"><div class="stat-icon info"><i class="fas fa-users"></i></div><div class="stat-label">عدد المدينين</div><div class="stat-value">${customerCount}</div></div>
    `;

    let customers = Object.values(summary).filter(c => c.balance > 0.01);

    if (search) {
        customers = customers.filter(c =>
            c.name.toLowerCase().includes(search) ||
            (c.phone || '').toLowerCase().includes(search)
        );
    }

    const datalist = document.getElementById('customerList');
    if (datalist) {
        datalist.innerHTML = Object.values(summary)
            .filter(c => c.balance > 0.01)
            .map(c => `<option value="${c.name}">${c.phone}</option>`)
            .join('');
    }

    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty">لا توجد ديون</td></tr>';
        return;
    }

    tbody.innerHTML = customers.map(c => `
        <tr>
            <td><strong>${c.name}</strong></td>
            <td dir="ltr">${c.phone}</td>
            <td>₪${c.totalDebt.toFixed(2)}</td>
            <td style="color:var(--success);">₪${c.totalPaid.toFixed(2)}</td>
            <td><strong style="color:var(--danger);font-size:1.05rem;">₪${c.balance.toFixed(2)}</strong></td>
            <td>
                <button class="btn-icon" onclick="viewCustomerStatement('${c.name}', '${c.phone}')" title="كشف حساب">
                    <i class="fas fa-file-alt"></i>
                </button>
                <button class="btn-icon success" onclick="quickPay('${c.name}', ${c.balance})" title="دفعة سريعة">
                    <i class="fas fa-money-bill-wave"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function quickPay(customerName, balance) {
    const amount = prompt(
        `تسجيل دفعة من ${customerName}\n\nالمتبقي: ₪${balance.toFixed(2)}\n\nأدخل المبلغ المدفوع:`,
        balance.toFixed(2)
    );
    if (!amount) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        showToast('قيمة غير صحيحة', 'error');
        return;
    }

    const debts = getCustomerDebts();
    const customer = debts.find(d => d.customer_name === customerName);
    const phone = customer ? customer.customer_phone : '';

    debts.push({
        id: debts.length > 0 ? Math.max(...debts.map(d => d.id)) + 1 : 1,
        customer_name: customerName,
        customer_phone: phone,
        type: 'payment',
        amount: parsedAmount,
        note: 'دفعة',
        created_at: new Date().toISOString(),
    });
    saveCustomerDebts(debts);

    showToast(`✅ تم تسجيل دفعة ₪${parsedAmount.toFixed(2)} من ${customerName}`);
    loadDebtsTable();
    loadDashboard();
    loadReports();
}

function saveCustomerPayment() {
    const name = document.getElementById('debtPayName').value.trim();
    const amount = parseFloat(document.getElementById('debtPayAmount').value);
    const note = document.getElementById('debtPayNote').value.trim();

    if (!name || isNaN(amount) || amount <= 0) {
        showToast('يرجى ملء الحقول', 'error');
        return;
    }

    const debts = getCustomerDebts();
    const customer = debts.find(d => d.customer_name === name);
    const phone = customer ? customer.customer_phone : '';

    debts.push({
        id: debts.length > 0 ? Math.max(...debts.map(d => d.id)) + 1 : 1,
        customer_name: name,
        customer_phone: phone,
        type: 'payment',
        amount: amount,
        note: note || 'دفعة نقدية',
        created_at: new Date().toISOString(),
    });
    saveCustomerDebts(debts);

    document.getElementById('debtPayName').value = '';
    document.getElementById('debtPayAmount').value = '';
    document.getElementById('debtPayNote').value = '';

    showToast('✅ تم تسجيل الدفعة');
    loadDebtsTable();
    loadDashboard();
    loadReports();
}

function viewCustomerStatement(name, phone) {
    const transactions = getCustomerDebts()
        .filter(d => d.customer_name === name && d.customer_phone === phone)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    let running = 0;
    let html = `كشف حساب: ${name}\nالهاتف: ${phone}\n\n━━━━━━━━━━━━━━━━\n\n`;

    transactions.forEach(t => {
        if (t.type === 'invoice') running += Number(t.amount);
        else running -= Number(t.amount);

        html += `📅 ${new Date(t.created_at).toLocaleDateString('ar-EG')}\n`;
        html += `${t.type === 'invoice' ? '📄 دين' : '💰 دفعة'}: ₪${Number(t.amount).toFixed(2)}\n`;
        if (t.note) html += `📝 ${t.note}\n`;
        html += `الرصيد: ₪${running.toFixed(2)}\n\n`;
    });

    html += `━━━━━━━━━━━━━━━━\n`;
    html += `الرصيد النهائي: ₪${running.toFixed(2)}`;

    alert(html);
}

/* ============================================
   20. الموظفين
   ============================================ */
function loadEmployeesTable() {
    const tbody = document.getElementById('employeesTableBody');
    const users = getUsers().filter(u => u.role !== 'owner');

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty">لا يوجد موظفون</td></tr>';
        return;
    }

    tbody.innerHTML = users.map((u, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${u.name}</strong></td>
            <td>${u.email}</td>
            <td><span class="badge ${u.role === 'manager' ? 'info' : 'primary'}">${u.role === 'manager' ? 'مدير فرع' : 'كاشير'}</span></td>
            <td>${u.branch_id ? getBranchName(u.branch_id) : '-'}</td>
            <td>
                <button class="btn-icon" onclick="editEmployee(${u.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger" onclick="deleteEmployee(${u.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function openEmployeeModal() {
    document.getElementById('employeeModalTitle').textContent = 'موظف جديد';
    document.getElementById('employeeId').value = '';
    document.getElementById('emp-name').value = '';
    document.getElementById('emp-email').value = '';
    document.getElementById('emp-password').value = '';
    document.getElementById('emp-role').value = 'cashier';
    fillAllDropdowns();
    document.getElementById('employeeModal').classList.add('show');
}

function editEmployee(id) {
    const u = getUsers().find(x => x.id === id);
    if (!u) return;

    document.getElementById('employeeModalTitle').textContent = 'تعديل موظف';
    document.getElementById('employeeId').value = u.id;
    document.getElementById('emp-name').value = u.name;
    document.getElementById('emp-email').value = u.email;
    document.getElementById('emp-password').value = u.password;
    document.getElementById('emp-role').value = u.role;
    fillAllDropdowns();
    document.getElementById('emp-branch').value = u.branch_id || '';
    document.getElementById('employeeModal').classList.add('show');
}

function saveEmployee(e) {
    e.preventDefault();

    const id = document.getElementById('employeeId').value;
    const name = document.getElementById('emp-name').value.trim();
    const email = document.getElementById('emp-email').value.trim();
    const password = document.getElementById('emp-password').value;
    const role = document.getElementById('emp-role').value;
    const branch_id = parseInt(document.getElementById('emp-branch').value) || null;

    if (!name || !email || !password) {
        showToast('يرجى ملء الحقول', 'error');
        return;
    }

    const users = getUsers();

    if (id) {
        const index = users.findIndex(u => u.id === parseInt(id));
        if (index !== -1) {
            users[index] = { ...users[index], name, email, password, role, branch_id };
        }
        showToast('تم تحديث الموظف');
    } else {
        const employeesCount = users.filter(u => u.role !== 'owner').length;
        if (IS_DEMO && employeesCount >= DEMO_LIMITS.employees) {
            showDemoLimit('موظف', DEMO_LIMITS.employees);
            return;
        }

        const emailExists = users.find(u => u.email === email);
        if (emailExists) {
            showToast('البريد مستخدم مسبقاً', 'error');
            return;
        }

        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        users.push({ id: newId, name, email, password, role, branch_id });
        showToast('تمت إضافة الموظف');
    }

    saveUsers(users);
    closeModal('employeeModal');
    loadEmployeesTable();
}

function deleteEmployee(id) {
    if (!confirm('حذف هذا الموظف؟')) return;
    saveUsers(getUsers().filter(u => u.id !== id));
    loadEmployeesTable();
    showToast('تم حذف الموظف');
}

/* ============================================
   21. الفروع
   ============================================ */
function loadBranchesTable() {
    const tbody = document.getElementById('branchesTableBody');
    const branches = getBranches();

    if (branches.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty">لا توجد فروع</td></tr>';
        return;
    }

    tbody.innerHTML = branches.map((b, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${b.name}</strong></td>
            <td><span class="badge primary">${b.code || '-'}</span></td>
            <td>${b.phone || '-'}</td>
            <td>${b.address || '-'}</td>
            <td>
                <button class="btn-icon" onclick="editBranch(${b.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger" onclick="deleteBranch(${b.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function openBranchModal() {
    document.getElementById('branchModalTitle').textContent = 'فرع جديد';
    document.getElementById('branchId').value = '';
    ['br-name', 'br-code', 'br-phone', 'br-address'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('branchModal').classList.add('show');
}

function editBranch(id) {
    const b = getBranches().find(x => x.id === id);
    if (!b) return;

    document.getElementById('branchModalTitle').textContent = 'تعديل فرع';
    document.getElementById('branchId').value = b.id;
    document.getElementById('br-name').value = b.name;
    document.getElementById('br-code').value = b.code || '';
    document.getElementById('br-phone').value = b.phone || '';
    document.getElementById('br-address').value = b.address || '';
    document.getElementById('branchModal').classList.add('show');
}

function saveBranch(e) {
    e.preventDefault();

    const id = document.getElementById('branchId').value;
    const name = document.getElementById('br-name').value.trim();
    const code = document.getElementById('br-code').value.trim();
    const phone = document.getElementById('br-phone').value.trim();
    const address = document.getElementById('br-address').value.trim();

    if (!name) {
        showToast('أدخل اسم الفرع', 'error');
        return;
    }

    const branches = getBranches();

    if (id) {
        const index = branches.findIndex(b => b.id === parseInt(id));
        if (index !== -1) {
            branches[index] = { ...branches[index], name, code, phone, address };
        }
        showToast('تم تحديث الفرع');
    } else {
        if (IS_DEMO && branches.length >= DEMO_LIMITS.branches) {
            showDemoLimit('فرع', DEMO_LIMITS.branches);
            return;
        }

        const newId = branches.length > 0 ? Math.max(...branches.map(b => b.id)) + 1 : 1;
        branches.push({ id: newId, name, code, phone, address });
        showToast('تمت إضافة الفرع');
    }

    saveBranches(branches);
    closeModal('branchModal');
    loadBranchesTable();
    fillAllDropdowns();
}

function deleteBranch(id) {
    if (!confirm('حذف هذا الفرع؟')) return;
    saveBranches(getBranches().filter(b => b.id !== id));
    loadBranchesTable();
    showToast('تم حذف الفرع');
}

/* ============================================
   22. حسابات التجار
   ============================================ */
function loadMerchantsTable() {
    const summary = getMerchantSummary();
    const tbody = document.getElementById('merchantsTableBody');

    const totalInvoices = Object.values(summary).reduce((s, m) => s + m.totalInvoices, 0);
    const totalPaid = Object.values(summary).reduce((s, m) => s + m.totalPaid, 0);
    const totalBalance = totalInvoices - totalPaid;

    document.getElementById('merchantStatsGrid').innerHTML = `
        <div class="stat-card"><div class="stat-icon warning"><i class="fas fa-file-invoice"></i></div><div class="stat-label">إجمالي الفواتير</div><div class="stat-value">₪${totalInvoices.toFixed(2)}</div></div>
        <div class="stat-card"><div class="stat-icon success"><i class="fas fa-check-circle"></i></div><div class="stat-label">المدفوعات</div><div class="stat-value">₪${totalPaid.toFixed(2)}</div></div>
        <div class="stat-card"><div class="stat-icon danger"><i class="fas fa-hourglass-half"></i></div><div class="stat-label">الرصيد المتبقي</div><div class="stat-value" style="color:var(--danger);">₪${totalBalance.toFixed(2)}</div></div>
    `;

    const merchants = Object.values(summary);

    if (merchants.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty">لا توجد حسابات تجار</td></tr>';
        return;
    }

    tbody.innerHTML = merchants.map(m => `
        <tr>
            <td><strong>${m.name}</strong></td>
            <td>₪${m.totalInvoices.toFixed(2)}</td>
            <td>₪${m.totalPaid.toFixed(2)}</td>
            <td><strong style="color:${m.balance > 0 ? 'var(--danger)' : 'var(--success)'};">₪${m.balance.toFixed(2)}</strong></td>
            <td>
                <button class="btn-icon" onclick="viewMerchantStatement('${m.name}')" title="كشف حساب">
                    <i class="fas fa-file-alt"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function saveMerchantInvoice() {
    const name = document.getElementById('m-name').value.trim();
    const ref = document.getElementById('m-ref').value.trim() || 'INV-' + Date.now();
    const amount = parseFloat(document.getElementById('m-amount').value);
    const note = document.getElementById('m-note').value.trim();

    if (!name || isNaN(amount) || amount <= 0) {
        showToast('يرجى ملء الحقول', 'error');
        return;
    }

    const tx = getMerchantTx();
    if (IS_DEMO && tx.length >= DEMO_LIMITS.merchants) {
        showDemoLimit('معاملة تاجر', DEMO_LIMITS.merchants);
        return;
    }

    tx.push({
        id: tx.length > 0 ? Math.max(...tx.map(t => t.id)) + 1 : 1,
        merchant_name: name,
        type: 'invoice',
        reference: ref,
        amount,
        note,
        created_at: new Date().toISOString(),
    });
    saveMerchantTx(tx);

    ['m-name', 'm-ref', 'm-amount', 'm-note'].forEach(id => {
        document.getElementById(id).value = '';
    });

    showToast('تم تسجيل الفاتورة');
    loadMerchantsTable();
}

function saveMerchantPayment() {
    const name = document.getElementById('pay-name').value.trim();
    const amount = parseFloat(document.getElementById('pay-amount').value);
    const note = document.getElementById('pay-note').value.trim();

    if (!name || isNaN(amount) || amount <= 0) {
        showToast('يرجى ملء الحقول', 'error');
        return;
    }

    const tx = getMerchantTx();
    tx.push({
        id: tx.length > 0 ? Math.max(...tx.map(t => t.id)) + 1 : 1,
        merchant_name: name,
        type: 'payment',
        reference: 'PAY-' + Date.now(),
        amount,
        note,
        created_at: new Date().toISOString(),
    });
    saveMerchantTx(tx);

    ['pay-name', 'pay-amount', 'pay-note'].forEach(id => {
        document.getElementById(id).value = '';
    });

    showToast('تم تسجيل الدفعة');
    loadMerchantsTable();
}

function viewMerchantStatement(name) {
    const transactions = getMerchantTx()
        .filter(t => t.merchant_name === name)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    let running = 0;
    let html = `كشف حساب التاجر: ${name}\n\n━━━━━━━━━━━━━━━━\n\n`;

    transactions.forEach(t => {
        if (t.type === 'invoice') running += Number(t.amount);
        else running -= Number(t.amount);

        html += `📅 ${new Date(t.created_at).toLocaleDateString('ar-EG')}\n`;
        html += `${t.type === 'invoice' ? '📄 فاتورة' : '💰 دفعة'}: ₪${Number(t.amount).toFixed(2)}\n`;
        html += `الرصيد: ₪${running.toFixed(2)}\n\n`;
    });

    html += `━━━━━━━━━━━━━━━━\n`;
    html += `الرصيد النهائي: ₪${running.toFixed(2)}`;

    alert(html);
}

/* ============================================
   23. المصروفات
   ============================================ */
function saveFixedExpense() {
    const type = document.getElementById('fixed-type').value;
    const amount = parseFloat(document.getElementById('fixed-amount').value);
    const period = document.getElementById('fixed-period').value.trim();

    if (isNaN(amount) || amount <= 0) {
        showToast('أدخل مبلغاً صحيحاً', 'error');
        return;
    }

    const expenses = getFixedExpenses();
    if (IS_DEMO && expenses.length >= DEMO_LIMITS.expenses) {
        showDemoLimit('مصروف', DEMO_LIMITS.expenses);
        return;
    }

    expenses.push({
        id: expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1,
        type, amount, period,
        created_at: new Date().toISOString(),
    });
    saveFixedExpenses(expenses);

    document.getElementById('fixed-amount').value = '';
    document.getElementById('fixed-period').value = '';

    showToast('تم حفظ المصروف');
    loadExpensesTable();
}

function saveVariableExpense() {
    const category = document.getElementById('variable-category').value;
    const amount = parseFloat(document.getElementById('variable-amount').value);
    const reason = document.getElementById('variable-reason').value.trim();

    if (isNaN(amount) || amount <= 0 || !reason) {
        showToast('يرجى ملء الحقول', 'error');
        return;
    }

    const expenses = getVariableExpenses();
    expenses.push({
        id: expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1,
        category, amount, reason,
        created_at: new Date().toISOString(),
    });
    saveVariableExpenses(expenses);

    document.getElementById('variable-amount').value = '';
    document.getElementById('variable-reason').value = '';

    showToast('تم حفظ المصروف');
    loadExpensesTable();
}

function loadExpensesTable() {
    const fixed = getFixedExpenses();
    const variable = getVariableExpenses();
    const totalFixed = fixed.reduce((s, e) => s + Number(e.amount), 0);
    const totalVariable = variable.reduce((s, e) => s + Number(e.amount), 0);

    document.getElementById('expensesStatsGrid').innerHTML = `
        <div class="stat-card"><div class="stat-icon warning"><i class="fas fa-home"></i></div><div class="stat-label">المصروفات الثابتة</div><div class="stat-value">₪${totalFixed.toFixed(2)}</div></div>
        <div class="stat-card"><div class="stat-icon danger"><i class="fas fa-bolt"></i></div><div class="stat-label">المصروفات المتغيرة</div><div class="stat-value">₪${totalVariable.toFixed(2)}</div></div>
        <div class="stat-card"><div class="stat-icon info"><i class="fas fa-calculator"></i></div><div class="stat-label">الإجمالي</div><div class="stat-value">₪${(totalFixed + totalVariable).toFixed(2)}</div></div>
    `;

    const all = [
        ...fixed.map(e => ({ ...e, _type: 'ثابت', _label: e.type + (e.period ? ' - ' + e.period : '') })),
        ...variable.map(e => ({ ...e, _type: 'متغير', _label: e.category + ' - ' + e.reason })),
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const tbody = document.getElementById('expensesTableBody');

    if (all.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty">لا توجد مصروفات</td></tr>';
        return;
    }

    tbody.innerHTML = all.map(e => `
        <tr>
            <td style="font-size:.8rem;">${new Date(e.created_at).toLocaleDateString('ar-EG')}</td>
            <td><span class="badge ${e._type === 'ثابت' ? 'warning' : 'danger'}">${e._type}</span></td>
            <td>${e._label}</td>
            <td><strong>₪${Number(e.amount).toFixed(2)}</strong></td>
            <td>
                <button class="btn-icon danger" onclick="deleteExpense('${e._type}', ${e.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function deleteExpense(type, id) {
    if (!confirm('حذف هذا المصروف؟')) return;

    if (type === 'ثابت') {
        saveFixedExpenses(getFixedExpenses().filter(e => e.id !== id));
    } else {
        saveVariableExpenses(getVariableExpenses().filter(e => e.id !== id));
    }

    loadExpensesTable();
    showToast('تم الحذف');
}

/* ============================================
   24. التقارير
   ============================================ */
let topChart = null;

function loadReports() {
    const actualRevenue = getActualRevenue();
    const cash = getCashRevenue();
    const receivables = getReceivables();
    const debtPayments = getDebtPaymentsReceived();

    const cogs = getCOGS();
    const expenses = getTotalExpenses();
    const netProfit = getNetProfit();

    document.getElementById('repRevenue').textContent = '₪' + actualRevenue.toFixed(2);
    document.getElementById('repCOGS').textContent = '₪' + cogs.toFixed(2);
    document.getElementById('repExpenses').textContent = '₪' + expenses.total.toFixed(2);
    document.getElementById('repNetProfit').textContent = '₪' + netProfit.toFixed(2);

    if (document.getElementById('repCashRevenue')) {
        document.getElementById('repCashRevenue').textContent = '₪' + cash.toFixed(2);
    }
    if (document.getElementById('repDebtPayments')) {
        document.getElementById('repDebtPayments').textContent = '₪' + debtPayments.toFixed(2);
    }
    if (document.getElementById('repReceivables')) {
        document.getElementById('repReceivables').textContent = '₪' + receivables.toFixed(2);
    }

    const productSales = {};
    getActiveSales().forEach(sale => {
        (sale.items || []).forEach(item => {
            productSales[item.name] = (productSales[item.name] || 0) + Number(item.quantity);
        });
    });

    const sorted = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);

    if (topChart) topChart.destroy();

    const ctx = document.getElementById('topProductsChart').getContext('2d');
    topChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(i => i[0]),
            datasets: [{
                label: 'الكمية المباعة',
                data: sorted.map(i => i[1]),
                backgroundColor: '#4f46e5',
                borderRadius: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: { legend: { display: false } }
        }
    });

    const out = getOutOfStockProducts();
    const loss = getLossProducts();

    document.getElementById('outOfStockAlerts').innerHTML = out.length === 0
        ? '✅ لا توجد منتجات نافذة'
        : out.map(p => `• ${p.name} (${p.size || '-'})`).join('<br>');

    document.getElementById('lossProductAlerts').innerHTML = loss.length === 0
        ? '✅ لا توجد منتجات خاسرة'
        : loss.map(p => `• ${p.name} - السعر: ₪${p.price} / التكلفة: ₪${getProductAvgCost(p.id).toFixed(2)}`).join('<br>');
}

/* ============================================
   25. طلبات الموقع (Online Orders) - محاكاة
   ============================================ */
let mockOnlineOrders = [];

function simulateNewOnlineOrder() {
    const products = getProducts();
    if(products.length === 0) {
        showToast('يجب إضافة منتجات للمخزون أولاً', 'error');
        return;
    }
    const p = products[Math.floor(Math.random() * products.length)];
    const qty = Math.floor(Math.random() * 3) + 1;

    const demoCustomers = [
        { name: 'أحمد خليل', phone: '0599123456' },
        { name: 'سارة يوسف', phone: '0599876543' },
        { name: 'محمود عثمان', phone: '0568112233' },
        { name: 'ليلى إبراهيم', phone: '0598445566' },
        { name: 'طارق الزين', phone: '0569778899' },
        { name: 'زبون تجريبي', phone: '0599001122' }
    ];
    const cust = demoCustomers[Math.floor(Math.random() * demoCustomers.length)];
    
    mockOnlineOrders.push({
        id: 'WEB-' + Math.floor(Math.random() * 90000 + 10000),
        date: new Date().toISOString(),
        customer: cust.name,
        phone: cust.phone,
        productName: p.name,
        quantity: qty,
        total: qty * Number(p.price),
        status: 'pending' // pending, accepted, rejected
    });
    
    showToast('تم استقبال طلب جديد من الموقع!');
    updateOnlineOrdersBadge();
    renderOnlineOrders();
}

function updateOnlineOrdersBadge() {
    const badge = document.getElementById('onlineOrdersBadge');
    if(!badge) return;
    
    const pendingCount = mockOnlineOrders.filter(o => o.status === 'pending').length;
    if (pendingCount > 0) {
        badge.textContent = pendingCount;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

function acceptOnlineOrder(index) {
    if(!confirm('هل تريد الموافقة على هذا الطلب وتحويله للكاشير؟')) return;
    
    const order = mockOnlineOrders[index];
    order.status = 'accepted';
    showToast('تم الموافقة على الطلب! يرجى تحضيره.');
    updateOnlineOrdersBadge();
    renderOnlineOrders();
    // Here you would typically send the order to POS cart or automatically register a sale
}

function rejectOnlineOrder(index) {
    if(!confirm('هل تريد رفض هذا الطلب؟')) return;
    
    mockOnlineOrders[index].status = 'rejected';
    showToast('تم رفض الطلب', 'warning');
    updateOnlineOrdersBadge();
    renderOnlineOrders();
}

let currentWaOrder = null;

function openOnlineOrderWhatsApp(index) {
    const order = mockOnlineOrders[index];
    if (!order) return;

    currentWaOrder = order;

    const infoEl = document.getElementById('waOrderInfo');
    if (infoEl) {
        infoEl.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <span>طلب <strong>#${order.id}</strong> — ${order.customer}</span>
                <span class="badge ${order.status === 'accepted' ? 'success' : (order.status === 'rejected' ? 'danger' : 'warning')}">
                    ${order.status === 'accepted' ? 'مقبول' : (order.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار')}
                </span>
            </div>
            <div style="font-size:0.8rem;color:var(--gray);margin-top:4px;">
                المنتج: ${order.productName} (x${order.quantity}) | الإجمالي: <strong style="color:var(--success);">₪${Number(order.total).toFixed(2)}</strong>
            </div>
        `;
    }

    const phoneInput = document.getElementById('waOrderPhone');
    if (phoneInput) {
        phoneInput.value = order.phone || '0599123456';
    }

    setWaTemplate('confirm');
    openModal('orderWhatsAppModal');
}

function setWaTemplate(type) {
    if (!currentWaOrder) return;
    const o = currentWaOrder;
    const msgInput = document.getElementById('waOrderMessage');
    if (!msgInput) return;

    if (type === 'confirm') {
        msgInput.value = `السلام عليكم ورحمة الله أهلاً بك ${o.customer} 🌸\nمعك خدمة العملاء من متجر الأناقة للملابس.\n\nبخصوص طلبك رقم #${o.id}:\n📦 الأصناف: ${o.productName} (الكمية: ${o.quantity})\n💰 الإجمالي: ₪${Number(o.total).toFixed(2)}\n\nنود تأكيد استلام الطلب وبدء تجهيزه لك. يرجى تأكيد العنوان المناسب للتوصيل ✨`;
    } else if (type === 'ready') {
        msgInput.value = `أهلاً بك ${o.customer} 🌸\nنود إعلامك بأن طلبك رقم #${o.id} من متجر الأناقة أصبح جاهزاً الآن ومغلفاً بعناية 🎁\n\n💰 المبلغ المطلوب: ₪${Number(o.total).toFixed(2)}\nيسعدنا خدمتكم دائماً!`;
    } else if (type === 'delivery') {
        msgInput.value = `مرحباً ${o.customer} 🚗\nطلبك رقم #${o.id} خرج الآن مع مندوب التوصيل وسيتواصل معك خلال وقت قصير.\n\nالمبلغ عند الاستلام: ₪${Number(o.total).toFixed(2)}\nشكراً لاختيارك متجر الأناقة! ✨`;
    }
}

function formatWhatsAppPhone(phone) {
    if (!phone) return '';
    let clean = String(phone).replace(/[^0-9]/g, '');
    if (clean.startsWith('00')) clean = clean.substring(2);
    if (clean.startsWith('05')) {
        clean = '970' + clean.substring(1);
    }
    return clean;
}

function sendWhatsAppMessageNow() {
    const phoneInput = document.getElementById('waOrderPhone');
    const msgInput = document.getElementById('waOrderMessage');
    const rawPhone = (phoneInput ? phoneInput.value : '').trim();
    const message = (msgInput ? msgInput.value : '').trim();

    if (!rawPhone) {
        showToast('يرجى إدخال رقم هاتف العميل', 'error');
        return;
    }

    if (currentWaOrder) {
        currentWaOrder.phone = rawPhone;
        renderOnlineOrders();
    }

    const formattedPhone = formatWhatsAppPhone(rawPhone);
    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMsg}`;

    window.open(waUrl, '_blank');
    closeModal('orderWhatsAppModal');
    showToast('جاري فتح محادثة واتساب...');
}

function renderOnlineOrders() {
    const tbody = document.getElementById('onlineOrdersTableBody');
    if(!tbody) return;
    
    if (mockOnlineOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty">لا توجد طلبات جديدة حالياً</td></tr>';
        return;
    }
    
    tbody.innerHTML = mockOnlineOrders.slice().reverse().map((o, i) => {
        const realIndex = mockOnlineOrders.length - 1 - i;
        let statusBadge = '<span class="badge warning">قيد الانتظار</span>';
        let actions = `
            <div style="display:inline-flex;align-items:center;gap:4px;">
                <button class="btn-icon whatsapp" onclick="openOnlineOrderWhatsApp(${realIndex})" title="مراسلة الزبون عبر واتساب"><i class="fab fa-whatsapp"></i></button>
                <button class="btn-icon success" onclick="acceptOnlineOrder(${realIndex})" title="قبول الطلب"><i class="fas fa-check"></i></button>
                <button class="btn-icon danger" onclick="rejectOnlineOrder(${realIndex})" title="رفض الطلب"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        if (o.status === 'accepted') {
            statusBadge = '<span class="badge success">مقبول</span>';
            actions = `
                <div style="display:inline-flex;align-items:center;gap:6px;">
                    <button class="btn-icon whatsapp" onclick="openOnlineOrderWhatsApp(${realIndex})" title="مراسلة الزبون عبر واتساب"><i class="fab fa-whatsapp"></i></button>
                    <span style="color:var(--success);font-size:.8rem;"><i class="fas fa-check-double"></i> تم المعالجة</span>
                </div>
            `;
        } else if (o.status === 'rejected') {
            statusBadge = '<span class="badge danger">مرفوض</span>';
            actions = `
                <div style="display:inline-flex;align-items:center;gap:6px;">
                    <button class="btn-icon whatsapp" onclick="openOnlineOrderWhatsApp(${realIndex})" title="مراسلة الزبون عبر واتساب"><i class="fab fa-whatsapp"></i></button>
                    <span style="color:var(--danger);font-size:.8rem;"><i class="fas fa-ban"></i> ملغى</span>
                </div>
            `;
        }

        return `
            <tr>
                <td><strong>${o.id}</strong></td>
                <td style="font-size:.8rem;">${new Date(o.date).toLocaleString('ar-EG', { dateStyle:'short', timeStyle:'short' })}</td>
                <td>
                    <strong>${o.customer}</strong>
                    ${o.phone ? `<small style="display:block;color:var(--gray);direction:ltr;text-align:right;"><i class="fas fa-phone-alt" style="font-size:0.7rem;"></i> ${o.phone}</small>` : ''}
                </td>
                <td>${o.productName} <span class="badge primary">x${o.quantity}</span></td>
                <td><strong>₪${o.total.toFixed(2)}</strong></td>
                <td>${statusBadge}</td>
                <td>${actions}</td>
            </tr>
        `;
    }).join('');
}

window.openOnlineOrderWhatsApp = openOnlineOrderWhatsApp;
window.setWaTemplate = setWaTemplate;
window.formatWhatsAppPhone = formatWhatsAppPhone;
window.sendWhatsAppMessageNow = sendWhatsAppMessageNow;

/* ============================================
   26. بدء التشغيل
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();
    if (user) {
        startApp();
    }
});
document.addEventListener('click', (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('show');
    }
    const notifDropdown = document.getElementById('notifDropdown');
    const notifBtnDesk = document.getElementById('notifBellBtn');
    const notifBtnMob = document.getElementById('notifBellBtnMobile');
    if (notifDropdown && notifDropdown.classList.contains('show')) {
        if (!notifDropdown.contains(e.target) &&
            (!notifBtnDesk || !notifBtnDesk.contains(e.target)) &&
            (!notifBtnMob || !notifBtnMob.contains(e.target))) {
            notifDropdown.classList.remove('show');
        }
    }
});


/* ============================================
   نظام جرس التنبيهات الذكي والشريط العلوي
   ============================================ */
let currentNotifFilterTab = 'all';

function getDismissedNotifIds() {
    try {
        return JSON.parse(localStorage.getItem('store_dismissed_notifs_v6') || '[]');
    } catch (e) {
        return [];
    }
}

function saveDismissedNotifIds(ids) {
    try {
        localStorage.setItem('store_dismissed_notifs_v6', JSON.stringify(ids));
    } catch (e) {}
}

function getReadNotifIds() {
    try {
        return JSON.parse(localStorage.getItem('store_read_notifs_v6') || '[]');
    } catch (e) {
        return [];
    }
}

function saveReadNotifIds(ids) {
    try {
        localStorage.setItem('store_read_notifs_v6', JSON.stringify(ids));
    } catch (e) {}
}

function initTopBarAndNotifications() {
    // 1. تحديث التاريخ في الشريط العلوي
    const dateEl = document.getElementById('topbarDate');
    if (dateEl) {
        try {
            const now = new Date();
            const dateStr = now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            dateEl.innerHTML = `<i class="far fa-calendar-alt"></i> ${dateStr}`;
        } catch (e) {
            dateEl.innerHTML = `<i class="far fa-calendar-alt"></i> ${new Date().toLocaleDateString('ar-EG')}`;
        }
    }

    // 2. تحديث معلومات المستخدم في التوب بار
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const nameEl = document.getElementById('topbarUserName');
    const avatarEl = document.getElementById('topbarUserAvatar');
    if (user && nameEl) nameEl.textContent = user.name;
    if (user && avatarEl) avatarEl.textContent = user.name.charAt(0);

    // 3. تحديث التنبيهات
    updateNotifications();
}

function getStoreNotificationsList() {
    const list = [];
    const dismissedIds = getDismissedNotifIds();
    const readIds = getReadNotifIds();

    // أ. منتجات نفدت كميتها تماماً
    if (typeof getOutOfStockProducts === 'function') {
        const outProds = getOutOfStockProducts();
        outProds.forEach(p => {
            const id = 'stock-out-' + p.id;
            if (!dismissedIds.includes(id)) {
                list.push({
                    id: id,
                    type: 'stock',
                    severity: 'danger',
                    icon: 'fas fa-ban',
                    tag: 'نفاد المخزون',
                    title: `نفاد الكمية: ${p.name}`,
                    desc: `المقاس: ${p.size || 'عادي'} | اللون: ${p.color || 'عام'} - الرصيد الحالي 0 قطعة`,
                    actionText: 'طلب توريد',
                    actionCode: "switchScreen('inventory'); closeNotifDropdown();",
                    time: 'عاجل',
                    isRead: readIds.includes(id)
                });
            }
        });
    }

    // ب. منتجات مخزونها منخفض (أوشكت على النفاد)
    if (typeof getProducts === 'function' && typeof getProductQuantity === 'function') {
        const threshold = (typeof LOW_STOCK !== 'undefined') ? LOW_STOCK : 5;
        const lowProds = getProducts().filter(p => {
            const q = getProductQuantity(p.id);
            return q > 0 && q <= threshold;
        });

        lowProds.forEach(p => {
            const id = 'stock-low-' + p.id;
            if (!dismissedIds.includes(id)) {
                const q = getProductQuantity(p.id);
                list.push({
                    id: id,
                    type: 'stock',
                    severity: 'warning',
                    icon: 'fas fa-exclamation-triangle',
                    tag: 'مخزون منخفض',
                    title: `أوشك على النفاد: ${p.name}`,
                    desc: `المقاس: ${p.size || 'عادي'} | اللون: ${p.color || 'عام'} - المتبقي: ${q} قطع فقط`,
                    actionText: 'طلب توريد',
                    actionCode: "switchScreen('inventory'); closeNotifDropdown();",
                    time: 'تنبيه',
                    isRead: readIds.includes(id)
                });
            }
        });
    }

    // ج. ديون العملاء المستحقة
    if (typeof getCustomerDebtSummary === 'function') {
        const debts = getCustomerDebtSummary();
        Object.values(debts).filter(c => c.balance > 0.01).forEach(c => {
            const id = 'debt-' + encodeURIComponent(c.name);
            if (!dismissedIds.includes(id)) {
                list.push({
                    id: id,
                    type: 'debts',
                    severity: 'danger',
                    icon: 'fas fa-hand-holding-usd',
                    tag: 'دين عميل',
                    title: `دين مستحق: ${c.name}`,
                    desc: `المتبقي بذمته: ₪${c.balance.toFixed(2)}${c.phone ? ' | هاتف: ' + c.phone : ''}`,
                    actionText: 'متابعة الدين',
                    actionCode: "switchScreen('debts'); closeNotifDropdown();",
                    time: 'مستحق',
                    isRead: readIds.includes(id)
                });
            }
        });
    }

    // د. طلبات الموقع الإلكتروني قيد الانتظار
    if (typeof mockOnlineOrders !== 'undefined' && Array.isArray(mockOnlineOrders)) {
        mockOnlineOrders.filter(o => o.status === 'pending').forEach(o => {
            const id = 'order-' + o.id;
            if (!dismissedIds.includes(id)) {
                list.push({
                    id: id,
                    type: 'orders',
                    severity: 'info',
                    icon: 'fas fa-shopping-bag',
                    tag: 'طلب إلكتروني',
                    title: `طلب موقع معلق #${o.id}`,
                    desc: `العميل: ${o.customer} | الصنف: ${o.productName} (x${o.quantity}) | الإجمالي: ₪${Number(o.total).toFixed(2)}`,
                    actionText: 'معالجة الطلب',
                    actionCode: "switchScreen('online-orders'); closeNotifDropdown();",
                    time: 'جديد',
                    isRead: readIds.includes(id)
                });
            }
        });
    }

    // هـ. منتجات بسعر بيع خاسر
    if (typeof getLossProducts === 'function') {
        const lossProds = getLossProducts();
        lossProds.forEach(p => {
            const id = 'loss-' + p.id;
            if (!dismissedIds.includes(id)) {
                const avgCost = typeof getProductAvgCost === 'function' ? getProductAvgCost(p.id) : 0;
                list.push({
                    id: id,
                    type: 'stock',
                    severity: 'warning',
                    icon: 'fas fa-arrow-trend-down',
                    tag: 'سعر غير مربح',
                    title: `مراجعة السعر: ${p.name}`,
                    desc: `سعر البيع ₪${p.price} يقل عن متوسط التكلفة ₪${avgCost.toFixed(2)}`,
                    actionText: 'تعديل السعر',
                    actionCode: "switchScreen('categories'); closeNotifDropdown();",
                    time: 'تنبيه مالي',
                    isRead: readIds.includes(id)
                });
            }
        });
    }

    return list;
}

function updateNotifications() {
    const list = getStoreNotificationsList();

    // حساب غير المقروء
    const unreadCount = list.filter(n => !n.isRead).length;

    // 1. تحديث شارة الجرس للكمبيوتر والهاتف
    const badgeDesktop = document.getElementById('notifBadge');
    const badgeMobile = document.getElementById('notifBadgeMobile');
    const bellBtnDesktop = document.getElementById('notifBellBtn');
    const bellBtnMobile = document.getElementById('notifBellBtnMobile');

    [badgeDesktop, badgeMobile].forEach(b => {
        if (!b) return;
        if (unreadCount > 0) {
            b.textContent = unreadCount > 99 ? '+99' : unreadCount;
            b.classList.add('show');
        } else {
            b.textContent = '0';
            b.classList.remove('show');
        }
    });

    [bellBtnDesktop, bellBtnMobile].forEach(btn => {
        if (!btn) return;
        if (unreadCount > 0) {
            btn.classList.add('has-unread');
        } else {
            btn.classList.remove('has-unread');
        }
    });

    // 2. تحديث عدادات التبويبات
    const countPill = document.getElementById('notifCountPill');
    if (countPill) countPill.textContent = `${list.length} تنبيه`;

    const tabAllEl = document.getElementById('notifTabAll');
    const tabStockEl = document.getElementById('notifTabStock');
    const tabDebtsEl = document.getElementById('notifTabDebts');
    const tabOrdersEl = document.getElementById('notifTabOrders');

    if (tabAllEl) tabAllEl.textContent = list.length;
    if (tabStockEl) tabStockEl.textContent = list.filter(n => n.type === 'stock').length;
    if (tabDebtsEl) tabDebtsEl.textContent = list.filter(n => n.type === 'debts').length;
    if (tabOrdersEl) tabOrdersEl.textContent = list.filter(n => n.type === 'orders').length;

    // 3. عرض القائمة
    renderNotifList(list);
}

function renderNotifList(allList = null) {
    const listEl = document.getElementById('notifList');
    if (!listEl) return;

    const list = allList || getStoreNotificationsList();

    let filtered = list;
    if (currentNotifFilterTab !== 'all') {
        filtered = list.filter(n => n.type === currentNotifFilterTab);
    }

    if (filtered.length === 0) {
        listEl.innerHTML = `
            <div class="notif-empty">
                <i class="fas fa-bell-slash"></i>
                <p>لا توجد تنبيهات ${currentNotifFilterTab !== 'all' ? 'في هذا القسم' : 'حالياً'}</p>
                <small>كل شيء يسير بسلاسة والمخزون والديون في حالة ممتازة!</small>
            </div>
        `;
        return;
    }

    listEl.innerHTML = filtered.map(item => `
        <div class="notif-item ${item.severity} ${item.isRead ? 'read' : 'unread'}">
            <div class="notif-item-icon ${item.severity}">
                <i class="${item.icon}"></i>
            </div>
            <div class="notif-item-content">
                <div class="notif-item-top">
                    <span class="notif-tag ${item.severity}">${item.tag}</span>
                    <span class="notif-time">${item.time}</span>
                </div>
                <h6 class="notif-item-title">${item.title}</h6>
                <p class="notif-item-desc">${item.desc}</p>
                <div class="notif-item-footer">
                    <button class="notif-item-btn" onclick="${item.actionCode}">
                        ${item.actionText} <i class="fas fa-arrow-left"></i>
                    </button>
                    <button class="notif-dismiss-btn" onclick="dismissNotification('${item.id}', event)" title="إخفاء التنبيه">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function toggleNotifDropdown(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('notifDropdown');
    if (!dropdown) return;

    const isOpen = dropdown.classList.contains('show');
    if (isOpen) {
        closeNotifDropdown();
    } else {
        dropdown.classList.add('show');
        updateNotifications();
    }
}

function closeNotifDropdown() {
    const dropdown = document.getElementById('notifDropdown');
    if (dropdown) dropdown.classList.remove('show');
}

function filterNotifTab(tabName) {
    currentNotifFilterTab = tabName;
    document.querySelectorAll('.notif-tab').forEach(t => {
        if (t.getAttribute('data-tab') === tabName) t.classList.add('active');
        else t.classList.remove('active');
    });
    renderNotifList();
}

function dismissNotification(id, event) {
    if (event) event.stopPropagation();
    const dismissed = getDismissedNotifIds();
    if (!dismissed.includes(id)) {
        dismissed.push(id);
        saveDismissedNotifIds(dismissed);
    }
    updateNotifications();
    showToast('تم إخفاء التنبيه', 'info');
}

function markAllNotificationsAsRead() {
    const list = getStoreNotificationsList();
    const readIds = list.map(n => n.id);
    saveReadNotifIds(readIds);
    updateNotifications();
    showToast('تم تحديد جميع التنبيهات كمقروءة', 'success');
}

function refreshNotifications() {
    updateNotifications();
    showToast('تم فحص وتحديث التنبيهات الآن');
    playNotificationChime();
}

function playNotificationChime() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now);
        gain1.gain.setValueAtTime(0.08, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.3);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.12);
        gain2.gain.setValueAtTime(0.1, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.45);
    } catch (e) {}
}

window.initTopBarAndNotifications = initTopBarAndNotifications;
window.getStoreNotificationsList = getStoreNotificationsList;
window.updateNotifications = updateNotifications;
window.renderNotifList = renderNotifList;
window.toggleNotifDropdown = toggleNotifDropdown;
window.closeNotifDropdown = closeNotifDropdown;
window.filterNotifTab = filterNotifTab;
window.dismissNotification = dismissNotification;
window.markAllNotificationsAsRead = markAllNotificationsAsRead;
window.refreshNotifications = refreshNotifications;
window.playNotificationChime = playNotificationChime;
