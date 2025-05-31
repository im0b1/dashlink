// Include SortableJS library: <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>

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
    const guestLoginBtn = document.getElementById('guest-login-btn');

    // Dashboard Screen Elements
    const logoutBtn = document.getElementById('logout-btn');
    const dashboardMainTitle = document.getElementById('dashboard-main-title');
    const addLinkGlobalBtn = document.getElementById('add-link-global-btn');
    const addDashboardGlobalBtn = document.getElementById('add-dashboard-global-btn');
    const dashboardsContainer = document.getElementById('dashboards-container');
    const emptyDashboardsState = document.getElementById('empty-dashboards-state');
    const emptyAddDashboardBtn = document.getElementById('empty-add-dashboard-btn');
    const dashboardPagination = document.getElementById('dashboard-pagination');

    const searchBtn = document.getElementById('search-btn');
    const searchBarContainer = document.getElementById('search-bar-container');
    const searchInput = document.getElementById('search-input');
    const searchCloseBtn = document.getElementById('search-close-btn');

    // Modals
    const linkModal = document.getElementById('link-modal');
    const linkModalTitle = document.getElementById('link-modal-title');
    const linkForm = document.getElementById('link-form');
    const linkUrlInput = document.getElementById('link-url');
    const linkTitleInput = document.getElementById('link-title');
    const linkFaviconInput = document.getElementById('link-favicon');
    const linkModalCancelBtn = document.getElementById('link-modal-cancel-btn');
    const linkModalSaveBtn = document.getElementById('link-modal-save-btn');
    const faviconLoadingSpinner = document.getElementById('favicon-loading-spinner');

    const dashboardModal = document.getElementById('dashboard-modal');
    const dashboardModalTitle = document.getElementById('dashboard-modal-title');
    const dashboardForm = document.getElementById('dashboard-form');
    const dashboardNameInput = document.getElementById('dashboard-name');
    const dashboardDescriptionInput = document.getElementById('dashboard-description');
    const dashboardModalCancelBtn = document.getElementById('dashboard-modal-cancel-btn');
    const dashboardModalSaveBtn = document.getElementById('dashboard-modal-save-btn');

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
    let dashboards = [];
    let isLoggedIn = false;
    let editingLinkId = null;
    let editingDashboardId = null;
    let currentDashboardIndex = 0;
    let currentTheme = localStorage.getItem('dashLinkTheme') || 'light';
    let currentPrimaryColor = localStorage.getItem('dashLinkPrimaryColor') || '#00C49F';
    let hasSeenTutorial = localStorage.getItem('hasSeenDashLinkTutorial') === 'true';
    let currentTutorialStep = 0;

    const tutorialSteps = [
        {
            title: 'DashLink에 오신 것을 환영합니다!',
            content: 'DashLink는 공용 컴퓨터에서도 나만의 링크를 편리하게 관리할 수 있도록 도와줍니다. 이제 주요 기능을 알아볼까요?'
        },
        {
            title: '대시보드 스와이프',
            content: '각 카드는 하나의 "대시보드"입니다. 모바일에서는 좌우로 스와이프하여 다른 대시보드로 이동할 수 있습니다.',
            image: 'https://via.placeholder.com/400x200?text=Dashboard+Swipe' // Placeholder image
        },
        {
            title: '링크 추가 및 관리',
            content: '각 대시보드 하단의 "새 링크 추가" 버튼을 눌러 링크를 추가할 수 있습니다. 추가된 링크는 클릭하여 이동하거나, 마우스 오버 시 나타나는 편집/삭제 버튼으로 관리할 수 있습니다.',
            image: 'https://via.placeholder.com/400x200?text=Add+Link'
        },
        {
            title: '드래그 앤 드롭 정렬',
            content: '링크 아이템을 길게 누르거나 대시보드 헤더를 잡고 드래그하여 순서를 바꾸거나 다른 대시보드로 옮길 수 있습니다.',
            image: 'https://via.placeholder.com/400x200?text=Drag+Drop'
        },
        {
            title: '검색 및 설정',
            content: '우측 상단의 돋보기 아이콘으로 링크를 검색하고, 톱니바퀴 아이콘으로 다크 모드나 테마 색상을 변경할 수 있습니다.',
            image: 'https://via.placeholder.com/400x200?text=Search+Settings'
        }
    ];


    // --- Utility Functions ---

    const generateUniqueId = () => '_' + Math.random().toString(36).substr(2, 9);

    const saveData = () => {
        localStorage.setItem('dashLinkData', JSON.stringify(dashboards));
    };

    const loadData = () => {
        const storedData = localStorage.getItem('dashLinkData');
        if (storedData) {
            dashboards = JSON.parse(storedData);
        } else {
            // Initial dummy data for first-time users
            dashboards = [
                {
                    id: generateUniqueId(),
                    name: '자주 가는 링크',
                    description: '매일 방문하는 사이트 모음입니다.',
                    links: [
                        { id: generateUniqueId(), url: 'https://www.google.com', title: 'Google', icon: 'https://www.google.com/favicon.ico' },
                        { id: generateUniqueId(), url: 'https://mail.google.com', title: 'Gmail', icon: 'https://mail.google.com/favicon.ico' },
                        { id: generateUniqueId(), url: 'https://www.youtube.com', title: 'YouTube', icon: 'https://www.youtube.com/favicon.ico' }
                    ]
                },
                {
                    id: generateUniqueId(),
                    name: '업무 관련',
                    description: '업무에 필요한 사이트들을 모았습니다.',
                    links: [
                        { id: generateUniqueId(), url: 'https://trello.com', title: 'Trello', icon: 'https://trello.com/favicon.ico' },
                        { id: generateUniqueId(), url: 'https://slack.com', title: 'Slack', icon: 'https://slack.com/favicon.ico' },
                        { id: generateUniqueId(), url: 'https://meet.google.com', title: 'Google Meet', icon: 'https://meet.google.com/favicon.ico' }
                    ]
                },
                {
                    id: generateUniqueId(),
                    name: '쇼핑 즐겨찾기',
                    description: '자주 이용하는 쇼핑몰 모음',
                    links: [
                        { id: generateUniqueId(), url: 'https://www.coupang.com', title: '쿠팡', icon: 'https://www.coupang.com/favicon.ico' },
                        { id: generateUniqueId(), url: 'https://www.gmarket.co.kr', title: 'G마켓', icon: 'https://www.gmarket.co.kr/favicon.ico' },
                        { id: generateUniqueId(), url: 'https://www.11st.co.kr', title: '11번가', icon: 'https://www.11st.co.kr/favicon.ico' }
                    ]
                }
            ];
            saveData();
        }
    };

    // --- UI Rendering Functions ---

    const renderDashboards = (filterText = '') => {
        dashboardsContainer.innerHTML = '';
        dashboardPagination.innerHTML = '';

        if (dashboards.length === 0) {
            emptyDashboardsState.style.display = 'flex';
            dashboardPagination.style.display = 'none';
            return;
        } else {
            emptyDashboardsState.style.display = 'none';
            dashboardPagination.style.display = 'flex'; // Display pagination only if dashboards exist
        }

        dashboards.forEach((dashboard, index) => {
            const dashboardCard = document.createElement('div');
            dashboardCard.className = 'dashboard-card';
            dashboardCard.dataset.dashboardId = dashboard.id;
            dashboardCard.setAttribute('role', 'region');
            dashboardCard.setAttribute('aria-label', `${dashboard.name} 대시보드`);

            const linkListId = `links-list-${dashboard.id}`;

            dashboardCard.innerHTML = `
                <div class="dashboard-card-header">
                    <div class="dashboard-card-info">
                        <h2 class="dashboard-card-name">${dashboard.name}</h2>
                        <p class="dashboard-card-description">${dashboard.description || '설명 없음'}</p>
                    </div>
                    <div class="dashboard-card-actions">
                        <button class="btn-action edit-dashboard-btn" title="대시보드 편집" aria-label="대시보드 편집" data-dashboard-id="${dashboard.id}"><span class="material-icons">edit</span></button>
                        <button class="btn-action delete-dashboard-btn" title="대시보드 삭제" aria-label="대시보드 삭제" data-dashboard-id="${dashboard.id}"><span class="material-icons">delete</span></button>
                    </div>
                </div>
                <ul id="${linkListId}" class="links-list" data-dashboard-id="${dashboard.id}" role="list" aria-label="${dashboard.name} 링크 목록">
                    <!-- Links for this dashboard -->
                </ul>
                <button class="add-link-card-btn" data-dashboard-id="${dashboard.id}" aria-label="새 링크 추가">
                    <span class="material-icons">add</span>
                    새 링크 추가
                </button>
            `;
            dashboardsContainer.appendChild(dashboardCard);

            renderLinksForDashboard(dashboard.id, linkListId, filterText);

            const dot = document.createElement('div');
            dot.className = `pagination-dot ${index === currentDashboardIndex ? 'active' : ''}`;
            dot.dataset.index = index;
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-controls', `dashboard-${dashboard.id}`); // Link to dashboard card for a11y
            dot.setAttribute('aria-selected', index === currentDashboardIndex);
            dot.setAttribute('tabindex', index === currentDashboardIndex ? '0' : '-1'); // Only current dot is tabbable
            dashboardPagination.appendChild(dot);
        });

        // Set scroll position to current dashboard index
        scrollToDashboard(currentDashboardIndex, false);
        updatePaginationDots();
        initializeSortable(); // Re-initialize SortableJS after rendering
    };

    const renderLinksForDashboard = (dashboardId, containerId, filterText = '') => {
        const dashboard = dashboards.find(d => d.id === dashboardId);
        if (!dashboard) return;

        const linksList = document.getElementById(containerId);
        if (!linksList) return;

        linksList.innerHTML = '';

        const filteredLinks = dashboard.links.filter(link =>
            link.title.toLowerCase().includes(filterText.toLowerCase()) ||
            link.url.toLowerCase().includes(filterText.toLowerCase())
        );

        if (filteredLinks.length === 0) {
            linksList.innerHTML = `
                <li class="empty-state-link">
                    <p>검색 결과가 없거나<br>아직 링크가 없어요.</p>
                </li>
            `;
        } else {
            filteredLinks.forEach(link => {
                const linkItem = document.createElement('li');
                linkItem.className = 'link-item';
                linkItem.dataset.linkId = link.id;
                linkItem.dataset.url = link.url;
                linkItem.setAttribute('role', 'listitem');
                linkItem.setAttribute('tabindex', '0'); // Make list item tabbable

                const faviconHtml = link.icon ? `<img src="${link.icon}" alt="${link.title} favicon">` : `<span class="material-icons">link</span>`;

                linkItem.innerHTML = `
                    <div class="link-item-favicon">
                        ${faviconHtml}
                    </div>
                    <div class="link-item-title" title="${link.title}">${link.title}</div>
                    <div class="link-item-actions">
                        <button class="btn-action edit-link-btn" title="편집" aria-label="${link.title} 링크 편집" data-link-id="${link.id}" data-dashboard-id="${dashboard.id}"><span class="material-icons">edit</span></button>
                        <button class="btn-action delete-link-btn" title="삭제" aria-label="${link.title} 링크 삭제" data-link-id="${link.id}" data-dashboard-id="${dashboard.id}"><span class="material-icons">delete</span></button>
                    </div>
                `;
                linksList.appendChild(linkItem);
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
                currentDashboardIndex = Math.max(0, Math.min(index, dashboards.length - 1));
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
        
        // After scroll, ensure focus is on the current dashboard (for A11y)
        // This might be tricky with SortableJS, but worth trying
        const currentCard = dashboardsContainer.children[index];
        if (currentCard) {
            currentCard.focus(); // Set focus to the current dashboard card
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
        
        const hexToRgb = hex => hex.match(/\w\w/g).map(x => parseInt(x, 16));
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
    let lastFocusedElement = null; // To restore focus after modal closes

    const trapFocus = (modalElement) => {
        const focusableElements = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length === 0) return;

        const firstFocusableEl = focusableElements[0];
        const lastFocusableEl = focusableElements[focusableElements.length - 1];

        modalElement.addEventListener('keydown', function(e) {
            const isTabPressed = (e.key === 'Tab');
            if (!isTabPressed) return;

            if (e.shiftKey) { // if shift key pressed for shift + tab
                if (document.activeElement === firstFocusableEl) {
                    lastFocusableEl.focus(); // add focus to the last focusable element
                    e.preventDefault();
                }
            } else { // if tab key is pressed
                if (document.activeElement === lastFocusableEl) {
                    firstFocusableEl.focus(); // add focus to the first focusable element
                    e.preventDefault();
                }
            }
        });
        firstFocusableEl.focus(); // Set initial focus
    };

    const openModal = (modalElement) => {
        lastFocusedElement = document.activeElement; // Save focus
        modalElement.classList.add('active');
        trapFocus(modalElement);
    };

    const closeModal = (modalElement) => {
        modalElement.classList.remove('active');
        if (lastFocusedElement) {
            lastFocusedElement.focus(); // Restore focus
            lastFocusedElement = null;
        }
    };

    const openLinkModal = (type, link = null) => {
        linkForm.reset();
        editingLinkId = null;
        linkUrlInput.classList.remove('invalid');
        linkTitleInput.classList.remove('invalid');
        linkForm.querySelectorAll('.error-message').forEach(el => {
            el.classList.add('hidden');
            el.style.height = '0';
        });
        linkModalSaveBtn.disabled = true;

        if (type === 'add') {
            linkModalTitle.textContent = '새 링크 추가';
            linkFaviconInput.value = '';
        } else if (type === 'edit' && link) {
            linkModalTitle.textContent = '링크 편집';
            editingLinkId = link.id;
            linkUrlInput.value = link.url;
            linkTitleInput.value = link.title;
            linkFaviconInput.value = link.icon || '';
        }
        openModal(linkModal);
        setupFormValidation(linkForm, linkModalSaveBtn);
    };

    const closeLinkModal = () => {
        closeModal(linkModal);
        editingLinkId = null;
        linkUrlInput.classList.remove('invalid');
        linkTitleInput.classList.remove('invalid');
        linkForm.querySelectorAll('.error-message').forEach(el => {
            el.classList.add('hidden');
            el.style.height = '0';
        });
    };

    const openDashboardModal = (type, dashboard = null) => {
        dashboardForm.reset();
        editingDashboardId = null;
        dashboardNameInput.classList.remove('invalid');
        dashboardForm.querySelectorAll('.error-message').forEach(el => {
            el.classList.add('hidden');
            el.style.height = '0';
        });
        dashboardModalSaveBtn.disabled = true;

        if (type === 'add') {
            dashboardModalTitle.textContent = '새 대시보드 추가';
        } else if (type === 'edit' && dashboard) {
            dashboardModalTitle.textContent = '대시보드 편집';
            editingDashboardId = dashboard.id;
            dashboardNameInput.value = dashboard.name;
            dashboardDescriptionInput.value = dashboard.description || '';
        }
        openModal(dashboardModal);
        setupFormValidation(dashboardForm, dashboardModalSaveBtn);
    };

    const closeDashboardModal = () => {
        closeModal(dashboardModal);
        editingDashboardId = null;
        dashboardNameInput.classList.remove('invalid');
        dashboardForm.querySelectorAll('.error-message').forEach(el => {
            el.classList.add('hidden');
            el.style.height = '0';
        });
    };

    // --- Toast Message Function ---

    const showToast = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);

        // Announce for screen readers
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');

        setTimeout(() => {
            toast.remove();
        }, 3000);
    };

    // --- Form Validation Functions ---

    const validateForm = (formElement) => {
        let isValid = true;
        const inputs = formElement.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(input => {
            const errorMsg = input.nextElementSibling;
            // Check if it's actually an error message element
            const isErrorMessageElement = errorMsg && errorMsg.classList.contains('error-message');

            if (input.value.trim() === '') {
                input.classList.add('invalid');
                if (isErrorMessageElement) {
                    errorMsg.textContent = `${input.previousElementSibling.textContent}을(를) 입력해주세요.`;
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
        return isValid;
    };

    const setupFormValidation = (formElement, saveButton) => {
        const inputs = formElement.querySelectorAll('input[required], textarea[required]');

        const checkFormValidity = () => {
            saveButton.disabled = !validateForm(formElement);
        };

        inputs.forEach(input => {
            input.addEventListener('input', checkFormValidity);
            input.addEventListener('blur', checkFormValidity);
        });

        checkFormValidity(); // Initial check
    };

    // --- Event Handlers ---

    // General Login Button Toggle
    generalLoginBtn.addEventListener('click', () => {
        const isVisible = generalLoginForm.classList.toggle('visible');
        generalLoginBtn.setAttribute('aria-expanded', isVisible);
        if (isVisible) {
            generalLoginForm.style.height = `${generalLoginForm.scrollHeight}px`;
            loginEmailInput.focus();
        } else {
            generalLoginForm.style.height = '0';
        }
        setupFormValidation(generalLoginForm, loginSubmitBtn);
    });

    // General Login Submission (Basic validation for prototype)
    loginSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!validateForm(generalLoginForm)) {
            showToast('로그인 정보를 올바르게 입력해주세요.', 'error');
            return;
        }

        isLoggedIn = true;
        localStorage.setItem('isLoggedInDashLink', 'true');
        loginScreen.classList.remove('active');
        mainDashboardScreen.classList.add('active');
        showToast('일반 로그인 성공!');
        renderDashboards();
        generalLoginForm.classList.remove('visible');
        generalLoginForm.style.height = '0';
    });

    // Guest Login
    guestLoginBtn.addEventListener('click', () => {
        isLoggedIn = true;
        localStorage.setItem('isLoggedInDashLink', 'true');
        loginScreen.classList.remove('active');
        mainDashboardScreen.classList.add('active');
        showToast('게스트로 로그인되었습니다.');
        renderDashboards();
        generalLoginForm.classList.remove('visible');
        generalLoginForm.style.height = '0';
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        isLoggedIn = false;
        localStorage.removeItem('isLoggedInDashLink');
        mainDashboardScreen.classList.remove('active');
        loginScreen.classList.add('active');
        showToast('로그아웃 되었습니다.');
        dashboards = [];
        saveData();
    });

    // Toggle Search Bar
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
        searchBtn.focus(); // Return focus to search button
    });
    searchInput.addEventListener('input', () => {
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            renderDashboards(searchInput.value);
        }, 300);
    });

    // Add Dashboard Button (Header icon button and Empty State)
    addDashboardGlobalBtn.addEventListener('click', () => openDashboardModal('add'));
    emptyAddDashboardBtn.addEventListener('click', () => openDashboardModal('add'));

    // Dashboard Form Submission (Add/Edit)
    dashboardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm(dashboardForm)) {
            showToast('대시보드 정보를 올바르게 입력해주세요.', 'error');
            return;
        }

        const name = dashboardNameInput.value.trim();
        const description = dashboardDescriptionInput.value.trim();

        if (editingDashboardId) {
            dashboards = dashboards.map(d =>
                d.id === editingDashboardId
                    ? { ...d, name, description }
                    : d
            );
            showToast('대시보드가 수정되었습니다.');
        } else {
            const newDashboard = {
                id: generateUniqueId(),
                name: name,
                description: description,
                links: []
            };
            dashboards.push(newDashboard);
            currentDashboardIndex = dashboards.length - 1;
            showToast('새 대시보드가 추가되었습니다.');
        }
        saveData();
        renderDashboards();
        closeDashboardModal();
    });

    // Dashboard Modal Cancel & Close on outside click
    dashboardModalCancelBtn.addEventListener('click', closeDashboardModal);
    dashboardModal.addEventListener('click', (e) => {
        if (e.target === dashboardModal) {
            closeDashboardModal();
        }
    });

    // Link Form Submission (Add/Edit)
    linkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm(linkForm)) {
            showToast('링크 정보를 올바르게 입력해주세요.', 'error');
            return;
        }

        const url = linkUrlInput.value.trim();
        const title = linkTitleInput.value.trim();
        const favicon = linkFaviconInput.value.trim();

        const currentDashboard = dashboards[currentDashboardIndex];
        if (!currentDashboard) {
            showToast('현재 대시보드를 찾을 수 없습니다. 대시보드를 먼저 추가해주세요.', 'error');
            return;
        }

        if (editingLinkId) {
            currentDashboard.links = currentDashboard.links.map(link =>
                link.id === editingLinkId
                    ? { ...link, url, title: title || new URL(url).hostname, icon: favicon }
                    : link
            );
            showToast('링크가 수정되었습니다.');
        } else {
            const newLink = {
                id: generateUniqueId(),
                url: url,
                title: title || new URL(url).hostname,
                icon: favicon
            };
            currentDashboard.links.push(newLink);
            showToast('새 링크가 추가되었습니다.');
        }
        saveData();
        renderLinksForDashboard(currentDashboard.id, `links-list-${currentDashboard.id}`, searchInput.value);
        closeLinkModal();
    });

    // Link Modal Cancel & Close on outside click
    linkModalCancelBtn.addEventListener('click', closeLinkModal);
    linkModal.addEventListener('click', (e) => {
        if (e.target === linkModal) {
            closeLinkModal();
        }
    });

    // Simulate URL info extraction with loading state
    linkUrlInput.addEventListener('blur', () => {
        const url = linkUrlInput.value.trim();
        if (url && !linkUrlInput.classList.contains('invalid') && !linkTitleInput.value && !linkFaviconInput.value) {
            faviconLoadingSpinner.classList.remove('hidden');
            setTimeout(() => {
                try {
                    const parsedUrl = new URL(url);
                    linkTitleInput.value = parsedUrl.hostname;
                    linkFaviconInput.value = `${parsedUrl.origin}/favicon.ico`;
                    showToast('URL 정보를 임시로 채웠습니다.', 'info');
                } catch (e) {
                    // Invalid URL, already handled by validation.
                } finally {
                    faviconLoadingSpinner.classList.add('hidden');
                    setupFormValidation(linkForm, linkModalSaveBtn);
                }
            }, 800);
        }
    });

    // Global Add Link button (adds to current dashboard)
    addLinkGlobalBtn.addEventListener('click', () => {
        if (dashboards.length === 0) {
            showToast('링크를 추가하려면 먼저 대시보드를 만들어주세요.', 'error');
            return;
        }
        openLinkModal('add');
    });

    // --- Delegated Event Listeners for Dynamic Elements ---

    dashboardsContainer.addEventListener('click', (e) => {
        const dashboardCard = e.target.closest('.dashboard-card');
        if (!dashboardCard) return;

        const dashboardId = dashboardCard.dataset.dashboardId;
        const currentDashboard = dashboards.find(d => d.id === dashboardId);
        if (!currentDashboard) return;

        if (e.target.closest('.edit-dashboard-btn')) {
            e.stopPropagation();
            openDashboardModal('edit', currentDashboard);
        } else if (e.target.closest('.delete-dashboard-btn')) {
            e.stopPropagation();
            if (confirm(`'${currentDashboard.name}' 대시보드를 정말 삭제하시겠습니까? (포함된 링크도 모두 삭제됩니다)`)) {
                dashboards = dashboards.filter(d => d.id !== dashboardId);
                saveData();
                if (dashboards.length > 0) {
                    if (currentDashboardIndex >= dashboards.length) {
                        currentDashboardIndex = dashboards.length - 1;
                    }
                } else {
                    currentDashboardIndex = 0;
                }
                renderDashboards();
                showToast('대시보드가 삭제되었습니다.');
            }
        } else if (e.target.closest('.add-link-card-btn')) {
            e.stopPropagation();
            currentDashboardIndex = dashboards.findIndex(d => d.id === dashboardId);
            scrollToDashboard(currentDashboardIndex);
            updatePaginationDots();
            openLinkModal('add');
        }
    });

    dashboardsContainer.addEventListener('click', (e) => {
        const linkItem = e.target.closest('.link-item');
        if (!linkItem) return;

        const linkId = linkItem.dataset.linkId;
        const dashboardId = linkItem.closest('.dashboard-card').dataset.dashboardId;
        const targetDashboard = dashboards.find(d => d.id === dashboardId);
        const targetLink = targetDashboard?.links.find(link => link.id === linkId);
        if (!targetLink) return;

        if (e.target.closest('.edit-link-btn')) {
            e.stopPropagation();
            openLinkModal('edit', targetLink);
        } else if (e.target.closest('.delete-link-btn')) {
            e.stopPropagation();
            if (confirm(`'${targetLink.title}' 링크를 정말 삭제하시겠습니까?`)) {
                targetDashboard.links = targetDashboard.links.filter(link => link.id !== linkId);
                saveData();
                renderLinksForDashboard(dashboardId, linkItem.closest('.links-list').id, searchInput.value);
                showToast('링크가 삭제되었습니다.');
            }
        } else {
            // Direct click on link item (not action buttons)
            window.open(targetLink.url, '_blank');
        }
    });


    // Pagination dot click (mobile)
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

    // Swiper scroll event to update current dashboard index
    let scrollTimeout;
    dashboardsContainer.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollLeft = dashboardsContainer.scrollLeft;
            const cardElements = Array.from(dashboardsContainer.children).filter(el => el.classList.contains('dashboard-card'));
            
            if (cardElements.length === 0) return;

            let closestIndex = 0;
            let minDiff = Infinity;
            
            cardElements.forEach((card, index) => {
                const diff = Math.abs(card.offsetLeft - scrollLeft);
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

    // Ensure scroll position is correct on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (isLoggedIn && dashboards.length > 0) {
                 scrollToDashboard(currentDashboardIndex, false);
            }
        }, 200);
    });

    // --- Settings Modal ---
    settingsBtn.addEventListener('click', () => {
        openModal(settingsModal);
        settingsBtn.setAttribute('aria-expanded', 'true');
    });
    settingsModalCloseBtn.addEventListener('click', () => {
        closeModal(settingsModal);
        settingsBtn.setAttribute('aria-expanded', 'false');
        settingsBtn.focus(); // Return focus to the settings button
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
        // Allow keyboard navigation for color swatches
        swatch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                applyPrimaryColor(swatch.dataset.color);
            }
        });
    });

    // --- SortableJS Initialization ---
    let dashboardsSortable;
    let linksSortables = {};

    const initializeSortable = () => {
        if (dashboardsSortable) {
            dashboardsSortable.destroy();
        }
        for (const key in linksSortables) {
            if (linksSortables[key]) {
                linksSortables[key].destroy();
            }
        }
        linksSortables = {};

        // Sortable for Dashboards (horizontal)
        dashboardsSortable = Sortable.create(dashboardsContainer, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            fallbackClass: 'sortable-fallback',
            handle: '.dashboard-card-header',
            forceFallback: true,
            onEnd: function (evt) {
                const oldIndex = evt.oldIndex;
                const newIndex = evt.newIndex;

                if (oldIndex !== newIndex) {
                    const [movedDashboard] = dashboards.splice(oldIndex, 1);
                    dashboards.splice(newIndex, 0, movedDashboard);
                    saveData();
                    currentDashboardIndex = newIndex;
                    updatePaginationDots();
                    showToast('대시보드 순서가 변경되었습니다.');
                    // Re-render to ensure all Sortable instances are correctly re-initialized
                    // This is a bit heavy, but ensures consistency after complex drag/drop, especially with groups
                    renderDashboards(searchInput.value);
                }
            }
        });

        // Sortable for Links within each Dashboard (vertical)
        dashboards.forEach(dashboard => {
            const linksListElement = document.getElementById(`links-list-${dashboard.id}`);
            if (linksListElement) {
                linksSortables[dashboard.id] = Sortable.create(linksListElement, {
                    animation: 150,
                    group: 'links',
                    ghostClass: 'sortable-ghost',
                    chosenClass: 'sortable-chosen',
                    fallbackClass: 'sortable-fallback',
                    handle: '.link-item',
                    forceFallback: true,
                    onEnd: function (evt) {
                        const oldIndex = evt.oldOldIndex;
                        const newIndex = evt.newIndex;
                        const fromDashboardId = evt.from.dataset.dashboardId;
                        const toDashboardId = evt.to.dataset.dashboardId;

                        const fromDashboard = dashboards.find(d => d.id === fromDashboardId);
                        const toDashboard = dashboards.find(d => d.id === toDashboardId);

                        if (!fromDashboard || !toDashboard) {
                            console.error('Source or target dashboard not found.');
                            return;
                        }

                        const [movedLink] = fromDashboard.links.splice(oldIndex, 1);

                        if (fromDashboardId === toDashboardId) {
                            toDashboard.links.splice(newIndex, 0, movedLink);
                            showToast('링크 순서가 변경되었습니다.');
                        } else {
                            toDashboard.links.splice(newIndex, 0, movedLink);
                            showToast('링크가 다른 대시보드로 이동했습니다.');
                        }
                        saveData();
                        renderLinksForDashboard(fromDashboardId, `links-list-${fromDashboardId}`, searchInput.value);
                        if (fromDashboardId !== toDashboardId) {
                            renderLinksForDashboard(toDashboardId, `links-list-${toDashboardId}`, searchInput.value);
                        }
                    }
                });
            }
        });
    };

    // --- Onboarding Tutorial Logic ---
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
    tutorialStartBtn.addEventListener('click', () => showTutorialStep(tutorialSteps.length)); // Complete tutorial
    tutorialSkipBtn.addEventListener('click', () => showTutorialStep(tutorialSteps.length)); // Complete tutorial

    // --- Global Keyboard Shortcuts ---
    document.addEventListener('keydown', (e) => {
        // Close modals/search with Escape key
        if (e.key === 'Escape') {
            if (linkModal.classList.contains('active')) {
                closeLinkModal();
            } else if (dashboardModal.classList.contains('active')) {
                closeDashboardModal();
            } else if (settingsModal.classList.contains('active')) {
                closeModal(settingsModal);
                settingsBtn.setAttribute('aria-expanded', 'false');
            } else if (searchBarContainer.classList.contains('visible')) {
                searchCloseBtn.click(); // Simulate click on close button
            } else if (tutorialModal.classList.contains('active')) {
                // Allow escape to skip tutorial
                showTutorialStep(tutorialSteps.length);
            }
        }
        // Cmd/Ctrl + L for Add Link
        if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
            e.preventDefault();
            if (isLoggedIn && !linkModal.classList.contains('active')) {
                addLinkGlobalBtn.click(); // Trigger click on the global button
            }
        }
        // Cmd/Ctrl + D for Add Dashboard
        if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
            e.preventDefault();
            if (isLoggedIn && !dashboardModal.classList.contains('active')) {
                addDashboardGlobalBtn.click(); // Trigger click on the global button
            }
        }
        // Cmd/Ctrl + F for Search
        if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
            e.preventDefault();
            if (isLoggedIn) {
                searchBtn.click(); // Toggle search bar
            }
        }
        // Arrow key navigation for dashboards on desktop/tablet (when not in modal)
        if (isLoggedIn && !linkModal.classList.contains('active') && !dashboardModal.classList.contains('active') && !settingsModal.classList.contains('active') && !tutorialModal.classList.contains('active')) {
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


    // --- Initial Load ---
    loadData();
    applyTheme(currentTheme);
    applyPrimaryColor(currentPrimaryColor);

    if (localStorage.getItem('isLoggedInDashLink') === 'true') {
        isLoggedIn = true;
        loginScreen.classList.remove('active');
        mainDashboardScreen.classList.add('active');
        renderDashboards();
        // Show tutorial for first-time logged-in users
        if (!hasSeenTutorial) {
            showTutorialStep(0);
        }
    } else {
        loginScreen.classList.add('active');
    }
});
