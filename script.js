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
    const dashboardMainTitle = document.getElementById('dashboard-main-title'); // Now fixed to "DashLink"
    const addLinkGlobalBtn = document.getElementById('add-link-global-btn');
    const addDashboardGlobalBtn = document.getElementById('add-dashboard-global-btn');
    const dashboardsContainer = document.getElementById('dashboards-container');
    const emptyDashboardsState = document.getElementById('empty-dashboards-state');
    const emptyAddDashboardBtn = document.getElementById('empty-add-dashboard-btn');
    const dashboardPagination = document.getElementById('dashboard-pagination');

    // Modals
    const linkModal = document.getElementById('link-modal');
    const linkModalTitle = document.getElementById('link-modal-title');
    const linkForm = document.getElementById('link-form');
    const linkUrlInput = document.getElementById('link-url');
    const linkTitleInput = document.getElementById('link-title');
    const linkFaviconInput = document.getElementById('link-favicon');
    const linkModalCancelBtn = document.getElementById('link-modal-cancel-btn');

    const dashboardModal = document.getElementById('dashboard-modal');
    const dashboardModalTitle = document.getElementById('dashboard-modal-title');
    const dashboardForm = document.getElementById('dashboard-form');
    const dashboardNameInput = document.getElementById('dashboard-name');
    const dashboardDescriptionInput = document.getElementById('dashboard-description');
    const dashboardModalCancelBtn = document.getElementById('dashboard-modal-cancel-btn');

    const toastContainer = document.getElementById('toast-container');

    // --- State Variables ---
    let dashboards = [];
    let isLoggedIn = false;
    let editingLinkId = null;
    let editingDashboardId = null;
    let currentDashboardIndex = 0; // Index of the currently visible dashboard on mobile

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

    const renderDashboards = () => {
        dashboardsContainer.innerHTML = ''; // Clear existing dashboards
        dashboardPagination.innerHTML = ''; // Clear existing pagination dots

        if (dashboards.length === 0) {
            emptyDashboardsState.style.display = 'flex';
            dashboardPagination.style.display = 'none';
            return;
        } else {
            emptyDashboardsState.style.display = 'none';
            // Only show pagination on mobile (handled by CSS media query)
            dashboardPagination.style.display = 'flex';
        }

        dashboards.forEach((dashboard, index) => {
            const dashboardCard = document.createElement('div');
            dashboardCard.className = 'dashboard-card';
            dashboardCard.dataset.dashboardId = dashboard.id;

            const linkListId = `links-list-${dashboard.id}`;

            dashboardCard.innerHTML = `
                <div class="dashboard-card-header">
                    <div class="dashboard-card-info">
                        <h2 class="dashboard-card-name">${dashboard.name}</h2>
                        <p class="dashboard-card-description">${dashboard.description || '설명 없음'}</p>
                    </div>
                    <div class="dashboard-card-actions">
                        <button class="btn-action edit-dashboard-btn" title="대시보드 편집"><span class="material-icons">edit</span></button>
                        <button class="btn-action delete-dashboard-btn" title="대시보드 삭제"><span class="material-icons">delete</span></button>
                    </div>
                </div>
                <ul id="${linkListId}" class="links-list">
                    <!-- Links for this dashboard -->
                </ul>
                <button class="add-link-card-btn" data-dashboard-id="${dashboard.id}">
                    <span class="material-icons">add</span>
                    새 링크 추가
                </button>
            `;
            dashboardsContainer.appendChild(dashboardCard);

            renderLinksForDashboard(dashboard.id, linkListId);

            // Create pagination dot for mobile
            const dot = document.createElement('div');
            dot.className = `pagination-dot ${index === currentDashboardIndex ? 'active' : ''}`;
            dot.dataset.index = index;
            dashboardPagination.appendChild(dot);
        });

        // Set scroll position to current dashboard index
        scrollToDashboard(currentDashboardIndex, false); // false for no smooth scroll on initial render

        addEventListenersToDashboardCards(); // Re-attach event listeners
        updatePaginationDots(); // Ensure dots are correct after rendering
    };

    const renderLinksForDashboard = (dashboardId, containerId) => {
        const dashboard = dashboards.find(d => d.id === dashboardId);
        if (!dashboard) return;

        const linksList = document.getElementById(containerId);
        if (!linksList) return;

        linksList.innerHTML = ''; // Clear existing links

        if (dashboard.links.length === 0) {
            linksList.innerHTML = `
                <li class="empty-state-link">
                    <p>아직 링크가 없어요.</p>
                </li>
            `;
        } else {
            dashboard.links.forEach(link => {
                const linkItem = document.createElement('li');
                linkItem.className = 'link-item';
                linkItem.dataset.linkId = link.id;
                linkItem.dataset.url = link.url; // Store URL for direct navigation

                const faviconHtml = link.icon ? `<img src="${link.icon}" alt="${link.title} favicon">` : `<span class="material-icons">link</span>`;

                linkItem.innerHTML = `
                    <div class="link-item-favicon">
                        ${faviconHtml}
                    </div>
                    <div class="link-item-title" title="${link.title}">${link.title}</div>
                    <div class="link-item-actions">
                        <button class="btn-action edit-link-btn" title="편집"><span class="material-icons">edit</span></button>
                        <button class="btn-action delete-link-btn" title="삭제"><span class="material-icons">delete</span></button>
                    </div>
                `;
                linksList.appendChild(linkItem);
            });
        }
    };

    // No longer needed as main title is fixed to "DashLink"
    // const updateMainTitle = () => {
    //     if (dashboards.length > 0) {
    //         dashboardMainTitle.textContent = dashboards[currentDashboardIndex]?.name || 'DashLink';
    //     } else {
    //         dashboardMainTitle.textContent = 'DashLink';
    //     }
    // };

    const updatePaginationDots = () => {
        const dots = dashboardPagination.querySelectorAll('.pagination-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentDashboardIndex);
        });
    };

    const scrollToDashboard = (index, smooth = true) => {
        if (!dashboardsContainer.children[index]) return; // Ensure element exists

        const scrollOptions = {
            left: dashboardsContainer.children[index].offsetLeft,
            behavior: smooth ? 'smooth' : 'auto'
        };
        dashboardsContainer.scrollTo(scrollOptions);
    };

    // --- Modal Functions ---

    const openModal = (modalElement) => {
        modalElement.classList.add('active');
    };

    const closeModal = (modalElement) => {
        modalElement.classList.remove('active');
    };

    const openLinkModal = (type, link = null) => {
        linkForm.reset(); // Clear form
        editingLinkId = null; // Reset editing state

        if (type === 'add') {
            linkModalTitle.textContent = '새 링크 추가';
            linkFaviconInput.value = ''; // Ensure favicon is empty on add
        } else if (type === 'edit' && link) {
            linkModalTitle.textContent = '링크 편집';
            editingLinkId = link.id;
            linkUrlInput.value = link.url;
            linkTitleInput.value = link.title;
            linkFaviconInput.value = link.icon || '';
        }
        openModal(linkModal);
    };

    const closeLinkModal = () => {
        closeModal(linkModal);
        editingLinkId = null;
    };

    const openDashboardModal = (type, dashboard = null) => {
        dashboardForm.reset();
        editingDashboardId = null;

        if (type === 'add') {
            dashboardModalTitle.textContent = '새 대시보드 추가';
        } else if (type === 'edit' && dashboard) {
            dashboardModalTitle.textContent = '대시보드 편집';
            editingDashboardId = dashboard.id;
            dashboardNameInput.value = dashboard.name;
            dashboardDescriptionInput.value = dashboard.description || '';
        }
        openModal(dashboardModal);
    };

    const closeDashboardModal = () => {
        closeModal(dashboardModal);
        editingDashboardId = null;
    };

    // --- Toast Message Function ---

    const showToast = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    };

    // --- Event Handlers ---

    // General Login Button Toggle
    generalLoginBtn.addEventListener('click', () => {
        generalLoginForm.classList.toggle('visible');
        if (generalLoginForm.classList.contains('visible')) {
            // Set explicit height for smooth transition
            generalLoginForm.style.height = `${generalLoginForm.scrollHeight + 20}px`; // Add some buffer
            loginEmailInput.focus();
        } else {
            generalLoginForm.style.height = '0';
        }
    });

    // General Login Submission (Basic validation for prototype)
    loginSubmitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value.trim();

        if (email && password) {
            // Simulate successful login
            isLoggedIn = true;
            localStorage.setItem('isLoggedInDashLink', 'true');
            loginScreen.classList.remove('active');
            mainDashboardScreen.classList.add('active');
            showToast('일반 로그인 성공!');
            renderDashboards();
            generalLoginForm.classList.remove('visible'); // Hide form after login
            generalLoginForm.style.height = '0';
        } else {
            showToast('이메일과 비밀번호를 입력해주세요.', 'error');
        }
    });

    // Guest Login
    guestLoginBtn.addEventListener('click', () => {
        isLoggedIn = true;
        localStorage.setItem('isLoggedInDashLink', 'true'); // Persist login state
        loginScreen.classList.remove('active');
        mainDashboardScreen.classList.add('active');
        showToast('게스트로 로그인되었습니다.');
        renderDashboards();
        generalLoginForm.classList.remove('visible'); // Hide form
        generalLoginForm.style.height = '0';
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        isLoggedIn = false;
        localStorage.removeItem('isLoggedInDashLink'); // Clear login state
        mainDashboardScreen.classList.remove('active');
        loginScreen.classList.add('active');
        showToast('로그아웃 되었습니다.');
        // Optionally clear data on logout for prototype simplicity
        dashboards = [];
        saveData();
    });

    // Add Dashboard Button (Global Header)
    addDashboardGlobalBtn.addEventListener('click', () => openDashboardModal('add'));
    emptyAddDashboardBtn.addEventListener('click', () => openDashboardModal('add'));

    // Dashboard Form Submission (Add/Edit)
    dashboardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = dashboardNameInput.value.trim();
        const description = dashboardDescriptionInput.value.trim();

        if (!name) {
            showToast('대시보드 이름을 입력해주세요.', 'error');
            return;
        }

        if (editingDashboardId) {
            // Edit existing dashboard
            dashboards = dashboards.map(d =>
                d.id === editingDashboardId
                    ? { ...d, name, description }
                    : d
            );
            showToast('대시보드가 수정되었습니다.');
        } else {
            // Add new dashboard
            const newDashboard = {
                id: generateUniqueId(),
                name: name,
                description: description,
                links: []
            };
            dashboards.push(newDashboard);
            // Move to the newly added dashboard
            currentDashboardIndex = dashboards.length - 1;
            showToast('새 대시보드가 추가되었습니다.');
        }
        saveData();
        renderDashboards();
        closeDashboardModal();
    });

    // Dashboard Modal Cancel
    dashboardModalCancelBtn.addEventListener('click', closeDashboardModal);
    dashboardModal.addEventListener('click', (e) => {
        if (e.target === dashboardModal) {
            closeDashboardModal();
        }
    });

    // Link Form Submission (Add/Edit)
    linkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = linkUrlInput.value.trim();
        const title = linkTitleInput.value.trim();
        const favicon = linkFaviconInput.value.trim();

        if (!url) {
            showToast('URL을 입력해주세요.', 'error');
            return;
        }

        try {
            new URL(url);
        } catch (error) {
            showToast('유효하지 않은 URL 형식입니다.', 'error');
            return;
        }

        const currentDashboard = dashboards[currentDashboardIndex];
        if (!currentDashboard) {
            showToast('현재 대시보드를 찾을 수 없습니다. 대시보드를 먼저 추가해주세요.', 'error');
            return;
        }

        if (editingLinkId) {
            // Edit existing link in the current dashboard
            currentDashboard.links = currentDashboard.links.map(link =>
                link.id === editingLinkId
                    ? { ...link, url, title: title || new URL(url).hostname, icon: favicon }
                    : link
            );
            showToast('링크가 수정되었습니다.');
        } else {
            // Add new link to the current dashboard
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
        // Re-render only the links for the current dashboard
        const currentDashboardCard = dashboardsContainer.querySelector(`[data-dashboard-id="${currentDashboard.id}"]`);
        if (currentDashboardCard) {
            renderLinksForDashboard(currentDashboard.id, currentDashboardCard.querySelector('.links-list').id);
        }
        closeLinkModal();
    });

    // Link Modal Cancel
    linkModalCancelBtn.addEventListener('click', closeLinkModal);
    linkModal.addEventListener('click', (e) => {
        if (e.target === linkModal) {
            closeLinkModal();
        }
    });

    // Optional: Auto-fill title/favicon on URL input blur (client-side limitation)
    linkUrlInput.addEventListener('blur', () => {
        const url = linkUrlInput.value.trim();
        if (url && !linkTitleInput.value && !linkFaviconInput.value) {
            try {
                const parsedUrl = new URL(url);
                linkTitleInput.value = parsedUrl.hostname;
                linkFaviconInput.value = `${parsedUrl.origin}/favicon.ico`;
                showToast('URL 정보를 임시로 채웠습니다. 실제 서비스는 더 정확하게 추출됩니다.', 'info');
            } catch (e) {
                // Invalid URL
            }
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

    // Event listener for dashboard card actions (edit/delete dashboard, add link to card)
    function addEventListenersToDashboardCards() {
        // Clear existing listeners before re-attaching, to prevent duplicates.
        // This is a common pattern when dynamically re-rendering components.
        dashboardsContainer.querySelectorAll('.dashboard-card').forEach(dashboardCard => {
            const dashboardId = dashboardCard.dataset.dashboardId;
            const currentDashboard = dashboards.find(d => d.id === dashboardId);

            // Using direct property assignment (onclick) for simplicity to overwrite previous listeners
            // For more complex scenarios, removeEventListener is preferred.

            // Add Link button specific to this card
            const addLinkCardBtn = dashboardCard.querySelector('.add-link-card-btn');
            if (addLinkCardBtn) {
                addLinkCardBtn.onclick = (e) => {
                    e.stopPropagation();
                    currentDashboardIndex = dashboards.findIndex(d => d.id === dashboardId);
                    scrollToDashboard(currentDashboardIndex);
                    updatePaginationDots();
                    openLinkModal('add');
                };
            }

            // Edit Dashboard button
            const editDashboardButton = dashboardCard.querySelector('.edit-dashboard-btn');
            if (editDashboardButton) {
                editDashboardButton.onclick = (e) => {
                    e.stopPropagation();
                    openDashboardModal('edit', currentDashboard);
                };
            }

            // Delete Dashboard button
            const deleteDashboardButton = dashboardCard.querySelector('.delete-dashboard-btn');
            if (deleteDashboardButton) {
                deleteDashboardButton.onclick = (e) => {
                    e.stopPropagation();
                    if (confirm(`'${currentDashboard.name}' 대시보드를 정말 삭제하시겠습니까? (포함된 링크도 모두 삭제됩니다)`)) {
                        dashboards = dashboards.filter(d => d.id !== dashboardId);
                        saveData();
                        if (dashboards.length > 0 && currentDashboardIndex >= dashboards.length) {
                            currentDashboardIndex = dashboards.length - 1;
                        } else if (dashboards.length === 0) {
                            currentDashboardIndex = 0;
                        }
                        renderDashboards();
                        showToast('대시보드가 삭제되었습니다.');
                    }
                };
            }

            // Delegated event listener for link item actions (edit/delete/direct open)
            const linksList = dashboardCard.querySelector('.links-list');
            if (linksList) {
                linksList.onclick = (e) => {
                    const linkItem = e.target.closest('.link-item');
                    if (!linkItem) return;

                    const linkId = linkItem.dataset.linkId;
                    const targetLink = currentDashboard?.links.find(link => link.id === linkId);
                    if (!targetLink) return;

                    if (e.target.closest('.edit-link-btn')) {
                        e.stopPropagation();
                        openLinkModal('edit', targetLink);
                    } else if (e.target.closest('.delete-link-btn')) {
                        e.stopPropagation();
                        if (confirm(`'${targetLink.title}' 링크를 정말 삭제하시겠습니까?`)) {
                            currentDashboard.links = currentDashboard.links.filter(link => link.id !== linkId);
                            saveData();
                            renderLinksForDashboard(dashboardId, linksList.id);
                            showToast('링크가 삭제되었습니다.');
                        }
                    } else {
                        // Direct click on link item (not action buttons)
                        window.open(targetLink.url, '_blank');
                    }
                };
            }
        });
    }

    // Pagination dot click (mobile)
    dashboardPagination.addEventListener('click', (e) => {
        if (e.target.classList.contains('pagination-dot')) {
            const index = parseInt(e.target.dataset.index);
            if (index !== currentDashboardIndex) {
                currentDashboardIndex = index;
                scrollToDashboard(currentDashboardIndex);
                // updateMainTitle(); // Not needed as title is fixed
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
            
            // For scroll-snap-align: start, the closest card is the one whose left edge is nearest to scrollLeft
            cardElements.forEach((card, index) => {
                const diff = Math.abs(card.offsetLeft - scrollLeft);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex = index;
                }
            });

            if (closestIndex !== currentDashboardIndex) {
                currentDashboardIndex = closestIndex;
                // updateMainTitle(); // Not needed as title is fixed
                updatePaginationDots();
            }
        }, 100); // Debounce scroll event
    });


    // Ensure scroll position is correct on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (isLoggedIn && dashboards.length > 0) {
                 scrollToDashboard(currentDashboardIndex, false); // No smooth scroll on resize
            }
        }, 200);
    });

    // --- Initial Load ---
    loadData();
    if (localStorage.getItem('isLoggedInDashLink') === 'true') {
        isLoggedIn = true;
        loginScreen.classList.remove('active');
        mainDashboardScreen.classList.add('active');
        renderDashboards();
    } else {
        loginScreen.classList.add('active');
    }
});
