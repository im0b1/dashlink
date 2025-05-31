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
    const signupSubmitBtn = document.getElementById('signup-submit-btn');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const forgotPasswordBtn = document.getElementById('forgot-password-btn'); // 비밀번호 재설정 버튼 추가

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
    const tutorialNextBtn = document = document.getElementById('tutorial-next-btn');
    const tutorialStartBtn = document.getElementById('tutorial-start-btn');

    const toastContainer = document.getElementById('toast-container');

    // --- State Variables ---
    let dashboards = [];
    let editingLinkId = null;
    let editingDashboardId = null;
    let currentDashboardIndex = 0;
    let currentTheme = localStorage.getItem('dashLinkTheme') || 'light';
    let currentPrimaryColor = localStorage.getItem('dashLinkPrimaryColor') || '#00C49F';
    let hasSeenTutorial = localStorage.getItem('hasSeenDashLinkTutorial') === 'true';
    let currentTutorialStep = 0;
    let currentUserUid = null;
    let isEmailVerified = false;

    const tutorialSteps = [
        {
            title: 'DashLink에 오신 것을 환영합니다!',
            content: 'DashLink는 공용 컴퓨터에서도 나만의 링크를 편리하게 관리할 수 있도록 도와줍니다. 이제 주요 기능을 알아볼까요?'
        },
        {
            title: '대시보드 스와이프',
            content: '각 카드는 하나의 "대시보드"입니다. 모바일에서는 좌우로 스와이프하여 다른 대시보드로 이동할 수 있습니다.',
            image: 'https://via.placeholder.com/400x200?text=Dashboard+Swipe'
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

            for (const dashboard of dashboards) {
                const dashboardDocRef = userDashboardsRef.doc(dashboard.id);
                await dashboardDocRef.set({
                    name: dashboard.name,
                    description: dashboard.description,
                    links: dashboard.links
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
                    }
                ];
                await saveData();
                console.log("Initial dummy data loaded and saved to Firestore.");
            } else {
                dashboards = snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    description: doc.data().description,
                    links: doc.data().links || []
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

    // --- UI Rendering Functions (기존과 동일) ---
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
            dashboardPagination.style.display = 'flex';
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
            dot.setAttribute('aria-controls', `dashboard-${dashboard.id}`);
            dot.setAttribute('aria-selected', index === currentDashboardIndex);
            dot.setAttribute('tabindex', index === currentDashboardIndex ? '0' : '-1');
            dashboardPagination.appendChild(dot);
        });

        scrollToDashboard(currentDashboardIndex, false);
        updatePaginationDots();
        initializeSortable();
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
                linkItem.setAttribute('tabindex', '0');

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


    // --- Modal Functions (기존과 동일) ---
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

    const openLinkModal = (type, link = null) => {
        linkForm.reset();
        editingLinkId = null;
        linkUrlInput.classList.remove('invalid');
        linkTitleInput.classList.remove('invalid');
        linkForm.querySelectorAll('.error-message').forEach(el => {
            el.classList.add('hidden');
            el.style.height = '0';
        });
        linkModalSaveBtn.disabled = true; // 초기 상태는 disabled

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
        setupFormValidation(linkForm, [linkModalSaveBtn]);
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
        dashboardModalSaveBtn.disabled = true; // 초기 상태는 disabled

        if (type === 'add') {
            dashboardModalTitle.textContent = '새 대시보드 추가';
        } else if (type === 'edit' && dashboard) {
            dashboardModalTitle.textContent = '대시보드 편집';
            editingDashboardId = dashboard.id;
            dashboardNameInput.value = dashboard.name;
            dashboardDescriptionInput.value = dashboard.description || '';
        }
        openModal(dashboardModal);
        setupFormValidation(dashboardForm, [dashboardModalSaveBtn]);
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
        const inputs = formElement.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(input => {
            const errorMsg = input.nextElementSibling;
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

    const setupFormValidation = (formElement, saveButtons) => {
        const inputs = formElement.querySelectorAll('input[required], textarea[required]');

        const checkFormValidity = () => {
            const isValid = validateForm(formElement);
            saveButtons.forEach(button => {
                // 버튼이 로딩 상태가 아닌 경우에만 폼 유효성에 따라 disabled 상태를 변경합니다.
                // 로딩 상태인 경우, setLoadingState에 의해 disabled 상태가 관리되므로 건드리지 않습니다.
                if (button.dataset.isloading !== 'true') { // <--- 이 조건문이 수정되었습니다.
                     button.disabled = !isValid;
                }
            });
        };

        inputs.forEach(input => {
            input.addEventListener('input', checkFormValidity);
            input.addEventListener('blur', checkFormValidity);
        });

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
        openDashboardModal('add');
    });
    emptyAddDashboardBtn.addEventListener('click', () => {
        if (!currentUserUid || !isEmailVerified) {
            showToast('로그인 후 이메일 인증을 완료해야 합니다.', 'error');
            return;
        }
        openDashboardModal('add');
    });

    // Dashboard Form Submission (Firestore) (이메일 인증 확인 및 로딩 상태 추가)
    dashboardForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm(dashboardForm)) {
            showToast('대시보드 정보를 올바르게 입력해주세요.', 'error');
            return;
        }
        if (!currentUserUid || !isEmailVerified) {
            showToast('로그인 후 이메일 인증을 완료해야 합니다.', 'error');
            return;
        }

        const name = dashboardNameInput.value.trim();
        const description = dashboardDescriptionInput.value.trim();

        setLoadingState(dashboardModalSaveBtn, true, "저장 중...");

        try {
            if (editingDashboardId) {
                await db.collection('users').doc(currentUserUid).collection('dashboards').doc(editingDashboardId).update({
                    name: name,
                    description: description
                });
                showToast('대시보드가 수정되었습니다.');
            } else {
                const newDashboardRef = await db.collection('users').doc(currentUserUid).collection('dashboards').add({
                    name: name,
                    description: description,
                    links: []
                });
                dashboards.push({
                    id: newDashboardRef.id,
                    name: name,
                    description: description,
                    links: []
                });
                currentDashboardIndex = dashboards.length - 1;
                showToast('새 대시보드가 추가되었습니다.');
            }
            await loadData();
            closeDashboardModal();
        } catch (error) {
            showToast('대시보드 저장/수정 실패: ' + getFirebaseErrorMessage(error), 'error');
            console.error("Dashboard save error:", error);
        } finally {
            setLoadingState(dashboardModalSaveBtn, false, "저장");
        }
    });

    // Dashboard Modal Cancel & Close on outside click (기존과 동일)
    dashboardModalCancelBtn.addEventListener('click', closeDashboardModal);
    dashboardModal.addEventListener('click', (e) => {
        if (e.target === dashboardModal) {
            closeDashboardModal();
        }
    });

    // Link Form Submission (Firestore) (이메일 인증 확인 및 로딩 상태 추가)
    linkForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateForm(linkForm)) {
            showToast('링크 정보를 올바르게 입력해주세요.', 'error');
            return;
        }
        if (!currentUserUid || !isEmailVerified) {
            showToast('로그인 후 이메일 인증을 완료해야 합니다.', 'error');
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

        setLoadingState(linkModalSaveBtn, true, "저장 중...");

        try {
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

            await db.collection('users').doc(currentUserUid).collection('dashboards').doc(currentDashboard.id).update({
                links: currentDashboard.links
            });

            renderLinksForDashboard(currentDashboard.id, `links-list-${currentDashboard.id}`, searchInput.value);
            closeLinkModal();
        } catch (error) {
            showToast('링크 저장/수정 실패: ' + getFirebaseErrorMessage(error), 'error');
            console.error("Link save error:", error);
        } finally {
            setLoadingState(linkModalSaveBtn, false, "저장");
        }
    });

    // Link Modal Cancel & Close on outside click (기존과 동일)
    linkModalCancelBtn.addEventListener('click', closeLinkModal);
    linkModal.addEventListener('click', (e) => {
        if (e.target === linkModal) {
            closeLinkModal();
        }
    });

    // Simulate URL info extraction with loading state (기존과 동일)
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
                    setupFormValidation(linkForm, [linkModalSaveBtn]);
                }
            }, 800);
        }
    });

    // Global Add Link button (adds to current dashboard) (이메일 인증 확인 추가)
    addLinkGlobalBtn.addEventListener('click', () => {
        if (!currentUserUid || !isEmailVerified) {
            showToast('로그인 후 이메일 인증을 완료해야 합니다.', 'error');
            return;
        }
        if (dashboards.length === 0) {
            showToast('링크를 추가하려면 먼저 대시보드를 만들어주세요.', 'error');
            return;
        }
        openLinkModal('add');
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

        const editDashboardBtn = e.target.closest('.edit-dashboard-btn');
        const deleteDashboardBtn = e.target.closest('.delete-dashboard-btn');

        if (editDashboardBtn) {
            e.stopPropagation();
            openDashboardModal('edit', currentDashboard);
        } else if (deleteDashboardBtn) {
            e.stopPropagation();
            if (confirm(`'${currentDashboard.name}' 대시보드를 정말 삭제하시겠습니까? (포함된 링크도 모두 삭제됩니다)`)) {
                setLoadingState(deleteDashboardBtn, true, '', `<span class="material-icons">delete</span>`); // 아이콘 버튼 로딩
                try {
                    await db.collection('users').doc(currentUserUid).collection('dashboards').doc(dashboardId).delete();
                    showToast('대시보드가 삭제되었습니다.');
                    await loadData();
                    if (dashboards.length > 0) {
                        if (currentDashboardIndex >= dashboards.length) {
                            currentDashboardIndex = dashboards.length - 1;
                        }
                    } else {
                        currentDashboardIndex = 0;
                    }
                } catch (error) {
                    showToast('대시보드 삭제 실패: ' + getFirebaseErrorMessage(error), 'error');
                    console.error("Dashboard delete error:", error);
                } finally {
                    setLoadingState(deleteDashboardBtn, false, '', `<span class="material-icons">delete</span>`);
                }
            }
        } else if (e.target.closest('.add-link-card-btn')) {
            e.stopPropagation();
            currentDashboardIndex = dashboards.findIndex(d => d.id === dashboardId);
            scrollToDashboard(currentDashboardIndex);
            updatePaginationDots();
            openLinkModal('add');
        }
    });

    dashboardsContainer.addEventListener('click', async (e) => {
        const linkItem = e.target.closest('.link-item');
        if (!linkItem) return;

        const linkId = linkItem.dataset.linkId;
        const dashboardId = linkItem.closest('.dashboard-card').dataset.dashboardId;
        const targetDashboard = dashboards.find(d => d.id === dashboardId);
        const targetLink = targetDashboard?.links.find(link => link.id === linkId);
        if (!targetLink) return;

        if (!currentUserUid || !isEmailVerified) {
            showToast('로그인 후 이메일 인증을 완료해야 합니다.', 'error');
            return;
        }

        const editLinkBtn = e.target.closest('.edit-link-btn');
        const deleteLinkBtn = e.target.closest('.delete-link-btn');

        if (editLinkBtn) {
            e.stopPropagation();
            openLinkModal('edit', targetLink);
        } else if (deleteLinkBtn) {
            e.stopPropagation();
            if (confirm(`'${targetLink.title}' 링크를 정말 삭제하시겠습니까?`)) {
                setLoadingState(deleteLinkBtn, true, '', `<span class="material-icons">delete</span>`);
                try {
                    const linkIndexToRemove = targetDashboard.links.findIndex(link => link.id === linkId);
                    if (linkIndexToRemove > -1) {
                        targetDashboard.links.splice(linkIndexToRemove, 1);
                    }

                    await db.collection('users').doc(currentUserUid).collection('dashboards').doc(dashboardId).update({
                        links: targetDashboard.links
                    });
                    showToast('링크가 삭제되었습니다.');
                    renderLinksForDashboard(dashboardId, linkItem.closest('.links-list').id, searchInput.value);
                } catch (error) {
                    showToast('링크 삭제 실패: ' + getFirebaseErrorMessage(error), 'error');
                    console.error("Link delete error:", error);
                } finally {
                    setLoadingState(deleteLinkBtn, false, '', `<span class="material-icons">delete</span>`);
                }
            }
        } else {
            window.open(targetLink.url, '_blank');
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
                        showToast('대시보드 순서가 변경되었습니다.');
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
                        onEnd: async function (evt) {
                            const newIndex = evt.newIndex;
                            const fromDashboardId = evt.from.dataset.dashboardId;
                            const toDashboardId = evt.to.dataset.dashboardId;
                            const draggedLinkId = evt.item.dataset.linkId;

                            const fromDashboard = dashboards.find(d => d.id === fromDashboardId);
                            const toDashboard = dashboards.find(d => d.id === toDashboardId);

                            if (!fromDashboard || !toDashboard) {
                                console.error('Source or target dashboard not found.');
                                return;
                            }

                            const movedLinkIndex = fromDashboard.links.findIndex(link => link.id === draggedLinkId);
                            if (movedLinkIndex === -1) {
                                console.error('Dragged link not found in source dashboard links array.');
                                return;
                            }
                            const [movedLink] = fromDashboard.links.splice(movedLinkIndex, 1);


                            if (fromDashboardId === toDashboardId) {
                                toDashboard.links.splice(newIndex, 0, movedLink);
                                showToast('링크 순서가 변경되었습니다.');
                            } else {
                                toDashboard.links.splice(newIndex, 0, movedLink);
                                showToast('링크가 다른 대시보드로 이동했습니다.');
                            }
                            
                            try {
                                await db.collection('users').doc(currentUserUid).collection('dashboards').doc(fromDashboardId).update({
                                    links: fromDashboard.links
                                });
                                if (fromDashboardId !== toDashboardId) {
                                    await db.collection('users').doc(currentUserUid).collection('dashboards').doc(toDashboardId).update({
                                        links: toDashboard.links
                                    });
                                }
                                renderLinksForDashboard(fromDashboardId, `links-list-${fromDashboardId}`, searchInput.value);
                                if (fromDashboardId !== toDashboardId) {
                                    renderLinksForDashboard(toDashboardId, `links-list-${toDashboardId}`, searchInput.value);
                                }
                            } catch (error) {
                                showToast('링크 이동/순서 변경 실패: ' + getFirebaseErrorMessage(error), 'error');
                                console.error("Sortable link update error:", error);
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
            if (linkModal.classList.contains('active')) {
                closeLinkModal();
            } else if (dashboardModal.classList.contains('active')) {
                closeDashboardModal();
            } else if (settingsModal.classList.contains('active')) {
                closeModal(settingsModal);
                settingsBtn.setAttribute('aria-expanded', 'false');
            } else if (searchBarContainer.classList.contains('visible')) {
                searchCloseBtn.click();
            } else if (tutorialModal.classList.contains('active')) {
                showTutorialStep(tutorialSteps.length);
            }
        }
        // Cmd/Ctrl + L for Add Link
        if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
            e.preventDefault();
            if (currentUserUid && isEmailVerified && !linkModal.classList.contains('active')) {
                addLinkGlobalBtn.click();
            }
        }
        // Cmd/Ctrl + D for Add Dashboard
        if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
            e.preventDefault();
            if (currentUserUid && isEmailVerified && !dashboardModal.classList.contains('active')) {
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
        if (currentUserUid && isEmailVerified && !linkModal.classList.contains('active') && !dashboardModal.classList.contains('active') && !settingsModal.classList.contains('active') && !tutorialModal.classList.contains('active')) {
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
