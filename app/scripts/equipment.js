// Засоби - управління засобами (БПЛА, обладнання)

let equipmentList = [];
let equipmentViewMode = localStorage.getItem('equipmentViewMode') || 'grid';
let equipmentTypes = [];

// Завантаження засобів
async function loadEquipment() {
    // Шукаємо equipmentContent або equipmentGrid
    let content = document.getElementById('equipmentContent');
    if (!content) {
        content = document.getElementById('equipmentGrid');
    }
    if (!content) {
        console.error('equipmentContent or equipmentGrid element not found in DOM');
        return;
    }

    try {
        // Завантаження типів
        const typesResponse = await api.getEquipmentTypes();
        const typesData = await api.handleResponse(typesResponse);
        equipmentTypes = typesData.data || [];
        
        // Завантаження засобів
        const response = await api.getEquipment();
        const data = await api.handleResponse(response);
        equipmentList = data.data || [];
        
        // Якщо є equipmentGrid (структура training.html), рендеримо туди
        const equipmentGridEl = document.getElementById('equipmentGrid');
        if (equipmentGridEl) {
            if (equipmentList.length === 0) {
                equipmentGridEl.innerHTML = '<div class="empty-state">Засоби відсутні. Використайте форму вище для додавання.</div>';
            } else {
                console.log('Rendering equipment grid with', equipmentList.length, 'items');
                equipmentList.forEach((item, index) => {
                    console.log(`Item ${index}:`, {
                        id: item.id,
                        name: item.name,
                        hasPhotoData: !!item.photo_data,
                        hasPhotoPath: !!item.photo_path,
                        photoDataLength: item.photo_data ? item.photo_data.length : 0
                    });
                });
                equipmentGridEl.innerHTML = renderEquipmentGrid(equipmentList);
            }
        } else {
            // Використовуємо стару структуру
            renderEquipment(equipmentList);
        }
    } catch (error) {
        console.error('Error loading equipment:', error);
        let errorMessage = 'Помилка завантаження засобів';
        if (error.message && error.message.includes('no such table')) {
            errorMessage = 'Таблиця засобів не знайдена. Будь ласка, оновіть базу даних.';
        }
        const errorMsg = `<div class="empty-state error">${errorMessage}</div>`;
        if (content) {
            content.innerHTML = errorMsg;
        }
        const equipmentGridEl = document.getElementById('equipmentGrid');
        if (equipmentGridEl) {
            equipmentGridEl.innerHTML = errorMsg;
        }
        if (typeof showNotification === 'function') {
            showNotification(errorMessage, 'error');
        }
    }
}

// Відображення засобів
function renderEquipment(equipment) {
    const content = document.getElementById('equipmentContent');
    if (!content) return;

    if (equipment.length === 0) {
        content.innerHTML = `
            <div class="equipment-header">
                <div class="view-toggle">
                    <button class="toggle-btn ${equipmentViewMode === 'list' ? 'active' : ''}" 
                            data-view="list" onclick="setEquipmentViewMode('list')">
                        📋 Список
                    </button>
                    <button class="toggle-btn ${equipmentViewMode === 'grid' ? 'active' : ''}" 
                            data-view="grid" onclick="setEquipmentViewMode('grid')">
                        🟦 Плитка
                    </button>
                </div>
            </div>
            <div class="empty-state">Засоби відсутні</div>
        `;
        return;
    }

    content.innerHTML = `
        <div class="equipment-header">
            <div class="view-toggle">
                <button class="toggle-btn ${equipmentViewMode === 'list' ? 'active' : ''}" 
                        data-view="list" onclick="setEquipmentViewMode('list')">
                    📋 Список
                </button>
                <button class="toggle-btn ${equipmentViewMode === 'grid' ? 'active' : ''}" 
                        data-view="grid" onclick="setEquipmentViewMode('grid')">
                    🟦 Плитка
                </button>
            </div>
        </div>
        <div class="equipment-container ${equipmentViewMode}-view">
            ${equipmentViewMode === 'grid' ? renderEquipmentGrid(equipment) : renderEquipmentList(equipment)}
        </div>
    `;
}

// Відображення у вигляді плитки
function renderEquipmentGrid(equipment) {
    return `
        <div class="equipment-grid">
            ${equipment.map(item => {
                // Визначаємо URL зображення
                let imageUrl = null;
                if (item.photo_data) {
                    // Якщо це base64 дані
                    if (typeof formatDataUrl === 'function') {
                        imageUrl = formatDataUrl(item.photo_data, 'image/jpeg');
                    } else if (item.photo_data.startsWith('data:')) {
                        imageUrl = item.photo_data;
                    } else {
                        imageUrl = 'data:image/jpeg;base64,' + item.photo_data;
                    }
                } else if (item.photo_path) {
                    imageUrl = item.photo_path;
                }
                
                return `
                <div class="equipment-card" onclick="openEquipmentCard(${item.id})">
                    ${imageUrl ? `
                        <div class="equipment-photo">
                            <img src="${imageUrl}" 
                                 alt="${item.name || 'Засіб'}" 
                                 style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;"
                                 onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'equipment-photo-placeholder\\' style=\\'width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); border-radius: 8px; font-size: 48px;\\'>📷</div>'">
                        </div>
                    ` : '<div class="equipment-photo-placeholder" style="width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); border-radius: 8px; font-size: 48px;">📷</div>'}
                    <h3>${item.name || 'Без назви'}</h3>
                    <p><strong>Тип:</strong> ${item.type_name || item.type || 'Не вказано'}</p>
                    ${item.type_uav ? `<p><strong>Тип БПЛА:</strong> ${item.type_uav}</p>` : ''}
                    <p><strong>Статус:</strong> ${item.status || 'active'}</p>
                    <div class="equipment-actions" onclick="event.stopPropagation()">
                        <button class="btn-primary btn-small" onclick="openEquipmentCard(${item.id})">Відкрити</button>
                        <button class="btn-secondary btn-small" onclick="editEquipment(${item.id})">Редагувати</button>
                        <button class="btn-danger btn-small" onclick="deleteEquipment(${item.id})">Видалити</button>
                    </div>
                </div>
            `;
            }).join('')}
        </div>
    `;
}

// Відображення у вигляді списку
function renderEquipmentList(equipment) {
    return `
        <div class="equipment-list">
            <table class="equipment-table">
                <thead>
                    <tr>
                        <th>Фото</th>
                        <th>Назва</th>
                        <th>Тип</th>
                        <th>Тип БПЛА</th>
                        <th>Статус</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    ${equipment.map(item => `
                        <tr>
                            <td>
                                ${item.photo_path || item.photo_data ? `
                                    <img src="${item.photo_data ? (typeof formatDataUrl === 'function' ? formatDataUrl(item.photo_data, 'image/jpeg') : (item.photo_data.startsWith('data:') ? item.photo_data : 'data:image/jpeg;base64,' + item.photo_data)) : item.photo_path}" 
                                         alt="${item.name}" 
                                         class="equipment-thumbnail"
                                         onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'50\\' height=\\'50\\'%3E%3Crect fill=\\'%23ccc\\' width=\\'50\\' height=\\'50\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3E📷%3C/text%3E%3C/svg%3E'">
                                ` : '<span class="equipment-thumbnail-placeholder">📷</span>'}
                            </td>
                            <td><strong>${item.name}</strong></td>
                            <td>${item.type_name || 'Не вказано'}</td>
                            <td>${item.type_uav || '-'}</td>
                            <td>${item.status || 'active'}</td>
                            <td>
                                <button class="btn-primary btn-small" onclick="openEquipmentCard(${item.id})">Відкрити</button>
                                <button class="btn-secondary btn-small" onclick="editEquipment(${item.id})">Редагувати</button>
                                <button class="btn-danger btn-small" onclick="deleteEquipment(${item.id})">Видалити</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Перемикання режиму перегляду
function setEquipmentViewMode(mode) {
    equipmentViewMode = mode;
    localStorage.setItem('equipmentViewMode', mode);
    renderEquipment(equipmentList);
}

// Модальне вікно створення/редагування засобу
async function showAddEquipmentModal(equipmentId = null) {
    // Переконаємося, що типи завантажені
    if (equipmentTypes.length === 0) {
        try {
            const typesResponse = await api.getEquipmentTypes();
            const typesData = await api.handleResponse(typesResponse);
            equipmentTypes = typesData.data || [];
        } catch (error) {
            console.error('Error loading equipment types:', error);
            if (typeof showNotification === 'function') {
                showNotification('Помилка завантаження типів засобів', 'error');
            }
        }
    }
    
    const item = equipmentId ? equipmentList.find(e => e.id === equipmentId) : null;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'addEquipmentModal';
    modal.innerHTML = `
        <div class="modal-content large-modal" onclick="event.stopPropagation()">
            <div class="modal-header">
                <div class="modal-title">${item ? 'Редагувати засіб' : 'Додати засіб'}</div>
                <button class="close-btn" onclick="closeModal('addEquipmentModal')">✕</button>
            </div>
            <div class="modal-body">
                <form id="addEquipmentForm" onsubmit="handleAddEquipment(event); return false;">
                    <input type="hidden" id="equipmentId" value="${item ? item.id : ''}">
                    <div class="form-group">
                        <label>Назва *</label>
                        <input type="text" id="equipmentName" required value="${item ? (item.name || '').replace(/"/g, '&quot;') : ''}">
                    </div>
                    <div class="form-group">
                        <label>Тип *</label>
                        <div style="display: flex; gap: 10px; align-items: flex-end;">
                            <select id="equipmentType" required style="flex: 1;">
                                <option value="">Виберіть тип</option>
                                ${equipmentTypes.map(type => {
                                    // Порівнюємо type_id з id типу, враховуючи різні типи даних
                                    let isSelected = false;
                                    if (item && item.type_id !== undefined && item.type_id !== null) {
                                        const itemTypeId = typeof item.type_id === 'string' ? parseInt(item.type_id) : item.type_id;
                                        const typeId = typeof type.id === 'string' ? parseInt(type.id) : type.id;
                                        isSelected = itemTypeId === typeId || String(item.type_id) === String(type.id);
                                    }
                                    return `<option value="${type.id}" ${isSelected ? 'selected' : ''}>${(type.name || '').replace(/"/g, '&quot;')}</option>`;
                                }).join('')}
                            </select>
                            <button type="button" class="btn-secondary" onclick="showAddEquipmentTypeModal()" style="white-space: nowrap;">
                                ➕ Створити тип
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Тип / Тип БПЛА</label>
                        <input type="text" id="equipmentTypeUav" value="${item ? (item.type_uav || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;') : ''}" placeholder="Наприклад: DJI Mavic 3">
                    </div>
                    <div class="form-group">
                        <label>Фотографія</label>
                        <div class="file-upload-area" onclick="document.getElementById('equipmentPhotoInput').click()">
                            <p>Натисніть для вибору фото</p>
                            <input type="file" id="equipmentPhotoInput" style="display: none;" 
                                   accept="image/*" onchange="handleEquipmentPhotoSelect(event)">
                            <div id="equipmentPhotoPreview"></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Примітки</label>
                        <textarea id="equipmentNotes" rows="3">${item ? (item.notes || '').replace(/</g, '&lt;').replace(/>/g, '&gt;') : ''}</textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Зберегти</button>
                        <button type="button" class="btn-secondary" onclick="closeModal('addEquipmentModal')">Скасувати</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.onclick = (e) => {
        if (e.target === modal) closeModal('addEquipmentModal');
    };
    
    // Використовуємо setTimeout, щоб переконатися, що DOM готовий
    setTimeout(() => {
        // Показати поточне фото якщо є
        if (item && (item.photo_path || item.photo_data)) {
            const preview = document.getElementById('equipmentPhotoPreview');
            if (preview) {
                preview.innerHTML = `
                    <div class="file-preview">
                        <img src="${item.photo_data ? (typeof formatDataUrl === 'function' ? formatDataUrl(item.photo_data, 'image/jpeg') : (item.photo_data.startsWith('data:') ? item.photo_data : 'data:image/jpeg;base64,' + item.photo_data)) : item.photo_path}" style="max-width: 200px; max-height: 200px;">
                    </div>
                `;
            }
        }
        
        // Перевіряємо, чи правильно встановлено вибраний тип
        const typeSelect = document.getElementById('equipmentType');
        if (typeSelect && item && item.type_id) {
            // Перевіряємо, чи значення справді вибране
            const selectedValue = typeSelect.value;
            console.log('Type select value:', selectedValue, 'Item type_id:', item.type_id);
            
            if (!selectedValue || selectedValue === '') {
                // Якщо тип не вибрано, спробуємо знайти за type_id
                const typeIdStr = String(item.type_id);
                const typeIdNum = parseInt(item.type_id);
                
                // Шукаємо опцію за id
                for (let option of typeSelect.options) {
                    const optionValue = option.value;
                    const optionValueNum = parseInt(optionValue);
                    
                    if (optionValue === typeIdStr || 
                        optionValue === String(typeIdNum) || 
                        optionValueNum === typeIdNum || 
                        optionValueNum === parseInt(typeIdStr)) {
                        option.selected = true;
                        typeSelect.value = optionValue;
                        console.log('Selected type:', optionValue, option.textContent);
                        break;
                    }
                }
            } else {
                // Перевіряємо, чи вибране значення співпадає з type_id
                const selectedNum = parseInt(selectedValue);
                const itemTypeNum = parseInt(item.type_id);
                if (selectedNum !== itemTypeNum && selectedValue !== String(item.type_id)) {
                    // Значення не співпадає, виправляємо
                    for (let option of typeSelect.options) {
                        const optionValue = option.value;
                        const optionValueNum = parseInt(optionValue);
                        const itemTypeNum = parseInt(item.type_id);
                        
                        if (optionValueNum === itemTypeNum || optionValue === String(item.type_id)) {
                            option.selected = true;
                            typeSelect.value = optionValue;
                            console.log('Fixed selected type:', optionValue);
                            break;
                        }
                    }
                }
            }
        }
    }, 100);
}

// Обробка вибору фото
function handleEquipmentPhotoSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('equipmentPhotoPreview');
        preview.innerHTML = `
            <div class="file-preview">
                <img src="${e.target.result}" style="max-width: 200px; max-height: 200px;">
            </div>
        `;
    };
    reader.readAsDataURL(file);
}

// Обробка завантаження зображення для форми в training.html
function handleEquipmentImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Перевіряємо тип файлу
    if (!file.type.startsWith('image/')) {
        if (typeof showNotification === 'function') {
            showNotification('Будь ласка, виберіть файл зображення', 'error');
        }
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('equipmentImagePreview');
        const uploadArea = document.getElementById('fileUploadArea');
        const imageInput = document.getElementById('equipmentImageInput');
        
        if (preview) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            preview.style.maxWidth = '100%';
            preview.style.maxHeight = '300px';
            preview.style.marginTop = '10px';
            preview.style.borderRadius = '8px';
            preview.style.objectFit = 'contain';
        }
        
        if (uploadArea) {
            // Знаходимо або створюємо текстовий елемент
            let textEl = uploadArea.querySelector('p');
            if (!textEl) {
                textEl = document.createElement('p');
                textEl.style.color = 'var(--primary)';
                textEl.style.marginBottom = '10px';
                uploadArea.insertBefore(textEl, imageInput);
            }
            textEl.textContent = 'Натисніть для зміни зображення';
            
            // Видаляємо попереднє прев'ю, якщо є
            const oldPreview = uploadArea.querySelector('img:not(#equipmentImageInput)');
            if (oldPreview && oldPreview.id !== 'equipmentImagePreview') {
                oldPreview.remove();
            }
            
            // Якщо preview не в uploadArea, додаємо його туди
            if (preview && preview.parentElement !== uploadArea) {
                uploadArea.appendChild(preview);
            }
        }
    };
    
    reader.onerror = () => {
        if (typeof showNotification === 'function') {
            showNotification('Помилка читання файлу', 'error');
        }
    };
    
    reader.readAsDataURL(file);
}

// Збереження засобу
async function handleAddEquipment(event) {
    event.preventDefault();
    
    const equipmentId = document.getElementById('equipmentId').value;
    const name = document.getElementById('equipmentName').value;
    const typeIdElement = document.getElementById('equipmentType');
    const typeId = typeIdElement ? typeIdElement.value : '';
    const typeUav = document.getElementById('equipmentTypeUav').value;
    const notes = document.getElementById('equipmentNotes').value;
    const photoInput = document.getElementById('equipmentPhotoInput');
    
    console.log('Saving equipment:', { equipmentId, name, typeId, typeUav, notes });
    
    if (!typeId || typeId === '') {
        if (typeof showNotification === 'function') {
            showNotification('Виберіть тип засобу', 'error');
        }
        // Підсвічуємо поле типу
        if (typeIdElement) {
            typeIdElement.style.border = '2px solid red';
            setTimeout(() => {
                typeIdElement.style.border = '';
            }, 3000);
        }
        return;
    }
    
    try {
        let photoData = null;
        if (photoInput && photoInput.files[0]) {
            const file = photoInput.files[0];
            if (USE_LOCAL_DB) {
                photoData = await fileToBase64(file);
            } else {
                photoData = await uploadFile(file);
            }
        }
        
        const equipmentData = {
            name: name,
            type_id: parseInt(typeId),
            type_uav: typeUav || null,
            photo_data: USE_LOCAL_DB ? photoData : null,
            photo_path: USE_LOCAL_DB ? null : photoData,
            notes: notes || null,
            status: 'active'
        };
        
        let response;
        if (equipmentId) {
            response = await api.updateEquipment(equipmentId, equipmentData);
        } else {
            response = await api.createEquipment(equipmentData);
        }
        
        const data = await api.handleResponse(response);
        
        if (data.success) {
            closeModal('addEquipmentModal');
            showNotification(equipmentId ? 'Засіб оновлено' : 'Засіб додано', 'success');
            // Миттєве оновлення даних в інтерфейсі
            await loadEquipment();
            // Якщо було редагування, закриваємо картку якщо вона відкрита
            const cardModal = document.getElementById('equipmentCardModal');
            if (cardModal && equipmentId) {
                closeModal('equipmentCardModal');
            }
        }
    } catch (error) {
        console.error('Error saving equipment:', error);
        showNotification(error.message || 'Помилка збереження засобу', 'error');
    }
}

// Редагування засобу
function editEquipment(equipmentId) {
    showAddEquipmentModal(equipmentId);
}

// Відкриття картки засобу
async function openEquipmentCard(equipmentId) {
    try {
        const item = equipmentList.find(e => e.id === equipmentId);
        if (!item) {
            showNotification('Засіб не знайдено', 'error');
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.id = 'equipmentCardModal';
        modal.innerHTML = `
            <div class="modal-content large-modal" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <div class="modal-title">Картка засобу: ${item.name}</div>
                    <button class="close-btn" onclick="closeModal('equipmentCardModal')">✕</button>
                </div>
                <div class="modal-body">
                    <div class="equipment-card-details">
                        ${item.photo_path || item.photo_data ? `
                            <div class="equipment-photo-large" style="text-align: center; margin-bottom: 20px;">
                                <img src="${item.photo_data ? (typeof formatDataUrl === 'function' ? formatDataUrl(item.photo_data, 'image/jpeg') : (item.photo_data.startsWith('data:') ? item.photo_data : 'data:image/jpeg;base64,' + item.photo_data)) : item.photo_path}" 
                                     alt="${item.name}" 
                                     style="max-width: 100%; max-height: 400px; border-radius: 8px; border: 2px solid var(--primary);">
                            </div>
                        ` : ''}
                        <div class="info-grid">
                            <div class="info-item">
                                <label>Назва:</label>
                                <span>${item.name}</span>
                            </div>
                            <div class="info-item">
                                <label>Тип:</label>
                                <span>${item.type_name || 'Не вказано'}</span>
                            </div>
                            ${item.type_uav ? `
                                <div class="info-item">
                                    <label>Тип БПЛА:</label>
                                    <span>${item.type_uav}</span>
                                </div>
                            ` : ''}
                            <div class="info-item">
                                <label>Статус:</label>
                                <span>${item.status || 'active'}</span>
                            </div>
                            ${item.notes ? `
                                <div class="info-item">
                                    <label>Примітки:</label>
                                    <span>${item.notes}</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="form-actions" style="margin-top: 20px;">
                        <button class="btn-primary" onclick="editEquipment(${item.id}); closeModal('equipmentCardModal');">Редагувати</button>
                        <button class="btn-secondary" onclick="closeModal('equipmentCardModal')">Закрити</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.onclick = (e) => {
            if (e.target === modal) closeModal('equipmentCardModal');
        };
    } catch (error) {
        console.error('Error opening equipment card:', error);
        showNotification('Помилка відкриття картки засобу', 'error');
    }
}

// Модальне вікно створення типу засобу
function showAddEquipmentTypeModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'addEquipmentTypeModal';
    modal.innerHTML = `
        <div class="modal-content" onclick="event.stopPropagation()">
            <div class="modal-header">
                <div class="modal-title">Створити тип засобу</div>
                <button class="close-btn" onclick="closeModal('addEquipmentTypeModal')">✕</button>
            </div>
            <div class="modal-body">
                <form id="addEquipmentTypeForm" onsubmit="handleAddEquipmentType(event); return false;">
                    <div class="form-group">
                        <label>Назва типу *</label>
                        <input type="text" id="equipmentTypeName" required placeholder="Наприклад: БПЛА, Пульт управління">
                    </div>
                    <div class="form-group">
                        <label>Опис (опціонально)</label>
                        <textarea id="equipmentTypeDescription" rows="3" placeholder="Опис типу засобу"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Створити</button>
                        <button type="button" class="btn-secondary" onclick="closeModal('addEquipmentTypeModal')">Скасувати</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.onclick = (e) => {
        if (e.target === modal) closeModal('addEquipmentTypeModal');
    };
}

// Збереження типу засобу
async function handleAddEquipmentType(event) {
    event.preventDefault();
    
    const name = document.getElementById('equipmentTypeName').value;
    const description = document.getElementById('equipmentTypeDescription').value;
    
    try {
        const typeData = {
            name: name,
            description: description
        };
        
        const response = await api.createEquipmentType(typeData);
        const data = await api.handleResponse(response);
        
        if (data.success) {
            closeModal('addEquipmentTypeModal');
            showNotification('Тип засобу створено', 'success');
            // Оновлюємо список типів
            await loadEquipment();
            // Оновлюємо вибір типу в модальному вікні додавання засобу
            const typeSelect = document.getElementById('equipmentType');
            if (typeSelect) {
                const newOption = document.createElement('option');
                newOption.value = data.data.id;
                newOption.textContent = data.data.name;
                typeSelect.appendChild(newOption);
                typeSelect.value = data.data.id;
            }
        }
    } catch (error) {
        console.error('Error creating equipment type:', error);
        showNotification(error.message || 'Помилка створення типу засобу', 'error');
    }
}

// Видалення засобу
async function deleteEquipment(equipmentId) {
    if (!confirm('Ви впевнені, що хочете видалити цей засіб?')) {
        return;
    }
    
    try {
        const response = await api.deleteEquipment(equipmentId);
        const data = await api.handleResponse(response);
        
        if (data.success) {
            showNotification('Засіб видалено', 'success');
            loadEquipment();
        }
    } catch (error) {
        console.error('Error deleting equipment:', error);
        showNotification(error.message || 'Помилка видалення засобу', 'error');
    }
}

// Обробка форми в training.html
function handleEquipmentFormSubmit(event) {
    event.preventDefault();
    
    const equipmentId = document.getElementById('equipmentId').value;
    const name = document.getElementById('equipmentName').value;
    const type = document.getElementById('equipmentType').value;
    const manufacturer = document.getElementById('equipmentManufacturer').value;
    const notes = document.getElementById('equipmentNotes').value;
    const imageInput = document.getElementById('equipmentImageInput');
    
    if (!name || !type) {
        if (typeof showNotification === 'function') {
            showNotification('Заповніть обов\'язкові поля', 'error');
        }
        return;
    }
    
    // Отримуємо тип засобу з API (якщо потрібно)
    handleSaveEquipment({
        id: equipmentId || null,
        name: name,
        type: type,
        manufacturer: manufacturer,
        notes: notes,
        imageFile: imageInput && imageInput.files[0] ? imageInput.files[0] : null
    });
}

// Збереження засобу з форми training.html
async function handleSaveEquipment(data) {
    try {
        let photoData = null;
        if (data.imageFile) {
            console.log('Converting image file to base64...', data.imageFile.name, data.imageFile.type);
            if (typeof window !== 'undefined' && window.USE_LOCAL_DB === true) {
                photoData = await fileToBase64(data.imageFile);
                console.log('Photo data length:', photoData ? photoData.length : 0);
            } else {
                photoData = await uploadFile(data.imageFile);
                console.log('Photo uploaded, path:', photoData);
            }
        }
        
        // Створюємо або оновлюємо тип засобу, якщо потрібно
        let typeId = null;
        try {
            // Спробуємо знайти тип за назвою
            const typesResponse = await api.getEquipmentTypes();
            const typesData = await api.handleResponse(typesResponse);
            const existingType = typesData.data?.find(t => t.name === data.type);
            
            if (existingType) {
                typeId = existingType.id;
            } else {
                // Створюємо новий тип
                const createTypeResponse = await api.createEquipmentType({ name: data.type });
                const createTypeData = await api.handleResponse(createTypeResponse);
                if (createTypeData.success) {
                    typeId = createTypeData.data.id;
                }
            }
        } catch (e) {
            console.warn('Could not create/find equipment type:', e);
        }
        
        const equipmentData = {
            name: data.name,
            type_id: typeId,
            type_uav: data.manufacturer || null,
            photo_data: (typeof window !== 'undefined' && window.USE_LOCAL_DB === true) ? photoData : null,
            photo_path: (typeof window !== 'undefined' && window.USE_LOCAL_DB === true) ? null : photoData,
            notes: data.notes || null,
            status: 'active'
        };
        
        let response;
        if (data.id) {
            response = await api.updateEquipment(data.id, equipmentData);
        } else {
            response = await api.createEquipment(equipmentData);
        }
        
        const result = await api.handleResponse(response);
        
        if (result.success) {
            console.log('Equipment saved successfully:', result.data);
            if (typeof showNotification === 'function') {
                showNotification(data.id ? 'Засіб оновлено' : 'Засіб додано', 'success');
            }
            resetEquipmentForm();
            await loadEquipment();
        } else {
            console.error('Failed to save equipment:', result);
            if (typeof showNotification === 'function') {
                showNotification(result.message || 'Помилка збереження засобу', 'error');
            }
        }
    } catch (error) {
        console.error('Error saving equipment:', error);
        if (typeof showNotification === 'function') {
            showNotification(error.message || 'Помилка збереження засобу', 'error');
        }
    }
}

// Скидання форми
function resetEquipmentForm() {
    const form = document.getElementById('equipmentForm');
    if (form) {
        form.reset();
    }
    const preview = document.getElementById('equipmentImagePreview');
    if (preview) {
        preview.style.display = 'none';
        preview.src = '';
    }
    const imageInput = document.getElementById('equipmentImageInput');
    if (imageInput) {
        imageInput.value = '';
    }
    const equipmentId = document.getElementById('equipmentId');
    if (equipmentId) {
        equipmentId.value = '';
    }
}

// Експорт глобально
if (typeof window !== 'undefined') {
    window.loadEquipment = loadEquipment;
    window.setEquipmentViewMode = setEquipmentViewMode;
    window.showAddEquipmentModal = showAddEquipmentModal;
    window.showAddEquipmentTypeModal = showAddEquipmentTypeModal;
    window.handleAddEquipment = handleAddEquipment;
    window.handleAddEquipmentType = handleAddEquipmentType;
    window.editEquipment = editEquipment;
    window.deleteEquipment = deleteEquipment;
    window.openEquipmentCard = openEquipmentCard;
    window.handleEquipmentPhotoSelect = handleEquipmentPhotoSelect;
    window.handleEquipmentImageUpload = handleEquipmentImageUpload;
    window.handleEquipmentFormSubmit = handleEquipmentFormSubmit;
    window.handleSaveEquipment = handleSaveEquipment;
    window.resetEquipmentForm = resetEquipmentForm;
    window.renderEquipment = renderEquipment;
    window.renderEquipmentGrid = renderEquipmentGrid;
    window.renderEquipmentList = renderEquipmentList;
    // formatDataUrl експортується в main.js
    // closeModal та showNotification експортуються в auth.js
}

