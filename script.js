// Include SortableJS library: <script src="<https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js>"></script>

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const app = document.getElementById('app');
    const loginScreen = document.getElementById('login-screen');
    const mainDashboardScreen = document.getElementById('main-dashboard-screen');

    // Login Screen Elements
    const generalLoginBtn = document.getElementById('general-login-btn');
    const generalLoginForm = document.getElementById('general-login-form');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginSubmitBtn = document.getElementById('login-submit-btn');
    const signupSubmitBtn = document.getElementById('signup-submit-btn');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const forgotPasswordBtn = document.getElementById('forgot-password-btn');

    // Dashboard Screen Elements
    const logoutBtn = document.getElementById('logout-btn');
    const dashboardMainTitle = document.getElementById('dashboard-main-title'); // LINO로 변경됨
    const addLinkGlobalBtn = document.getElementById('add-link-global-btn'); // 새 항목 추가 버튼
    const addDashboardGlobalBtn = document.getElementById('add-dashboard-global-btn'); // 새 투두리스트 추가 버튼
    const dashboardsContainer = document.getElementById('dashboards-container');
    const emptyDashboardsState = document.getElementById('empty-dashboards-state');
    const emptyAddDashboardBtn = document.getElementById('empty-add-dashboard-btn');
    const dashboardPagination = document.getElementById('dashboard-pagination');

    const searchBtn = document.getElementById('search-btn');
    const searchBarContainer = document.getElementById('search-bar-container');
    const searchInput = document.getElementById('search-input');
    const searchCloseBtn = document.getElementById('search-close-btn');

    // Modals
    const itemModal = document.getElementById('item-modal'); // link-modal -> item-modal
    const itemModalTitle = document.getElementById('item-modal-title'); // link-modal-title -> item-modal-title
    const itemForm = document.getElementById('item-form'); // link-form -> item-form

    // Item Type Selection (New)
    const itemTypeTodoRadio = document.getElementById('item-type-todo');
    const itemTypeLinkRadio = document.getElementById('item-type-link');

    // Item Fields
    const itemTextInput = document.getElementById('item-text-input'); // link-title -> item-text-input
    const itemCompletedCheckbox = document.getElementById('item-completed-checkbox'); // New
    const itemUrlInput = document.getElementById('item-url-input'); // link-url -> item-url-input
    const itemLinkTitleInput = document.getElementById('item-link-title-input'); // New (was conceptually part of link-title)

    // Form Groups for conditional display
    const itemTextGroup = document.getElementById('item-text-group');
    const itemCompletedGroup = document.getElementById('item-completed-group');
    const itemUrlGroup = document.getElementById('item-url-group');
    const itemLinkTitleGroup = document.getElementById('item-link-title-group');

    const itemModalCancelBtn = document.getElementById('item-modal-cancel-btn'); // link-modal-cancel-btn -> item-modal-cancel-btn
    const itemModalSaveBtn = document.getElementById('item-modal-save-btn'); // link-modal-save-btn -> item-modal-save-btn
    const faviconLoadingSpinner = document.getElementById('favicon-loading-spinner');

    const listModal = document.getElementById('list-modal'); // dashboard-modal -> list-modal
    const listModalTitle = document.getElementById('list-modal-title'); // dashboard-modal-title -> list-modal-title
    const listForm = document.getElementById('list-form'); // dashboard-form -> list-form
    const listNameInput = document.getElementById('list-name-input'); // dashboard-name -> list-name
    const listDescriptionInput = document.getElementById('list-description-input'); // dashboard-description -> list-description
    const listModalCancelBtn = document.getElementById('list-modal-cancel-btn'); // dashboard-modal-cancel-btn -> list-modal-cancel-btn
    const listModalSaveBtn = document.getElementById('list-modal-save-btn'); // dashboard-modal-save-btn -> list-modal-save-btn

    // Settings
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const settingsModalCloseBtn = document.getElementById('settings-modal-close-btn');
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const colorSwatches = document.querySelectorAll('.color-swatch');

    // Tutorial
    const tutorialModal = document.getElementById('tutorial-modal');
    const tutorialContent = document.getElementById('tutorial-content');
    const tutorialSkipBtn = document.getElementById('tutorial-skip-btn');
    const tutorialPrevBtn = document.getElementById('tutorial-prev-btn');
    const tutorialNextBtn = document.getElementById('tutorial-next-btn');
    const tutorialStartBtn = document.getElementById('tutorial-start-btn');

    const toastContainer = document.getElementById('toast-container');

    // --- State Variables ---
    let dashboards = []; // Conceptually now 'todoLists'
    let editingItemId = null; // editingLinkId -> editingItemId
    let editingListId = null; // editingDashboardId -> editingListId
    let currentDashboardIndex = 0;
    let currentTheme = localStorage.getItem('dashLinkTheme') || 'light';
    let currentPrimaryColor = localStorage.getItem('dashLinkPrimaryColor') || '#00C49F';
    let hasSeenTutorial = localStorage.getItem('hasSeenDashLinkTutorial') === 'true';
    let currentTutorialStep = 0;
    let currentUserUid = null;
    let isEmailVerified = false;

    // Renamed tutorial steps to match LINO context
    const tutorialSteps = [
        {
            title: 'LINO에 오신 것을 환영합니다!',
            content: 'LINO는 공용 컴퓨터에서도 나만의 할 일과 링크를 편리하게 관리할 수 있도록 도와줍니다. 이제 주요 기능을 알아볼까요?'
        },
        {
            title: '투두리스트 탐색',
            content: '각 카드는 하나의 "투두리스트"입니다. 마우스 휠 스크롤이나 모바일 스와이프를 통해 다른 리스트로 이동할 수 있습니다.',
            image: '<https://via.placeholder.com/400x200?text=LINO+List+Swipe>'
        },
        {
            title: '할 일 및 링크 추가/관리',
            content: '각 리스트 하단의 "새 항목 추가" 버튼을 눌러 할 일이나 링크를 추가할 수 있습니다. 할 일은 체크박스로 완료 처리하고, 항목 위에서 편집/삭제 버튼으로 관리하세요.',
            image: '<https://via.placeholder.com/400x200?text=LINO+Add+Item>'
        },
        {
            title: '드래그 앤 드롭 정렬',
            content: '항목을 길게 누르거나 리스트 헤더를 잡고 드래그하여 순서를 바꾸거나 다른 투두리스트로 옮길 수 있습니다.',
            image: '<https://via.placeholder.com/400x200?text=LINO+Drag+Drop>'
        },
        {
            title: '검색 및 설정',
            content: '우측 상단의 돋보기 아이콘으로 항목을 검색하고, 톱니바퀴 아이콘으로 다크 모드나 테마 색상을 변경할 수 있습니다.',
            image: '<https://via.placeholder.com/400x200?text=LINO+Search+Settings>'
        }
    ];

    // --- Firebase 초기화 ---
    const firebaseConfig = {
      apiKey: "AIzaSyBwNW34weqd9WjqyT0wQAoLCYKTfl2NKq0",
      authDomain: "dashlink-74f94.firebaseapp.com",
      projectId: "dashlink-74f94",
      storageBucket: "dashlink-74f94.firebasestorage.app",
      messagingSenderId: "492786934717",
      appId: "1:492786934717:web:a625c1776c17c594a8a8d4",
      measurementId: "G-F2YEHQ0FP8"
    };

    const appFirebase = firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();
    const googleProvider = new firebase.auth.GoogleAuthProvider();

    // --- Utility Functions ---
    const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

    /**
     * 비동기 작업 시 버튼의 로딩 상태를 관리합니다.
     * @param {HTMLButtonElement} buttonElement - 로딩 상태를 변경할 버튼 요소.
     * @param {boolean} isLoading - 로딩 중인지 여부 (true: 로딩 시작, false: 로딩 종료).
     * @param {string} loadingText - 로딩 중일 때 표시할 텍스트 (기본값: "처리 중...").
     * @param {string} originalText - 버튼의 원래 텍스트 (로딩 종료 시 복원).
     */
    const setLoadingState = (buttonElement, isLoading, loadingText = "처리 중...", originalText = null) => {
        if (!buttonElement) return;

        if (isLoading) {
            buttonElement.dataset.originalText = originalText || buttonElement.textContent; // 원래 텍스트 저장
            buttonElement.textContent = loadingText;
            buttonElement.disabled = true;
            buttonElement.dataset.isloading = 'true'; // <--- 추가된 부분
            // 스피너를 추가하려면 여기에 코드를 추가할 수 있습니다.
            // 예: buttonElement.innerHTML = `<span class="loading-spinner-small"></span> ${loadingText}`;
        } else {
            buttonElement.textContent = buttonElement.dataset.originalText || originalText || "저장"; // 저장된 텍스트 또는 기본값 복원
            buttonElement.disabled = false;
            delete buttonElement.dataset.isloading; // <--- 추가된 부분
            // 스피너를 제거하려면 여기에 코드를 추가할 수 있습니다.
        }
    };


    const saveData = async () => {
        if (!currentUserUid) {
            console.warn("No user logged in. Data not saved to Firestore.");
            return;
        }
        try {
            const userDashboardsRef = db.collection('users').doc(currentUserUid).collection('dashboards');

            const existingDocs = await userDashboardsRef.get();
            const batch = db.batch();
            existingDocs.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();

            for (const dashboard of dashboards) { // dashboards는 이제 todoLists 역할을 함
                const dashboardDocRef = userDashboardsRef.doc(dashboard.id);
                await dashboardDocRef.set({
                    name: dashboard.name,
                    description: dashboard.description,
                    items: dashboard.items // links -> items 로 변경
                });
            }
            console.log("Data saved to Firestore.");
        } catch (error) {
            console.error("Error saving data to Firestore:", error);
            showToast("데이터 저장 실패: " + getFirebaseErrorMessage(error), 'error');
        }
    };

    const loadData = async () => {
        if (!currentUserUid || !isEmailVerified) {
            dashboards = [];
            renderDashboards();
            return;
        }

        try {
            const userDashboardsRef = db.collection('users').doc(currentUserUid).collection('dashboards');
            const snapshot = await userDashboardsRef.get();

            if (snapshot.empty) {
                // Initial dummy data for LINO (todo and link items)
                dashboards = [
                    {
                        id: generateUniqueId(),
                        name: '오늘 할 일',
                        description: '매일 처리해야 할 항목들입니다.',
                        items: [
                            { id: generateUniqueId(), type: 'todo', text: '점심 식사 메뉴 정하기', completed: false },
                            { id: generateUniqueId(), type: 'todo', text: '오후 회의 준비', completed: false, url: '<https://meet.google.com/abc-xyz>', linkTitle: '회의 링크', favicon: '<https://meet.google.com/favicon.ico>' },
                            { id: generateUniqueId(), type: 'link', title: '자주 사용하는 웹사이트', url: '<https://www.google.com>', favicon: '<https://www.google.com/favicon.ico>' }
                        ]
                    },
                    {
                        id: generateUniqueId(),
                        name: '쇼핑 리스트',
                        description: '구매해야 할 물품 목록입니다.',
                        items: [
                            { id: generateUniqueId(), type: 'todo', text: '우유 구매', completed: false },
                            { id: generateUniqueId(), type: 'todo', text: '달걀 구매', completed: true },
                            { id: generateUniqueId(), type: 'link', title: '온라인 쇼핑몰', url: '<https://www.coupang.com>', favicon: '<https://www.coupang.com/favicon.ico>' }
                        ]
                    }
                ];
                await saveData();
                console.log("Initial dummy data loaded and saved to Firestore.");
            } else {
                dashboards = snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    description: doc.data().description,
                    items: doc.data().items || [] // links -> items 로 변경
                }));
                console.log("Data loaded from Firestore.");
            }

            if (dashboards.length > 0) {
                currentDashboardIndex = Math.max(0, Math.min(currentDashboardIndex, dashboards.length - 1));
            } else {
                currentDashboardIndex = 0;
            }

            renderDashboards();
        } catch (error) {
            console.error("Error loading data from Firestore:", error);
            showToast("데이터 로드 실패: " + getFirebaseErrorMessage(error), 'error');
            dashboards = [];
            renderDashboards();
        }
    };

    // --- UI Rendering Functions ---
    const renderDashboards = (filterText = '') => {
        dashboardsContainer.innerHTML = '';
        dashboardPagination.innerHTML = '';

        if (!currentUserUid || !isEmailVerified) {
             emptyDashboardsState.style.display = 'flex';
             dashboardPagination.style.display = 'none';
             return;
        }

        if (dashboards.length === 0) {
            emptyDashboardsState.style.display = 'flex';
            dashboardPagination.style.display = 'none';
        } else {
            emptyDashboardsState.style.display = 'none';
            // Note: The CSS handles hiding pagination dots on desktop (width > 600px).
            // This line just ensures it's 'flex' for mobile where it's needed.
            dashboardPagination.style.display = 'flex';
        }

        dashboards.forEach((dashboard, index) => { // dashboard는 이제 todoList 역할을 함
            const dashboardCard = document.createElement('div');
            dashboardCard.className = 'dashboard-card';
            dashboardCard.dataset.dashboardId = dashboard.id;
            dashboardCard.setAttribute('role', 'region');
            dashboardCard.setAttribute('aria-label', `${dashboard.name} 투두리스트`); // aria-label 변경

            const itemListId = `items-list-${dashboard.id}`; // linkListId -> itemListId

            dashboardCard.innerHTML = `
                <div class="dashboard-card-header">
                    <div class="dashboard-card-info">
                        <h2 class="dashboard-card-name">${dashboard.name}</h2>
                        <p class="dashboard-card-description">${dashboard.description || '설명 없음'}</p>
                    </div>
                    <div class="dashboard-card-actions">
                        <button class="btn-action edit-list-btn" title="투두리스트 편집" aria-label="투두리스트 편집" data-list-id="${dashboard.id}"><span class="material-icons">edit</span></button>
                        <button class="btn-action delete-list-btn" title="투두리스트 삭제" aria-label="투두리스트 삭제" data-list-id="${dashboard.id}"><span class="material-icons">delete</span></button>
                    </div>
                </div>
                <ul id="${itemListId}" class="links-list" data-dashboard-id="${dashboard.id}" role="list" aria-label="${dashboard.name} 항목 목록">
                    <!-- Items for this list -->
                </ul>
                <button class="add-link-card-btn" data-dashboard-id="${dashboard.id}" aria-label="새 항목 추가">
                    <span class="material-icons">add</span>
                    새 항목 추가
                </button>
            `;
            dashboardsContainer.appendChild(dashboardCard);

            renderListItems(dashboard.id, itemListId, filterText); // renderLinksForDashboard -> renderListItems

            const dot = document.createElement('div');
            dot.className = `pagination-dot ${index === currentDashboardIndex ? 'active' : ''}`;
            dot.dataset.index = index;
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-controls', `dashboard-${dashboard.id}`);
            dot.setAttribute('aria-selected', index === currentDashboardIndex);
            dot.setAttribute('tabindex', index === currentDashboardIndex ? '0' : '-1');
            dashboardPagination.appendChild(dot);
        });

        scrollToDashboard(currentDashboardIndex, false);
        updatePaginationDots();
        initializeSortable();
    };

    // renderLinksForDashboard -> renderListItems
    const renderListItems = (dashboardId, containerId, filterText = '') => {
        const dashboard = dashboards.find(d => d.id === dashboardId);
        if (!dashboard) return;

        const itemsList = document.getElementById(containerId); // linksList -> itemsList
        if (!itemsList) return;

        itemsList.innerHTML = '';

        const filteredItems = dashboard.items.filter(item => { // link -> item, dashboard.links -> dashboard.items
            const searchText = filterText.toLowerCase();
            if (item.type === 'todo') {
                return item.text.toLowerCase().includes(searchText) || (item.linkTitle && item.linkTitle.toLowerCase().includes(searchText));
            } else if (item.type === 'link') {
                return item.title.toLowerCase().includes(searchText) || item.url.toLowerCase().includes(searchText);
            }
            return false;
        });

        if (filteredItems.length === 0) {
            itemsList.innerHTML = `
                <li class="empty-state-link">
                    <p>검색 결과가 없거나<br>아직 항목이 없어요.</p>
                </li>
            `;
        } else {
            filteredItems.forEach(item => { // link -> item
                const listItem = document.createElement('li'); // linkItem -> listItem
                listItem.className = `list-item ${item.completed ? 'completed' : ''}`; // list-item, completed 클래스 추가
                listItem.dataset.itemId = item.id;
                listItem.dataset.dashboardId = dashboard.id; // 부모 대시보드 ID 저장
                listItem.dataset.itemType = item.type; // 항목 유형 저장
                listItem.setAttribute('role', 'listitem');
                listItem.setAttribute('tabindex', '0');

                let itemFaviconHtml = '';
                let itemContentText = '';
                let itemContentTitleAttr = '';

                if (item.type === 'todo') {
                    // 투두 아이템의 내용
                    itemContentText = item.text;
                    itemContentTitleAttr = item.text; // 툴팁은 할 일 내용
                    // 투두 아이템에 링크가 있을 경우 파비콘 렌더링
                    if (item.url && item.favicon) {
                        itemFaviconHtml = `<img src="${item.favicon}" alt="Favicon">`;
                    } else {
                        itemFaviconHtml = `<span class="material-icons">task</span>`; // 기본 투두 아이콘
                    }
                } else { // type === 'link'
                    // 링크 아이템의 제목 및 URL
                    itemContentText = item.title;
                    itemContentTitleAttr = item.title; // 툴팁은 링크 제목
                    itemFaviconHtml = item.favicon ? `<img src="${item.favicon}" alt="${item.title} favicon">` : `<span class="material-icons">link</span>`;
                }

                listItem.innerHTML = `
                    <div class="item-status">
                        <input type="checkbox" class="item-checkbox" ${item.type === 'todo' && item.completed ? 'checked' : ''} ${item.type !== 'todo' ? 'disabled' : ''}>
                        <div class="status-separator"></div>
                    </div>
                    <div class="item-favicon ${!item.url && item.type === 'todo' ? 'hidden' : ''}"> <!-- 순수 투두일 경우 파비콘 숨김 -->
                        ${itemFaviconHtml}
                    </div>
                    <div class="item-content" title="${itemContentTitleAttr}">${itemContentText}</div>
                    <div class="item-actions">
                        <button class="btn-action edit-item-btn" title="편집" aria-label="${itemContentText} 항목 편집" data-item-id="${item.id}" data-dashboard-id="${dashboard.id}"><span class="material-icons">edit</span></button>
                        <button class="btn-action delete-item-btn" title="삭제" aria-label="${itemContentText} 항목 삭제" data-item-id="${item.id}" data-dashboard-id="${dashboard.id}"><span class="material-icons">delete</span></button>
                    </div>
                `;
                itemsList.appendChild(listItem);
            });
        }
    };

    const updatePaginationDots = () => {
        const dots = dashboardPagination.querySelectorAll('.pagination-dot');
        dots.forEach((dot, index) => {
            const isActive = (index === currentDashboardIndex);
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-selected', isActive);
            dot.setAttribute('tabindex', isActive ? '0' : '-1');
        });
    };

    const scrollToDashboard = (index, smooth = true) => {
        if (!dashboardsContainer.children[index]) {
            if (dashboards.length > 0) {
                currentDashboardIndex = Math.max(0, Math.min(currentDashboardIndex, dashboards.length - 1));
            } else {
                currentDashboardIndex = 0;
            }
            index = currentDashboardIndex;
            if (!dashboardsContainer.children[index]) return;
        }

        const scrollOptions = {
            left: dashboardsContainer.children[index].offsetLeft,
            behavior: smooth ? 'smooth' : 'auto'
        };
        dashboardsContainer.scrollTo(scrollOptions);

        const currentCard = dashboardsContainer.children[index];
        if (currentCard) {
            currentCard.focus();
        }
    };

    const applyTheme = (theme) => {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        localStorage.setItem('dashLinkTheme', theme);
        currentTheme = theme;
        themeToggles.forEach(toggle => {
            const isActive = (toggle.dataset.theme === theme);
            toggle.classList.toggle('active', isActive);
            toggle.setAttribute('aria-checked', isActive);
            toggle.setAttribute('tabindex', isActive ? '0' : '-1');
        });
    };

    const applyPrimaryColor = (color) => {
        document.documentElement.style.setProperty('--primary-color', color);

        const hexToRgb = hex => hex.match(/\\w\\w/g).map(x => parseInt(x, 16));
        const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');

        const [r, g, b] = hexToRgb(color);
        const lightR = Math.min(255, r + (255 - r) * 0.7);
        const lightG = Math.min(255, g + (255 - g) * 0.7);
        const lightB = Math.min(255, b + (255 - b) * 0.7);

        document.documentElement.style.setProperty('--primary-light', rgbToHex(lightR, lightG, lightB));

        localStorage.setItem('dashLinkPrimaryColor', color);
        currentPrimaryColor = color;

        colorSwatches.forEach(swatch => {
            const isActive = (swatch.dataset.color === color);
            swatch.classList.toggle('active', isActive);
            swatch.setAttribute('aria-checked', isActive);
            swatch.setAttribute('tabindex', isActive ? '0' : '-1');
        });
    };


    // --- Modal Functions ---
    let lastFocusedElement = null;

    const trapFocus = (modalElement) => {
        const focusableElements = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length === 0) return;

        const firstFocusableEl = focusableElements[0];
        const lastFocusableEl = focusableElements[focusableElements.length - 1];

        modalElement.addEventListener('keydown', function(e) {
            const isTabPressed = (e.key === 'Tab');
            if (!isTabPressed) return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusableEl) {
                    lastFocusableEl.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableEl) {
                    firstFocusableEl.focus();
                    e.preventDefault();
                }
            }
        });
        firstFocusableEl.focus();
    };

    const openModal = (modalElement) => {
        lastFocusedElement = document.activeElement;
        modalElement.classList.add('active');
        trapFocus(modalElement);
    };

    const closeModal = (modalElement) => {
        modalElement.classList.remove('active');
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    };

    // Function to toggle item modal fields based on type
    const toggleItemModalFields = (type) => {
        if (type === 'todo') {
            itemTextGroup.classList.remove('hidden');
            itemCompletedGroup.classList.remove('hidden');
            itemUrlGroup.classList.add('hidden');
            itemLinkTitleGroup.classList.add('hidden');
            itemTextInput.setAttribute('required', 'true');
            itemUrlInput.removeAttribute('required');
            itemLinkTitleInput.removeAttribute('required');
            // Clear URL/Link Title when switching to Todo
            itemUrlInput.value = '';
            itemLinkTitleInput.value = '';
        } else if (type === 'link') {
            itemTextGroup.classList.add('hidden');
            itemCompletedGroup.classList.add('hidden');
            itemUrlGroup.classList.remove('hidden');
            itemLinkTitleGroup.classList.remove('hidden');
            itemTextInput.removeAttribute('required');
            itemUrlInput.setAttribute('required', 'true');
            itemLinkTitleInput.setAttribute('required', 'true');
            // Clear Todo Text/Completed when switching to Link
            itemTextInput.value = '';
            itemCompletedCheckbox.checked = false;
        }
        itemForm.querySelectorAll('.error-message').forEach(el => { // Clear error messages on type change
            el.classList.add('hidden');
            el.style.height = '0';
        });
        setupFormValidation(itemForm, [itemModalSaveBtn]);
    };

    // openLinkModal -> openItemModal
    const openItemModal = (type, item = null) => { // item은 이제 링크 또는 투두 항목
        itemForm.reset();
        editingItemId = null;
        itemTextInput.classList.remove('invalid');
        itemUrlInput.classList.remove('invalid');
        itemLinkTitleInput.classList.remove('invalid');
        itemForm.querySelectorAll('.error-message').forEach(el => {
            el.classList.add('hidden');
            el.style.height = '0';
        });
        itemModalSaveBtn.disabled = true; // 초기 상태는 disabled

        // Set radio button and toggle fields based on item type
        let currentItemType = 'todo'; // Default to todo for new items
        if (type === 'add') {
            itemModalTitle.textContent = '새 항목 추가';
            itemTypeTodoRadio.checked = true;
        } else if (type === 'edit' && item) {
            itemModalTitle.textContent = '항목 편집';
            editingItemId = item.id;
            currentItemType = item.type;

            if (item.type === 'todo') {
                itemTypeTodoRadio.checked = true;
                itemTextInput.value = item.text || '';
                itemCompletedCheckbox.checked = item.completed || false;
                itemUrlInput.value = item.url || '';
                itemLinkTitleInput.value = item.linkTitle || '';
            } else if (item.type === 'link') {
                itemTypeLinkRadio.checked = true;
                itemUrlInput.value = item.url || '';
                itemLinkTitleInput.value = item.title || ''; // link title is 'title' for type 'link'
            }
        }
        toggleItemModalFields(currentItemType);
        openModal(itemModal);
        // Focus first relevant input after fields are toggled
        if (currentItemType === 'todo') itemTextInput.focus();
        else itemUrlInput.focus();
    };

    // closeLinkModal -> closeItemModal
    const closeItemModal = () => {
        closeModal(itemModal);
        editingItemId = null;
        itemTextInput.classList.remove('invalid');
        itemUrlInput.classList.remove('invalid');
        itemLinkTitleInput.classList.remove('invalid');
        itemForm.querySelectorAll('.error-message').forEach(el => {
            el.classList.add('hidden');
            el.style.height = '0';
        });
    };

    // openDashboardModal -> openListModal
    const openListModal = (type, list = null) => { // dashboard -> list
        listForm.reset();
        editingListId = null; // editingDashboardId -> editingListId
        listNameInput.classList.remove('invalid'); // dashboardNameInput -> listNameInput
        listForm.querySelectorAll('.error-message').forEach(el => {
            el.classList.add('hidden');
            el.style.height = '0';
        });
        listModalSaveBtn.disabled = true; // 초기 상태는 disabled

        if (type === 'add') {
            listModalTitle.textContent = '새 투두리스트 추가'; // 타이틀 변경
        } else if (type === 'edit' && list) { // dashboard -> list
            listModalTitle.textContent = '투두리스트 편집'; // 타이틀 변경
            editingListId = list.id;
            listNameInput.value = list.name;
            listDescriptionInput.value = list.description || '';
        }
        openModal(listModal);
        setupFormValidation(listForm, [listModalSaveBtn]);
    };

    // closeDashboardModal -> closeListModal
    const closeListModal = () => {
        closeModal(listModal);
        editingListId = null;
        listNameInput.classList.remove('invalid');
        listForm.querySelectorAll('.error-message').forEach(el => {
            el.classList.add('hidden');
            el.style.height = '0';
        });
    };

    // --- Toast Message Function (기존과 동일) ---

    const showToast = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);

        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');

        setTimeout(() => {
            toast.remove();
        }, 3000);
    };

    // Firebase 에러 메시지를 사용자 친화적으로 변환
    const getFirebaseErrorMessage = (error) => {
        console.log("Firebase error code:", error.code);
        switch (error.code) {
            case 'auth/invalid-login-credentials':
                return '이메일 또는 비밀번호가 올바르지 않습니다. 다시 확인해주세요.';
            case 'auth/email-already-in-use':
                return '이미 사용 중인 이메일 주소입니다.';
            case 'auth/invalid-email':
                return '유효하지 않은 이메일 주소입니다.';
            case 'auth/operation-not-allowed':
                return '이메일/비밀번호 로그인이 비활성화되었습니다.';
            case 'auth/weak-password':
                return '비밀번호는 6자 이상이어야 합니다.';
            case 'auth/user-disabled':
                return '비활성화된 사용자 계정입니다.';
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return '이메일 또는 비밀번호가 일치하지 않습니다.';
            case 'auth/too-many-requests':
                return '로그인/가입 시도 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요.';
            case 'auth/popup-closed-by-user':
                return '팝업창이 닫혔습니다. 다시 시도해주세요.';
            case 'auth/cancelled-popup-request':
                return '이미 팝업창 요청이 진행 중입니다.';
            default:
                return '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.';
        }
    };


    // --- Form Validation Functions (수정된 부분) ---
    const validateForm = (formElement) => {
        let isValid = true;
        const inputs = formElement.querySelectorAll('input[required]:not([type="radio"]), textarea[required]'); // 라디오 버튼은 required에서 제외

        inputs.forEach(input => {
            const errorMsg = input.nextElementSibling;
            const isErrorMessageElement = errorMsg && errorMsg.classList.contains('error-message');

            if (input.value.trim() === '') {
                input.classList.add('invalid');
                if (isErrorMessageElement) {
                    errorMsg.textContent = `${input.previousElementSibling.textContent.replace(' (선택)', '').replace(' (자동 추출 예정)', '')}을(를) 입력해주세요.`; // 레이블 텍스트에서 ' (선택)' 제거
                    errorMsg.classList.add('visible');
                    errorMsg.style.height = `${errorMsg.scrollHeight}px`;
                }
                isValid = false;
            } else {
                input.classList.remove('invalid');
                if (isErrorMessageElement) {
                    errorMsg.classList.remove('visible');
                    errorMsg.style.height = '0';
                }
            }

            if (input.type === 'url' && input.value.trim() !== '' && !input.classList.contains('invalid')) {
                try {
                    new URL(input.value.trim());
                    input.classList.remove('invalid');
                    if (isErrorMessageElement) {
                        errorMsg.classList.remove('visible');
                        errorMsg.style.height = '0';
                    }
                } catch (e) {
                    input.classList.add('invalid');
                    if (isErrorMessageElement) {
                        errorMsg.textContent = '유효한 URL 형식이어야 합니다.';
                        errorMsg.classList.add('visible');
                        errorMsg.style.height = `${errorMsg.scrollHeight}px`;
                    }
                    isValid = false;
                }
            }
        });

        // Item Modal specific validation (conditional required fields)
        if (formElement.id === 'item-form') {
            const selectedType = document.querySelector('input[name="item-type"]:checked').value;

            if (selectedType === 'todo') {
                if (itemTextInput.value.trim() === '') {
                    itemTextInput.classList.add('invalid');
                    if (itemTextInput.nextElementSibling && itemTextInput.nextElementSibling.classList.contains('error-message')) {
                        itemTextInput.nextElementSibling.textContent = '할 일 내용을 입력해주세요.';
                        itemTextInput.nextElementSibling.classList.add('visible');
                        itemTextInput.nextElementSibling.style.height = `${itemTextInput.nextElementSibling.scrollHeight}px`;
                    }
                    isValid = false;
                }
            } else if (selectedType === 'link') {
                if (itemUrlInput.value.trim() === '') {
                    itemUrlInput.classList.add('invalid');
                    if (itemUrlInput.nextElementSibling && itemUrlInput.nextElementSibling.classList.contains('error-message')) {
                        itemUrlInput.nextElementSibling.textContent = '링크 URL을 입력해주세요.';
                        itemUrlInput.nextElementSibling.classList.add('visible');
                        itemUrlInput.nextElementSibling.style.height = `${itemUrlInput.nextElementSibling.scrollHeight}px`;
                    }
                    isValid = false;
                }
                if (itemLinkTitleInput.value.trim() === '') {
                    itemLinkTitleInput.classList.add('invalid');
                    if (itemLinkTitleInput.nextElementSibling && itemLinkTitleInput.nextElementSibling.classList.contains('error-message')) {
                        itemLinkTitleInput.nextElementSibling.textContent = '링크 제목을 입력해주세요.';
                        itemLinkTitleInput.nextElementSibling.classList.add('visible');
                        itemLinkTitleInput.nextElementSibling.style.height = `${itemLinkTitleInput.nextElementSibling.scrollHeight}px`;
                    }
                    isValid = false;
                }
            }
        }
        return isValid;
    };

    const setupFormValidation = (formElement, saveButtons) => {
        const inputs = formElement.querySelectorAll('input:not([type="radio"]), textarea'); // 모든 입력 필드를 포함

        const checkFormValidity = () => {
            const isValid = validateForm(formElement);
            saveButtons.forEach(button => {
                if (button.dataset.isloading !== 'true') {
                     button.disabled = !isValid;
                }
            });
        };

        inputs.forEach(input => {
            input.addEventListener('input', checkFormValidity);
            input.addEventListener('blur', checkFormValidity);
        });

        // Item type radios also need to trigger validation check
        if (formElement.id === 'item-form') {
            document.querySelectorAll('input[name="item-type"]').forEach(radio => {
                radio.addEventListener('change', checkFormValidity);
            });
        }

        checkFormValidity(); // 초기 유효성 검사 실행
    };

    // --- Event Handlers ---

    // General Login Button Toggle (펼침 버그 수정)
    generalLoginBtn.addEventListener('click', () => {
        const isVisible = generalLoginForm.classList.contains('visible');

        if (!isVisible) {
            generalLoginForm.classList.add('visible');
            generalLoginBtn.setAttribute('aria-expanded', 'true');
            loginEmailInput.focus();

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const fullHeight = generalLoginForm.scrollHeight;
                    generalLoginForm.style.height = `${fullHeight}px`;
                    generalLoginForm.addEventListener('transitionend', function handler() {
                        if (generalLoginForm.classList.contains('visible')) {
                            generalLoginForm.style.height = 'auto';
                        }
                        generalLoginForm.removeEventListener('transitionend', handler);
                    }, { once: true });
                });
            });

        } else {
            generalLoginForm.style.height = `${generalLoginForm.scrollHeight}px`;
            generalLoginBtn.setAttribute('aria-expanded', 'false');

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    generalLoginForm.style.height = '0';
                    generalLoginForm.addEventListener('transitionend', function handler() {
                        generalLoginForm.classList.remove('visible');
                        generalLoginForm.removeEventListener('transitionend', handler);
                    }, { once: true });
                });
            });
        }
        setupFormValidation(generalLoginForm, [loginSubmitBtn, signupSubmitBtn]);
    });

    // 일반 로그인 제출 (로그인 전용)
    loginSubmitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!validateForm(generalLoginForm)) {
            showToast('이메일과 비밀번호를 올바르게 입력해주세요.', 'error');
            return;
        }

        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value.trim();

        setLoadingState(loginSubmitBtn, true, "로그인 중...");
        setLoadingState(signupSubmitBtn, true); // 다른 버튼도 잠시 비활성화
        setLoadingState(googleLoginBtn, true);

        try {
            await auth.signInWithEmailAndPassword(email, password);
            showToast('로그인 성공!');
        } catch (error) {
            showToast('로그인 실패: ' + getFirebaseErrorMessage(error), 'error');
            console.error("Login error:", error);
        } finally {
            setLoadingState(loginSubmitBtn, false, "로그인");
            setLoadingState(signupSubmitBtn, false, "회원가입"); // 원래 텍스트 복원
            setLoadingState(googleLoginBtn, false, "Google로 시작하기"); // 원래 텍스트 복원
            if (generalLoginForm.classList.contains('visible')) {
                generalLoginForm.style.height = `${generalLoginForm.scrollHeight}px`;
                void generalLoginForm.offsetWidth; // Force reflow
                generalLoginForm.style.height = '0';
                generalLoginForm.addEventListener('transitionend', function handler() {
                    generalLoginForm.classList.remove('visible');
                    generalLoginForm.removeEventListener('transitionend', handler);
                }, { once: true });
            }
        }
    });

    // 회원가입 제출 (회원가입 전용)
    signupSubmitBtn.addEventListener('click', async () => {
        if (!validateForm(generalLoginForm)) {
            showToast('이메일과 비밀번호를 올바르게 입력해주세요.', 'error');
            return;
        }

        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value.trim();

        setLoadingState(signupSubmitBtn, true, "가입 중...");
        setLoadingState(loginSubmitBtn, true); // 다른 버튼도 잠시 비활성화
        setLoadingState(googleLoginBtn, true);

        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            await userCredential.user.sendEmailVerification();
            showToast('회원가입 성공! 이메일 인증 메일을 보냈습니다. 메일함을 확인해주세요.', 'info');
        } catch (error) {
            showToast('회원가입 실패: ' + getFirebaseErrorMessage(error), 'error');
            console.error("Signup error:", error);
        } finally {
            setLoadingState(signupSubmitBtn, false, "회원가입");
            setLoadingState(loginSubmitBtn, false, "로그인"); // 원래 텍스트 복원
            setLoadingState(googleLoginBtn, false, "Google로 시작하기"); // 원래 텍스트 복원
            if (generalLoginForm.classList.contains('visible')) {
                generalLoginForm.style.height = `${generalLoginForm.scrollHeight}px`;
                void generalLoginForm.offsetWidth; // Force reflow
                generalLoginForm.style.height = '0';
                generalLoginForm.addEventListener('transitionend', function handler() {
                    generalLoginForm.classList.remove('visible');
                    generalLoginForm.removeEventListener('transitionend', handler);
                }, { once: true });
            }
        }
    });

    // Google 로그인
    googleLoginBtn.addEventListener('click', async () => {
        setLoadingState(googleLoginBtn, true, "Google 로그인 중...");
        setLoadingState(loginSubmitBtn, true);
        setLoadingState(signupSubmitBtn, true);

        try {
            await auth.signInWithPopup(googleProvider);
            showToast('Google 로그인 성공!');
        } catch (error) {
            showToast('Google 로그인 실패: ' + getFirebaseErrorMessage(error), 'error');
            console.error("Google login error:", error);
        } finally {
            setLoadingState(googleLoginBtn, false, "Google로 시작하기");
            setLoadingState(loginSubmitBtn, false, "로그인"); // 원래 텍스트 복원
            setLoadingState(signupSubmitBtn, false, "회원가입"); // 원래 텍스트 복원
        }
    });

    // 비밀번호 재설정 기능
    forgotPasswordBtn.addEventListener('click', async () => {
        const email = loginEmailInput.value.trim();
        if (!email) {
            showToast('비밀번호 재설정 이메일을 입력해주세요.', 'info');
            loginEmailInput.focus();
            return;
        }

        setLoadingState(forgotPasswordBtn, true, "재설정 중...");
        setLoadingState(loginSubmitBtn, true);
        setLoadingState(signupSubmitBtn, true);
        setLoadingState(googleLoginBtn, true);

        try {
            await auth.sendPasswordResetEmail(email);
            showToast(`비밀번호 재설정 이메일이 ${email} (으)로 전송되었습니다.`, 'info');
        } catch (error) {
            showToast('비밀번호 재설정 실패: ' + getFirebaseErrorMessage(error), 'error');
            console.error("Password reset error:", error);
        } finally {
            setLoadingState(forgotPasswordBtn, false, "비밀번호 재설정");
            setLoadingState(loginSubmitBtn, false, "로그인");
            setLoadingState(signupSubmitBtn, false, "회원가입");
            setLoadingState(googleLoginBtn, false, "Google로 시작하기");
        }
    });


    // Logout
    logoutBtn.addEventListener('click', async () => {
        setLoadingState(logoutBtn, true, "로그아웃 중...", "로그아웃");
        try {
            await auth.signOut();
            showToast('로그아웃 되었습니다.');
            dashboards = [];
            renderDashboards();
        } catch (error) {
            showToast('로그아웃 실패: ' + getFirebaseErrorMessage(error), 'error');
            console.error("Logout error:", error);
        } finally {
            setLoadingState(logoutBtn, false, "로그아웃", "로그아웃");
        }
    });

    // Toggle Search Bar (기존과 동일)
    searchBtn.addEventListener('click', () => {
        const isVisible = searchBarContainer.classList.toggle('visible');
        searchBtn.setAttribute('aria-expanded', isVisible);
        if (isVisible) {
            searchInput.focus();
        } else {
            searchInput.value = '';
            renderDashboards();
        }
    });
    searchCloseBtn.addEventListener('click', () => {
        searchBarContainer.classList.remove('visible');
        searchBtn.setAttribute('aria-expanded', 'false');
        searchInput.value = '';
        renderDashboards();
        searchBtn.focus();
    });
    searchInput.addEventListener('input', () => {
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            renderDashboards(searchInput.value);
        }, 300);
    });

    // Add Dashboard Button (Header icon button and Empty State) (이메일 인증 확인 추가)
    addDashboardGlobalBtn.addEventListener('click', () => {
        if (!currentUserUid || !isEmailVerified) {
            showToast('로그인 후 이메일 인증을 완료해야 합니다.', 'error');
            return;
        }
        openListModal('add'); // openDashboardModal -> openListModal
    });
    emptyAddDashboardBtn.addEventListener('click', () => {
        if (!currentUserUid || !isEmailVerified) {
            showToast('로그인 후 이메일 인증을 완료해야 합니다.', 'error');
            return;
        }
        openListModal('add'); // openDashboardModal -> openListModal
    });

    // Dashboard Form Submission (Firestore) // listForm.addEventListener
    listForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm(listForm)) {
            showToast('투두리스트 정보를 올바르게 입력해주세요.', 'error'); // 텍스트 변경
            return;
        }
        if (!currentUserUid || !isEmailVerified) {
            showToast('로그인 후 이메일 인증을 완료해야 합니다.', 'error');
            return;
        }

        const name = listNameInput.value.trim(); // dashboardNameInput -> listNameInput
        const description = listDescriptionInput.value.trim(); // dashboardDescriptionInput -> listDescriptionInput

        setLoadingState(listModalSaveBtn, true, "저장 중..."); // dashboardModalSaveBtn -> listModalSaveBtn

        try {
            if (editingListId) { // editingDashboardId -> editingListId
                await db.collection('users').doc(currentUserUid).collection('dashboards').doc(editingListId).update({
                    name: name,
                    description: description
                });
                showToast('투두리스트가 수정되었습니다.'); // 텍스트 변경
            } else {
                const newDashboardRef = await db.collection('users').doc(currentUserUid).collection('dashboards').add({
                    name: name,
                    description: description,
                    items: [] // links -> items
                });
                dashboards.push({
                    id: newDashboardRef.id,
                    name: name,
                    description: description,
                    items: [] // links -> items
                });
                currentDashboardIndex = dashboards.length - 1;
                showToast('새 투두리스트가 추가되었습니다.'); // 텍스트 변경
            }
            await loadData();
            closeListModal(); // closeDashboardModal -> closeListModal
        } catch (error) {
            showToast('투두리스트 저장/수정 실패: ' + getFirebaseErrorMessage(error), 'error'); // 텍스트 변경
            console.error("List save error:", error);
        } finally {
            setLoadingState(listModalSaveBtn, false, "저장");
        }
    });

    // Dashboard Modal Cancel & Close on outside click
    listModalCancelBtn.addEventListener('click', closeListModal); // dashboardModalCancelBtn -> listModalCancelBtn
    listModal.addEventListener('click', (e) => { // dashboardModal -> listModal
        if (e.target === listModal) {
            closeListModal();
        }
    });

    // Item Type radio button change listener
    document.querySelectorAll('input[name="item-type"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            toggleItemModalFields(e.target.value);
        });
    });

    // Simulate URL info extraction with loading state for item-url-input
    itemUrlInput.addEventListener('blur', () => {
        const url = itemUrlInput.value.trim();
        const selectedType = document.querySelector('input[name="item-type"]:checked').value;

        // Only attempt to extract if it's a link type or a todo with a URL,
        // and if URL is valid and title/favicon not yet populated.
        if (url && !itemUrlInput.classList.contains('invalid')) {
            let shouldPopulate = false;
            if (selectedType === 'todo' && !itemLinkTitleInput.value) { // Todo with optional link
                shouldPopulate = true;
            } else if (selectedType === 'link' && !itemLinkTitleInput.value) { // Pure link
                shouldPopulate = true;
            }

            if (shouldPopulate) {
                faviconLoadingSpinner.classList.remove('hidden');
                setTimeout(() => {
                    try {
                        const parsedUrl = new URL(url);
                        // For todo type, populate linkTitle. For link type, populate itemLinkTitleInput
                        if (selectedType === 'todo') {
                            itemLinkTitleInput.value = parsedUrl.hostname;
                        } else { // type === 'link'
                            itemLinkTitleInput.value = parsedUrl.hostname;
                        }
                        // Favicon logic for both types if URL is present
                        // This favicon URL will be saved with the item data
                        itemUrlInput.dataset.favicon = `${parsedUrl.origin}/favicon.ico`;

                        showToast('URL 정보를 임시로 채웠습니다.', 'info');
                    } catch (e) {
                        // Invalid URL, validation message already shown.
                    } finally {
                        faviconLoadingSpinner.classList.add('hidden');
                        setupFormValidation(itemForm, [itemModalSaveBtn]);
                    }
                }, 800);
            }
        }
    });

    // Item Form Submission (Firestore)
    itemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm(itemForm)) {
            showToast('항목 정보를 올바르게 입력해주세요.', 'error');
            return;
        }
        if (!currentUserUid || !isEmailVerified) {
            showToast('로그인 후 이메일 인증을 완료해야 합니다.', 'error');
            return;
        }

        const selectedType = document.querySelector('input[name="item-type"]:checked').value;
        const currentDashboard = dashboards[currentDashboardIndex]; // items -> items
        if (!currentDashboard) {
            showToast('현재 투두리스트를 찾을 수 없습니다. 투두리스트를 먼저 추가해주세요.', 'error');
            return;
        }

        setLoadingState(itemModalSaveBtn, true, "저장 중...");

        try {
            let newItem;
            if (selectedType === 'todo') {
                const text = itemTextInput.value.trim();
                const completed = itemCompletedCheckbox.checked;
                const url = itemUrlInput.value.trim();
                const linkTitle = itemLinkTitleInput.value.trim();
                const favicon = url ? itemUrlInput.dataset.favicon || `${new URL(url).origin}/favicon.ico` : '';

                newItem = {
                    id: editingItemId || generateUniqueId(),
                    type: 'todo',
                    text: text,
                    completed: completed,
                    url: url,
                    linkTitle: linkTitle,
                    favicon: favicon
                };
            } else { // type === 'link'
                const title = itemLinkTitleInput.value.trim(); // linkTitleInput is used for link title
                const url = itemUrlInput.value.trim();
                const favicon = url ? itemUrlInput.dataset.favicon || `${new URL(url).origin}/favicon.ico` : '';

                newItem = {
                    id: editingItemId || generateUniqueId(),
                    type: 'link',
                    title: title,
                    url: url,
                    favicon: favicon
                };
            }

            if (editingItemId) {
                currentDashboard.items = currentDashboard.items.map(item => // link -> item
                    item.id === editingItemId ? newItem : item
                );
                showToast('항목이 수정되었습니다.');
            } else {
                currentDashboard.items.push(newItem); // link -> item
                showToast('새 항목이 추가되었습니다.');
            }

            await db.collection('users').doc(currentUserUid).collection('dashboards').doc(currentDashboard.id).update({
                items: currentDashboard.items // links -> items
            });

            renderListItems(currentDashboard.id, `items-list-${currentDashboard.id}`, searchInput.value); // link -> item
            closeItemModal(); // closeLinkModal -> closeItemModal
        } catch (error) {
            showToast('항목 저장/수정 실패: ' + getFirebaseErrorMessage(error), 'error');
            console.error("Item save error:", error);
        } finally {
            setLoadingState(itemModalSaveBtn, false, "저장");
        }
    });

    // Item Modal Cancel & Close on outside click
    itemModalCancelBtn.addEventListener('click', closeItemModal); // linkModalCancelBtn -> itemModalCancelBtn
    itemModal.addEventListener('click', (e) => { // linkModal -> itemModal
        if (e.target === itemModal) {
            closeItemModal();
        }
    });

    // Global Add Item button (adds to current dashboard)
    addLinkGlobalBtn.addEventListener('click', () => {
        if (!currentUserUid || !isEmailVerified) {
            showToast('로그인 후 이메일 인증을 완료해야 합니다.', 'error');
            return;
        }
        if (dashboards.length === 0) {
            showToast('항목을 추가하려면 먼저 투두리스트를 만들어주세요.', 'error'); // 텍스트 변경
            return;
        }
        openItemModal('add'); // openLinkModal -> openItemModal
    });

    // --- Delegated Event Listeners for Dynamic Elements ---

    dashboardsContainer.addEventListener('click', async (e) => {
        const dashboardCard = e.target.closest('.dashboard-card');
        if (!dashboardCard) return;

        const dashboardId = dashboardCard.dataset.dashboardId;
        const currentDashboard = dashboards.find(d => d.id === dashboardId);
        if (!currentDashboard) return;

        if (!currentUserUid || !isEmailVerified) {
            showToast('로그인 후 이메일 인증을 완료해야 합니다.', 'error');
            return;
        }

        const editListBtn = e.target.closest('.edit-list-btn'); // edit-dashboard-btn -> edit-list-btn
        const deleteListBtn = e.target.closest('.delete-list-btn'); // delete-dashboard-btn -> delete-list-btn

        if (editListBtn) {
            e.stopPropagation();
            openListModal('edit', currentDashboard); // openDashboardModal -> openListModal
        } else if (deleteListBtn) {
            e.stopPropagation();
            if (confirm(`'${currentDashboard.name}' 투두리스트를 정말 삭제하시겠습니까? (포함된 항목도 모두 삭제됩니다)`)) { // 텍스트 변경
                setLoadingState(deleteListBtn, true, '', `<span class="material-icons">delete</span>`); // 아이콘 버튼 로딩
                try {
                    await db.collection('users').doc(currentUserUid).collection('dashboards').doc(dashboardId).delete();
                    showToast('투두리스트가 삭제되었습니다.'); // 텍스트 변경
                    await loadData();
                    if (dashboards.length > 0) {
                        if (currentDashboardIndex >= dashboards.length) {
                            currentDashboardIndex = dashboards.length - 1;
                        }
                    } else {
                        currentDashboardIndex = 0;
                    }
                } catch (error) {
                    showToast('투두리스트 삭제 실패: ' + getFirebaseErrorMessage(error), 'error'); // 텍스트 변경
                    console.error("List delete error:", error);
                } finally {
                    setLoadingState(deleteListBtn, false, '', `<span class="material-icons">delete</span>`);
                }
            }
        } else if (e.target.closest('.add-link-card-btn')) { // add-link-card-btn (class name not changed)
            e.stopPropagation();
            currentDashboardIndex = dashboards.findIndex(d => d.id === dashboardId);
            scrollToDashboard(currentDashboardIndex);
            updatePaginationDots();
            openItemModal('add'); // openLinkModal -> openItemModal
        }
    });

    dashboardsContainer.addEventListener('click', async (e) => {
        const listItem = e.target.closest('.list-item'); // linkItem -> listItem
        if (!listItem) return;

        const itemId = listItem.dataset.itemId; // linkId -> itemId
        const dashboardId = listItem.dataset.dashboardId; // Get from listItem data attribute
        const targetDashboard = dashboards.find(d => d.id === dashboardId);
        const targetItem = targetDashboard?.items.find(item => item.id === itemId); // targetLink -> targetItem, links -> items
        if (!targetItem) return;

        if (!currentUserUid || !isEmailVerified) {
            showToast('로그인 후 이메일 인증을 완료해야 합니다.', 'error');
            return;
        }

        const editItemBtn = e.target.closest('.edit-item-btn'); // edit-link-btn -> edit-item-btn
        const deleteItemBtn = e.target.closest('.delete-item-btn'); // delete-link-btn -> delete-item-btn
        const itemCheckbox = e.target.closest('.item-checkbox'); // New: checkbox click

        if (itemCheckbox) { // Handle checkbox click
            e.stopPropagation(); // Prevent parent li click
            targetItem.completed = itemCheckbox.checked; // Update item's completed status

            setLoadingState(itemCheckbox, true); // Basic loading state for checkbox
            try {
                await db.collection('users').doc(currentUserUid).collection('dashboards').doc(dashboardId).update({
                    items: targetDashboard.items
                });
                // Update UI without full re-render, by toggling class
                listItem.classList.toggle('completed', targetItem.completed);
                showToast(targetItem.completed ? '할 일을 완료했습니다!' : '할 일을 미완료로 변경했습니다.');
            } catch (error) {
                showToast('상태 변경 실패: ' + getFirebaseErrorMessage(error), 'error');
                console.error("Toggle completed error:", error);
                itemCheckbox.checked = !itemCheckbox.checked; // Revert checkbox state on error
            } finally {
                setLoadingState(itemCheckbox, false); // Turn off loading state
            }

        } else if (editItemBtn) { // Handle edit button click
            e.stopPropagation();
            openItemModal('edit', targetItem); // openLinkModal -> openItemModal

        } else if (deleteItemBtn) { // Handle delete button click
            e.stopPropagation();
            if (confirm(`'${targetItem.type === 'todo' ? targetItem.text : targetItem.title}' 항목을 정말 삭제하시겠습니까?`)) { // 텍스트 변경
                setLoadingState(deleteItemBtn, true, '', `<span class="material-icons">delete</span>`);
                try {
                    const itemIndexToRemove = targetDashboard.items.findIndex(item => item.id === itemId); // link -> item
                    if (itemIndexToRemove > -1) {
                        targetDashboard.items.splice(itemIndexToRemove, 1);
                    }

                    await db.collection('users').doc(currentUserUid).collection('dashboards').doc(dashboardId).update({
                        items: targetDashboard.items // links -> items
                    });
                    showToast('항목이 삭제되었습니다.'); // 텍스트 변경
                    renderListItems(dashboardId, listItem.closest('.links-list').id, searchInput.value); // link -> item
                } catch (error) {
                    showToast('항목 삭제 실패: ' + getFirebaseErrorMessage(error), 'error'); // 텍스트 변경
                    console.error("Item delete error:", error);
                } finally {
                    setLoadingState(deleteItemBtn, false, '', `<span class="material-icons">delete</span>`);
                }
            }
        } else { // Handle click on the item itself (not checkbox or buttons)
            // If it's a link item, or a todo item with a URL, open the URL
            if (targetItem.type === 'link' || (targetItem.type === 'todo' && targetItem.url)) {
                window.open(targetItem.url, '_blank');
            } else {
                // For pure todo items, clicking them can open the edit modal
                openItemModal('edit', targetItem);
            }
        }
    });


    // Pagination dot click (mobile) (기존과 동일)
    dashboardPagination.addEventListener('click', (e) => {
        if (e.target.classList.contains('pagination-dot')) {
            const index = parseInt(e.target.dataset.index);
            if (index !== currentDashboardIndex) {
                currentDashboardIndex = index;
                scrollToDashboard(currentDashboardIndex);
                updatePaginationDots();
            }
        }
    });

    // Swiper scroll event to update current dashboard index (기존과 동일)
    let scrollTimeout;
    dashboardsContainer.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const cardElements = Array.from(dashboardsContainer.children).filter(el => el.classList.contains('dashboard-card'));

            if (cardElements.length === 0) return;

            let closestIndex = 0;
            let minDiff = Infinity;

            cardElements.forEach((card, index) => {
                const diff = Math.abs(card.offsetLeft - dashboardsContainer.scrollLeft);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex = index;
                }
            });

            if (closestIndex !== currentDashboardIndex) {
                currentDashboardIndex = closestIndex;
                updatePaginationDots();
            }
        }, 100);
    });

    // --- Modified: Desktop vertical scroll to horizontal navigation ---
    dashboardsContainer.addEventListener('wheel', (e) => {
        // Only apply on desktop (where dashboards are horizontal and there's no mobile pagination)
        // Check if the primary mouse button is not pressed (to avoid interfering with drag-scrolling)
        if (e.buttons === 0 && window.innerWidth > 600) {
            e.preventDefault(); // Prevent default vertical scroll

            const firstCard = dashboardsContainer.querySelector('.dashboard-card');
            if (!firstCard) return;

            // Calculate the exact width of a single card including its right margin/gap
            // The gap is 24px, and the card width is calc(100% / 3 - (24px * 2 / 3))
            // This calculation gives the distance needed to scroll to see the start of the next card cleanly.
            const cardWidthWithGap = firstCard.offsetWidth + 24; // Assuming 24px gap between cards

            let targetScrollLeft;
            const scrollDirection = e.deltaY > 0 ? 1 : -1; // 1 for down (move right), -1 for up (move left)

            // Determine the target scroll position based on current scroll and card width
            if (scrollDirection > 0) { // Scroll down -> move right
                targetScrollLeft = dashboardsContainer.scrollLeft + cardWidthWithGap;
            } else { // Scroll up -> move left
                targetScrollLeft = dashboardsContainer.scrollLeft - cardWidthWithGap;
            }

            // Ensure targetScrollLeft is within valid boundaries
            targetScrollLeft = Math.max(0, Math.min(targetScrollLeft, dashboardsContainer.scrollWidth - dashboardsContainer.clientWidth));

            // Perform the smooth scroll
            dashboardsContainer.scrollTo({
                left: targetScrollLeft,
                behavior: 'smooth'
            });

            // No need to update currentDashboardIndex or pagination dots here immediately.
            // The existing 'scroll' event listener will handle this once the smooth scroll settles.
        }
    }, { passive: false }); // `passive: false` is required to allow `e.preventDefault()`


    // Ensure scroll position is correct on resize (이메일 인증 여부 확인 추가)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (currentUserUid && isEmailVerified && dashboards.length > 0) {
                 scrollToDashboard(currentDashboardIndex, false);
            }
        }, 200);
    });

    // --- Settings Modal (기존과 동일) ---
    settingsBtn.addEventListener('click', () => {
        openModal(settingsModal);
        settingsBtn.setAttribute('aria-expanded', 'true');
    });
    settingsModalCloseBtn.addEventListener('click', () => {
        closeModal(settingsModal);
        settingsBtn.setAttribute('aria-expanded', 'false');
        settingsBtn.focus();
    });
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            closeModal(settingsModal);
            settingsBtn.setAttribute('aria-expanded', 'false');
            settingsBtn.focus();
        }
    });

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            applyTheme(toggle.dataset.theme);
        });
    });

    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            applyPrimaryColor(swatch.dataset.color);
        });
        swatch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                applyPrimaryColor(swatch.dataset.color);
            }
        });
    });

    // --- SortableJS Initialization (Firestore 데이터 변경 반영 및 이메일 인증 확인 추가) ---
    let dashboardsSortable;
    let linksSortables = {}; // linksSortables는 이제 itemSortables

    const initializeSortable = () => {
        if (dashboardsSortable) {
            dashboardsSortable.destroy();
        }
        for (const key in linksSortables) { // linksSortables -> itemSortables
            if (linksSortables[key]) {
                linksSortables[key].destroy();
            }
        }
        linksSortables = {}; // linksSortables -> itemSortables (reset)

        // Sortable for Dashboards (horizontal)
        if (currentUserUid && isEmailVerified) {
            dashboardsSortable = Sortable.create(dashboardsContainer, {
                animation: 150,
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                fallbackClass: 'sortable-fallback',
                handle: '.dashboard-card-header',
                forceFallback: true,
                onEnd: async function (evt) {
                    const oldIndex = evt.oldIndex;
                    const newIndex = evt.newIndex;

                    if (oldIndex !== newIndex) {
                        const [movedDashboard] = dashboards.splice(oldIndex, 1);
                        dashboards.splice(newIndex, 0, movedDashboard);
                        await saveData();
                        currentDashboardIndex = newIndex;
                        updatePaginationDots();
                        showToast('투두리스트 순서가 변경되었습니다.'); // 텍스트 변경
                        renderDashboards(searchInput.value);
                    }
                }
            });

            // Sortable for Items within each List (vertical)
            dashboards.forEach(dashboard => { // dashboard는 이제 todoList
                const itemsListElement = document.getElementById(`items-list-${dashboard.id}`); // linksListElement -> itemsListElement
                if (itemsListElement) {
                    linksSortables[dashboard.id] = Sortable.create(itemsListElement, { // linksSortables -> itemSortables
                        animation: 150,
                        group: 'items', // group: 'links' -> 'items'
                        ghostClass: 'sortable-ghost',
                        chosenClass: 'sortable-chosen',
                        fallbackClass: 'sortable-fallback',
                        handle: '.list-item', // .link-item -> .list-item
                        forceFallback: true,
                        onEnd: async function (evt) {
                            const newIndex = evt.newIndex;
                            const fromDashboardId = evt.from.dataset.dashboardId;
                            const toDashboardId = evt.to.dataset.dashboardId;
                            const draggedItemId = evt.item.dataset.itemId; // draggedLinkId -> draggedItemId

                            const fromDashboard = dashboards.find(d => d.id === fromDashboardId);
                            const toDashboard = dashboards.find(d => d.id === toDashboardId);

                            if (!fromDashboard || !toDashboard) {
                                console.error('Source or target list not found.');
                                return;
                            }

                            const movedItemIndex = fromDashboard.items.findIndex(item => item.id === draggedItemId); // links -> items, link -> item
                            if (movedItemIndex === -1) {
                                console.error('Dragged item not found in source list items array.');
                                return;
                            }
                            const [movedItem] = fromDashboard.items.splice(movedItemIndex, 1); // link -> item


                            if (fromDashboardId === toDashboardId) {
                                toDashboard.items.splice(newIndex, 0, movedItem); // links -> items
                                showToast('항목 순서가 변경되었습니다.'); // 텍스트 변경
                            } else {
                                toDashboard.items.splice(newIndex, 0, movedItem); // links -> items
                                showToast('항목이 다른 투두리스트로 이동했습니다.'); // 텍스트 변경
                            }

                            try {
                                await db.collection('users').doc(currentUserUid).collection('dashboards').doc(fromDashboardId).update({
                                    items: fromDashboard.items // links -> items
                                });
                                if (fromDashboardId !== toDashboardId) {
                                    await db.collection('users').doc(currentUserUid).collection('dashboards').doc(toDashboardId).update({
                                        items: toDashboard.items // links -> items
                                    });
                                }
                                renderListItems(fromDashboardId, `items-list-${fromDashboardId}`, searchInput.value); // link -> item
                                if (fromDashboardId !== toDashboardId) {
                                    renderListItems(toDashboardId, `items-list-${toDashboardId}`, searchInput.value); // link -> item
                                }
                            } catch (error) {
                                showToast('항목 이동/순서 변경 실패: ' + getFirebaseErrorMessage(error), 'error'); // 텍스트 변경
                                console.error("Sortable item update error:", error);
                            }
                        }
                    });
                }
            });
        }
    };

    // --- Onboarding Tutorial Logic (기존과 동일) ---
    const showTutorialStep = (stepIndex) => {
        if (stepIndex < 0 || stepIndex >= tutorialSteps.length) {
            closeModal(tutorialModal);
            localStorage.setItem('hasSeenDashLinkTutorial', 'true');
            hasSeenTutorial = true;
            return;
        }

        const step = tutorialSteps[stepIndex];
        tutorialContent.innerHTML = `
            <h3>${step.title}</h3>
            <p>${step.content}</p>
            ${step.image ? `<img src="${step.image}" alt="${step.title}" class="tutorial-img">` : ''}
        `;

        tutorialPrevBtn.classList.toggle('hidden', stepIndex === 0);
        tutorialNextBtn.classList.toggle('hidden', stepIndex === tutorialSteps.length - 1);
        tutorialStartBtn.classList.toggle('hidden', stepIndex !== tutorialSteps.length - 1);
        tutorialSkipBtn.classList.toggle('hidden', stepIndex === tutorialSteps.length - 1);

        currentTutorialStep = stepIndex;
        openModal(tutorialModal);
    };

    tutorialPrevBtn.addEventListener('click', () => showTutorialStep(currentTutorialStep - 1));
    tutorialNextBtn.addEventListener('click', () => showTutorialStep(currentTutorialStep + 1));
    tutorialStartBtn.addEventListener('click', () => showTutorialStep(tutorialSteps.length));
    tutorialSkipBtn.addEventListener('click', () => showTutorialStep(tutorialSteps.length));

    // --- Global Keyboard Shortcuts (이메일 인증 확인 추가) ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (itemModal.classList.contains('active')) { // linkModal -> itemModal
                closeItemModal(); // closeLinkModal -> closeItemModal
            } else if (listModal.classList.contains('active')) { // dashboardModal -> listModal
                closeListModal(); // closeDashboardModal -> closeListModal
            } else if (settingsModal.classList.contains('active')) {
                closeModal(settingsModal);
                settingsBtn.setAttribute('aria-expanded', 'false');
            } else if (searchBarContainer.classList.contains('visible')) {
                searchCloseBtn.click();
            } else if (tutorialModal.classList.contains('active')) {
                showTutorialStep(tutorialSteps.length);
            }
        }
        // Cmd/Ctrl + L for Add Item
        if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
            e.preventDefault();
            if (currentUserUid && isEmailVerified && !itemModal.classList.contains('active')) { // linkModal -> itemModal
                addLinkGlobalBtn.click();
            }
        }
        // Cmd/Ctrl + D for Add List
        if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
            e.preventDefault();
            if (currentUserUid && isEmailVerified && !listModal.classList.contains('active')) { // dashboardModal -> listModal
                addDashboardGlobalBtn.click();
            }
        }
        // Cmd/Ctrl + F for Search
        if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
            e.preventDefault();
            if (currentUserUid && isEmailVerified) {
                searchBtn.click();
            }
        }
        // Arrow key navigation for dashboards on desktop/tablet (when not in modal)
        if (currentUserUid && isEmailVerified && !itemModal.classList.contains('active') && !listModal.classList.contains('active') && !settingsModal.classList.contains('active') && !tutorialModal.classList.contains('active')) { // linkModal -> itemModal, dashboardModal -> listModal
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (currentDashboardIndex < dashboards.length - 1) {
                    currentDashboardIndex++;
                    scrollToDashboard(currentDashboardIndex);
                    updatePaginationDots();
                }
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (currentDashboardIndex > 0) {
                    currentDashboardIndex--;
                    scrollToDashboard(currentDashboardIndex);
                    updatePaginationDots();
                }
            }
        }
    });


    // --- Initial Load & Auth State Change Listener ---
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            await user.reload(); // 최신 사용자 상태를 가져옵니다.
            currentUserUid = user.uid;
            isEmailVerified = user.emailVerified;

            if (isEmailVerified) {
                loginScreen.classList.remove('active');
                mainDashboardScreen.classList.add('active');
                console.log("User logged in and email verified:", user.uid);
                await loadData();
                if (!hasSeenTutorial) {
                    showTutorialStep(0);
                }
            } else {
                loginScreen.classList.remove('active');
                mainDashboardScreen.classList.add('active'); // 대시보드 화면으로 일단 전환
                dashboards = [];
                renderDashboards();
                showToast('이메일 인증이 필요합니다. 메일함을 확인해주세요. 인증 전에는 기능 사용이 제한됩니다.', 'error');
                console.log("User logged in but email not verified:", user.uid);
            }
        } else {
            currentUserUid = null;
            isEmailVerified = false;
            mainDashboardScreen.classList.remove('active');
            loginScreen.classList.add('active');
            dashboards = [];
            renderDashboards();
            console.log("User logged out.");
        }
    });

    applyTheme(currentTheme);
    applyPrimaryColor(currentPrimaryColor);
});
