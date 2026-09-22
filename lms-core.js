/**
 * LMS Core Prototype Helper - Computer Science (11th Standard)
 * Provides unified client-side interactions, navigation assistance, search,
 * modals (Support, User Guide, AI Tutor, Logout), and drawer controls.
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', initLMSCore);

    function initLMSCore() {
        setupMobileDrawers();
        setupSupportModal();
        setupUserGuideModal();
        setupAITutorModal();
        setupLogoutConfirm();
        setupQuickSearch();
        setupBrandLogoLink();
        setupActiveNavState();
    }

    // 1. Mobile Sidebar & Right Panel Drawers
    function setupMobileDrawers() {
        const menuBtn = document.getElementById('menu-btn');
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('backdrop');

        if (menuBtn && sidebar && backdrop) {
            const toggleLeftSidebar = () => {
                sidebar.classList.toggle('-translate-x-full');
                backdrop.classList.toggle('hidden');
            };
            menuBtn.addEventListener('click', toggleLeftSidebar);
            backdrop.addEventListener('click', toggleLeftSidebar);
        }

        const rightPanelBtn = document.getElementById('right-panel-btn');
        const mobileProfileTab = document.getElementById('mobile-profile-tab');
        const rightPanel = document.getElementById('right-panel');
        const rightBackdrop = document.getElementById('right-backdrop');
        const closeRightPanel = document.getElementById('close-right-panel');

        if (rightPanel) {
            const toggleRightPanel = (e) => {
                if (e) e.preventDefault();
                rightPanel.classList.toggle('translate-x-full');
                if (rightBackdrop) rightBackdrop.classList.toggle('hidden');
            };

            if (rightPanelBtn) rightPanelBtn.addEventListener('click', toggleRightPanel);
            if (mobileProfileTab) mobileProfileTab.addEventListener('click', toggleRightPanel);
            if (closeRightPanel) closeRightPanel.addEventListener('click', toggleRightPanel);
            if (rightBackdrop) rightBackdrop.addEventListener('click', toggleRightPanel);
        }
    }

    // 2. Support Modal
    function setupSupportModal() {
        const supportBtn = document.getElementById('support-btn');
        const supportModal = document.getElementById('support-modal');
        const closeModal = document.getElementById('close-modal');

        if (supportBtn && supportModal) {
            supportBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                supportModal.classList.toggle('hidden');
            });

            if (closeModal) {
                closeModal.addEventListener('click', () => {
                    supportModal.classList.add('hidden');
                });
            }

            window.addEventListener('click', (e) => {
                if (!supportModal.contains(e.target) && !supportBtn.contains(e.target)) {
                    supportModal.classList.add('hidden');
                }
            });
        }
    }

    // 3. User Guide Modal
    function setupUserGuideModal() {
        const guideModalId = 'lms-user-guide-modal';
        let guideModal = document.getElementById(guideModalId);

        if (!guideModal) {
            guideModal = document.createElement('div');
            guideModal.id = guideModalId;
            guideModal.className = 'hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4';
            guideModal.innerHTML = `
                <div class="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
                    <button id="close-guide-modal" class="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold text-sm p-1 rounded-lg cursor-pointer">✕</button>
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-lg font-bold">
                            <i class="fa-solid fa-book-open-reader"></i>
                        </div>
                        <div>
                            <h3 class="text-base font-bold text-slate-900">Student User Guide</h3>
                            <p class="text-xs text-slate-500">11th Standard Computer Science LMS</p>
                        </div>
                    </div>
                    <div class="space-y-3.5 text-xs text-slate-600">
                        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 class="font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                                <i class="fa-solid fa-graduation-cap text-sky-600"></i>
                                <span>1. Learn Hub & Interactive Cards</span>
                            </h4>
                            <p>Study chapter topics through bite-sized flashcards with code snippets, Urdu terminology, and exam rubrics.</p>
                        </div>
                        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 class="font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                                <i class="fa-solid fa-pen-to-square text-rose-600"></i>
                                <span>2. Practice & Mock Exams</span>
                            </h4>
                            <p>Generate timed or untimed practice sets by chapter, or launch the official Board Exam Simulation with live timer.</p>
                        </div>
                        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 class="font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                                <i class="fa-solid fa-triangle-exclamation text-amber-600"></i>
                                <span>3. Mistakes & Recovery</span>
                            </h4>
                            <p>Questions answered incorrectly in tests are automatically stored in the Mistakes Hub for targeted re-drilling.</p>
                        </div>
                        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 class="font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                                <i class="fa-solid fa-chart-line text-teal-600"></i>
                                <span>4. Progress & Official Reports</span>
                            </h4>
                            <p>Track accuracy, syllabus coverage, and export your official printable student report card anytime.</p>
                        </div>
                    </div>
                    <div class="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                        <button id="got-it-guide-btn" class="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer">
                            Got it, thanks!
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(guideModal);

            const closeBtn = document.getElementById('close-guide-modal');
            const gotItBtn = document.getElementById('got-it-guide-btn');
            const hideGuide = () => guideModal.classList.add('hidden');

            if (closeBtn) closeBtn.addEventListener('click', hideGuide);
            if (gotItBtn) gotItBtn.addEventListener('click', hideGuide);
            guideModal.addEventListener('click', (e) => {
                if (e.target === guideModal) hideGuide();
            });
        }

        document.querySelectorAll('a[title*="User Guide"], a[href="#user-guide"], button[title*="User Guide"]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const supportModal = document.getElementById('support-modal');
                if (supportModal) supportModal.classList.add('hidden');
                guideModal.classList.remove('hidden');
            });
        });
    }

    // 4. AI Tutor Modal
    function setupAITutorModal() {
        const tutorModalId = 'lms-ai-tutor-modal';
        let tutorModal = document.getElementById(tutorModalId);

        if (!tutorModal) {
            tutorModal = document.createElement('div');
            tutorModal.id = tutorModalId;
            tutorModal.className = 'hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4';
            tutorModal.innerHTML = `
                <div class="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 relative">
                    <button id="close-tutor-modal" class="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold text-sm p-1 rounded-lg cursor-pointer">✕</button>
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg font-bold">
                            <i class="fa-solid fa-robot"></i>
                        </div>
                        <div>
                            <h3 class="text-base font-bold text-slate-900">AI Computer Science Tutor</h3>
                            <p class="text-xs text-slate-500">24/7 Conceptual & Coding Assistant</p>
                        </div>
                    </div>
                    <div class="space-y-3 text-xs">
                        <div class="bg-purple-50/70 p-4 rounded-2xl border border-purple-100">
                            <p class="text-purple-900 font-medium leading-relaxed">
                                Hello Uzair! I'm your CS Assistant. Need clarification on C++ OOP concepts, pointers, or networking models?
                            </p>
                        </div>
                        <div class="space-y-1.5 pt-1">
                            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Inquiries:</p>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <a href="learn.html" class="p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 bg-slate-50 hover:bg-purple-50/50 text-slate-700 hover:text-purple-900 font-semibold transition text-left flex items-center space-x-2">
                                    <i class="fa-solid fa-code text-purple-600"></i>
                                    <span>Polymorphism in C++</span>
                                </a>
                                <a href="learn.html" class="p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 bg-slate-50 hover:bg-purple-50/50 text-slate-700 hover:text-purple-900 font-semibold transition text-left flex items-center space-x-2">
                                    <i class="fa-solid fa-network-wired text-purple-600"></i>
                                    <span>OSI vs TCP/IP Layers</span>
                                </a>
                                <a href="revision.html" class="p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 bg-slate-50 hover:bg-purple-50/50 text-slate-700 hover:text-purple-900 font-semibold transition text-left flex items-center space-x-2">
                                    <i class="fa-solid fa-cube text-purple-600"></i>
                                    <span>Virtual Destructors</span>
                                </a>
                                <a href="mistakes.html" class="p-2.5 rounded-xl border border-slate-200 hover:border-purple-300 bg-slate-50 hover:bg-purple-50/50 text-slate-700 hover:text-purple-900 font-semibold transition text-left flex items-center space-x-2">
                                    <i class="fa-solid fa-triangle-exclamation text-amber-600"></i>
                                    <span>Review 14 Logged Errors</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span class="text-[10px] text-slate-400 font-mono">Offline Ready Prototype</span>
                        <a href="learn.html" class="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition">
                            Open Learn Hub
                        </a>
                    </div>
                </div>
            `;
            document.body.appendChild(tutorModal);

            const closeTutorBtn = document.getElementById('close-tutor-modal');
            const hideTutor = () => tutorModal.classList.add('hidden');
            if (closeTutorBtn) closeTutorBtn.addEventListener('click', hideTutor);
            tutorModal.addEventListener('click', (e) => {
                if (e.target === tutorModal) hideTutor();
            });
        }

        document.querySelectorAll('a[title="AI Tutor"], button[title="Ask AI Tutor"], button[title="Ask AI about Polymorphism"]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                tutorModal.classList.remove('hidden');
            });
        });
    }

    // 5. Logout Confirmation
    function setupLogoutConfirm() {
        document.querySelectorAll('button[title="Logout Account"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const confirmLogout = window.confirm('Are you sure you want to log out of your student session?');
                if (confirmLogout) {
                    window.location.href = 'dashboard.html';
                }
            });
        });
    }

    // 6. Quick Search across LMS
    function setupQuickSearch() {
        const searchInputs = document.querySelectorAll('header input[type="text"], main input[placeholder*="Search"]');
        if (!searchInputs.length) return;

        const siteMapKeywords = [
            { keywords: ['overview', 'dashboard', 'home', 'main', 'summary'], url: 'dashboard.html', title: 'Dashboard Overview' },
            { keywords: ['learn', 'study', 'unit 3', 'polymorphism', 'classes', 'oop', 'c++', 'topic'], url: 'learn.html', title: 'Learn Hub (Topic 3.4 Polymorphism)' },
            { keywords: ['past papers', 'paper', 'bise', 'lahore', 'board', 'solved', 'annual'], url: 'past-papers.html', title: 'Past Papers Archive' },
            { keywords: ['view paper', 'solution', 'paper viewer'], url: 'view-paper.html', title: 'Solved Paper Viewer' },
            { keywords: ['practice', 'test', 'quiz', 'mcqs', 'questions', 'module'], url: 'practice.html', title: 'Practice Hub' },
            { keywords: ['configure', 'custom test', 'generator', 'setup'], url: 'configure-test.html', title: 'Configure Mock Test' },
            { keywords: ['mock', 'exam room', 'active test', 'timer'], url: 'mock-test.html', title: 'Mock Exam Room' },
            { keywords: ['exam mode', 'simulation', 'board exam', 'timed'], url: 'exam-mode.html', title: 'Board Exam Simulation Hub' },
            { keywords: ['mistakes', 'errors', 'wrong', 'drill', 'recovery'], url: 'mistakes.html', title: 'Mistakes Review Hub' },
            { keywords: ['progress', 'analytics', 'grades', 'metrics', 'stats'], url: 'progress.html', title: 'Progress & Analytics' },
            { keywords: ['report', 'transcript', 'official report', 'certificate'], url: 'progress-report.html', title: 'Official Student Progress Report' },
            { keywords: ['revision', 'formulas', 'definitions', 'key points', 'notes'], url: 'revision.html', title: 'Revision Hub' },
            { keywords: ['bookmark', 'bookmarks', 'saved', 'favorites'], url: 'bookmark.html', title: 'Saved Bookmarks' },
            { keywords: ['profile', 'account', 'student', 'uzair', 'bio'], url: 'profile.html', title: 'Student Profile' },
            { keywords: ['card', 'id card', 'student card'], url: 'student-card.html', title: 'Official Student ID Card' },
            { keywords: ['settings', 'preferences', 'storage', 'offline', 'mode'], url: 'settings.html', title: 'Settings Hub' }
        ];

        searchInputs.forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const query = input.value.trim().toLowerCase();
                    if (!query) return;

                    const match = siteMapKeywords.find(item => 
                        item.keywords.some(k => query.includes(k) || k.includes(query)) ||
                        item.title.toLowerCase().includes(query)
                    );

                    if (match) {
                        window.location.href = match.url;
                    } else {
                        window.location.href = 'learn.html';
                    }
                }
            });
        });
    }

    // 7. Make Brand Logo and Name Link to Dashboard
    function setupBrandLogoLink() {
        document.querySelectorAll('header .flex.items-center.space-x-2, header .flex.items-center.space-x-3').forEach(brandEl => {
            const logoBlock = brandEl.querySelector('.bg-gradient-to-tr');
            if (logoBlock && !brandEl.closest('a')) {
                brandEl.style.cursor = 'pointer';
                brandEl.setAttribute('title', 'Return to LMS Dashboard');
                brandEl.addEventListener('click', (e) => {
                    // Don't trigger if clicked on menu-btn
                    if (e.target.closest('#menu-btn')) return;
                    window.location.href = 'dashboard.html';
                });
            }
        });
    }

    // 8. Auto-Verify Active Navigation State & aria-current
    function setupActiveNavState() {
        const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';
        const sidebarLinks = document.querySelectorAll('#sidebar a[href]');
        
        sidebarLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

})();
