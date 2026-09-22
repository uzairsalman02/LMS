/* Shared LMS navigation definition.
 * Server templates and future frontend components should consume this one list.
 */
window.LMS_NAVIGATION = [
  {
    label: 'Main',
    items: [
      { label: 'Overview', href: 'dashboard.html', icon: 'fa-house' },
      { label: 'Learn', href: 'learn.html', icon: 'fa-book-open' }
    ]
  },
  {
    label: 'Practice & Test',
    items: [
      { label: 'Past Papers', href: 'past-papers.html', icon: 'fa-file-lines' },
      { label: 'Practice', href: 'practice.html', icon: 'fa-pen-to-square' },
      { label: 'Exam Mode', href: 'exam-mode.html', icon: 'fa-laptop-code' },
      { label: 'Mistakes', href: 'mistakes.html', icon: 'fa-triangle-exclamation' }
    ]
  },
  {
    label: 'Tools & Tracking',
    items: [
      { label: 'Progress', href: 'progress.html', icon: 'fa-chart-line' },
      { label: 'Revision', href: 'revision.html', icon: 'fa-rotate-right' },
      { label: 'Bookmark', href: 'bookmark.html', icon: 'fa-bookmark' },
      { label: 'Profile', href: 'profile.html', icon: 'fa-user' },
      { label: 'Settings', href: 'settings.html', icon: 'fa-gear' }
    ]
  }
];
