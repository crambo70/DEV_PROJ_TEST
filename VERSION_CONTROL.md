# VERSION CONTROL & COORDINATION GUIDE

> This guide explains our version control workflow. Following these practices helps maintain consistency across the codebase.

---

## 🎯 Current Version: v2.6.7

**Last Updated:** December 12, 2025

---

## 📋 Version Update Workflow

### Before Making Any Changes:

1. **Check Current Version**
   - Open `version.json` - **This is the single source of truth for version number**
   - Note the current version number
   - Open `IMPLEMENTATION_PLAN.md` and read the last 5 changelog entries to understand recent changes

2. **Verify Version Consistency**
   - Check that `version.json` exists and is valid JSON
   - Ensure `IMPLEMENTATION_PLAN.md` version matches `version.json`
   - If they don't match, ask user for clarification before proceeding

### While Making Changes:

3. **Determine Version Increment**
   - **Patch (X.X.+1)**: Bug fixes, typos, minor CSS tweaks, small adjustments
     - Example: Fixing a broken link, adjusting padding by 5px
   - **Minor (X.+1.0)**: New features, new sections, asset additions, enhancements
     - Example: Adding a new logo, implementing a new page section
   - **Major (+1.0.0)**: Breaking changes, major redesigns, architectural changes
     - Example: Complete redesign of service cards, new grid system

4. **Track Your Work**
   - Keep notes of what you're changing
   - Note file paths and line numbers
   - Document the "why" not just the "what"

### After Completing Changes:

5. **Update Version Number (3 locations)**

   **Location 1 (PRIMARY):** `version.json` - **Single source of truth**
   ```json
   {
     "version": "X.X.X",
     "lastUpdated": "YYYY-MM-DD"
   }
   ```

   **Location 2:** `IMPLEMENTATION_PLAN.md` (line ~5)
   ```markdown
   > **Current Version:** vX.X.X
   ```

   **Location 3:** All HTML pages will automatically update via `scripts/version-loader.js`
   - The script reads from `version.json` and updates the version indicator on page load
   - No manual HTML updates needed!

6. **Add Changelog Entry**

   In `IMPLEMENTATION_PLAN.md` changelog section (around line 112), add:
   ```markdown
   | YYYY-MM-DD | **vX.X.X:** Brief description of change | Impact category |
   ```

   **Example:**
   ```markdown
   | 2025-11-17 | **v2.2.0:** Added contact form to Get in Touch page with validation | New feature |
   ```

7. **Update Version History**

   In `IMPLEMENTATION_PLAN.md` version history section (around line 600), add to top:
   ```markdown
   - vX.X.X - Brief description
   ```

---

## 📊 Version Number Rules

### Semantic Versioning (MAJOR.MINOR.PATCH)

```
v2.1.1
│ │ │
│ │ └─── PATCH: Bug fixes, small tweaks
│ └───── MINOR: New features, enhancements
└─────── MAJOR: Breaking changes, redesigns
```

### When to Increment:

| Change Type | Version Bump | Example |
|-------------|--------------|---------|
| Fix typo in text | Patch | v2.1.1 → v2.1.2 |
| Adjust spacing/padding | Patch | v2.1.1 → v2.1.2 |
| Fix broken link | Patch | v2.1.1 → v2.1.2 |
| Add new image asset | Minor | v2.1.1 → v2.2.0 |
| Create new page section | Minor | v2.1.1 → v2.2.0 |
| Implement new feature | Minor | v2.1.1 → v2.2.0 |
| Complete UI redesign | Major | v2.1.1 → v3.0.0 |
| Change CSS framework | Major | v2.1.1 → v3.0.0 |
| Breaking API changes | Major | v2.1.1 → v3.0.0 |

---

## Common Mistakes to Avoid

### What to Avoid:
- Making changes without checking current version first
- Updating version in only one location (must update all!)
- Skipping the changelog entry
- Using arbitrary version numbers
- Reverting to old version numbers
- Making multiple unrelated changes in one version bump

### Best Practices:
- Always read IMPLEMENTATION_PLAN.md first
- Update version in version.json AND IMPLEMENTATION_PLAN.md
- Write clear, descriptive changelog entries
- Follow semantic versioning strictly
- Ask user if unsure about version increment
- Keep changes focused and documented

---

## 🔍 How to Check if Another Agent Made Changes

Before starting work, verify:

1. **Check Git Status** (if using git):
   ```bash
   git log -5 --oneline
   ```

2. **Check File Timestamps**:
   ```bash
   ls -lt index.html IMPLEMENTATION_PLAN.md
   ```

3. **Check Version Consistency**:
   - Read current version from IMPLEMENTATION_PLAN.md
   - Verify it matches index.html
   - If mismatch: Another agent may have made incomplete changes

4. **Ask User**:
   "I see the version is X.X.X - are there any recent changes I should know about?"

---

## 📝 Changelog Template

```markdown
| 2025-MM-DD | **vX.X.X:** [Action verb] [specific change] - [additional context if needed] | [Impact] |
```

**Good Examples:**
```markdown
| 2025-11-17 | **v2.2.0:** Added responsive contact form with client-side validation and success messaging | New feature |
| 2025-11-17 | **v2.1.2:** Fixed mobile menu z-index overlap issue on iOS Safari | Bug fix |
| 2025-11-17 | **v2.3.0:** Implemented Lottie animations for all 5 service icons with hover triggers | Enhancement |
```

**Bad Examples:**
```markdown
| 2025-11-17 | **v2.2.0:** Made some changes | ??? |
| 2025-11-17 | **v2.2.0:** Updated stuff | Vague |
| 2025-11-17 | Fixed bug | Missing version |
```

---

## 🎯 Quick Checklist

Before you commit/push changes:

- [ ] Read IMPLEMENTATION_PLAN.md current version
- [ ] Determined correct version increment (patch/minor/major)
- [ ] Updated version in `index.html` (line ~32-34)
- [ ] Updated version in `IMPLEMENTATION_PLAN.md` (line ~5)
- [ ] Added changelog entry in IMPLEMENTATION_PLAN.md (~line 112)
- [ ] Added version history entry in IMPLEMENTATION_PLAN.md (~line 600)
- [ ] Changelog entry is clear and descriptive
- [ ] Both version numbers match exactly
- [ ] Tested changes work as expected

---

## 💡 Pro Tips

1. **Always increment from current version** - Never skip versions
2. **One logical change per version** - Don't bundle unrelated changes
3. **Document the WHY** - Future you (or another agent) will thank you
4. **When in doubt, ask** - Better to clarify than make a mistake
5. **Keep notes** - Track what you're changing as you work

---

## 🆘 What If I Made a Mistake?

### **Scenario: I forgot to update the version**
1. Note what changes you made
2. Determine correct version increment
3. Update both files NOW
4. Add changelog entry retroactively
5. Explain to user what happened

### **Scenario: I used the wrong version number**
1. Read current version from IMPLEMENTATION_PLAN.md
2. Determine correct increment from that version
3. Update both files to correct version
4. Fix changelog entry
5. Apologize to user and explain the correction

### **Scenario: Another agent changed version while I was working**
1. Stop immediately
2. Check what they changed (read changelog)
3. Ask user: "I see version changed to X.X.X - should I continue from there?"
4. Rebase your changes on the new version
5. Increment from the NEW version, not the old one

---

## 📞 Need Help?

If you're unsure about:
- Which version increment to use
- How to describe your changes
- Whether changes qualify as major/minor/patch
- Version number conflicts

When in doubt, ask for clarification.

---

## 📚 Reference

- **Version Source of Truth**: `version.json` - **PRIMARY VERSION CONTROL FILE**
- **Version Loader Script**: `scripts/version-loader.js` - Automatically updates all pages
- **Documentation Version**: `IMPLEMENTATION_PLAN.md` line ~5
- **User-Facing Version**: All HTML pages (auto-updated via JavaScript)
- **Full Changelog**: `IMPLEMENTATION_PLAN.md` starting ~line 112
- **Version History**: `IMPLEMENTATION_PLAN.md` starting ~line 600

---

**Last Updated:** November 28, 2025
**Document Version:** 2.0
**Maintained By:** Project Team

---

> Following these practices ensures smooth collaboration and reliable version tracking.
