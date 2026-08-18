(()=>{
'use strict';
/*
 * Legacy action-guide overlay disabled.
 * It was rewriting the project course DOM after render, creating oversized
 * duplicate action headings, nested cards, sticky controls over content, and
 * conflicting visual placeholders on mobile.
 *
 * The project-course / beginner course renderer is now the single source of
 * truth for step actions, progress, visuals, checks and navigation.
 */
window.PI_ACTION_GUIDE_LEGACY_DISABLED = true;
})();
