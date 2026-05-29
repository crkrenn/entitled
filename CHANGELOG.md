# Entitled Extension - Change Journal

## 2026-05-29 - Added {folder} Variable & Documentation Fixes
**What Changed:** Added `{folder}` variable for current file's folder name and corrected documentation
**Why:** Users needed folder name variable, and VS Code built-in variables don't work with this extension
**Files Modified:**
- `src/services/WindowTitleService.ts` - Added `extractFolderName()` method and `{folder}` variable
- `README.md` - Removed incorrect references to VS Code built-in variables, added `{folder}` documentation
- `package.json` - Updated description to remove VS Code built-in variable references
- `ENV_VAR_FEATURE.md` - Corrected documentation

**New Functionality:**
- ✅ `{folder}` variable - Shows folder name containing the active file (e.g., "src")

**Important Correction:**
- ❌ VS Code built-in variables like `${remoteName}`, `${dirty}`, `${separator}` do **NOT** work with this extension
- ✅ Use only custom variables with `{variable}` syntax

**Example Patterns:**
- `{env.USER}@{env.HOSTNAME} {folder}/{filename}` → `john@myserver src/index.ts`
- `{workspace} [{branch}] {folder}/{filename}` → `my-project [main] src/index.ts`

## 2026-05-28 - Environment Variable Support
**What Changed:** Added support for environment variables in window title patterns
**Why:** Users can now include system information like username and hostname in their window titles
**Files Modified:**
- `src/services/WindowTitleService.ts` - Added environment variable resolution for `{env.VARNAME}` pattern
- `README.md` - Updated documentation with environment variable examples
- `package.json` - Updated configuration description to include environment variables
- `src/test/suite/windowTitleService.test.ts` - Added 6 comprehensive tests for environment variable support

**New Functionality:**
- ✅ Support for `{env.VARNAME}` syntax (e.g., `{env.USER}`, `{env.HOSTNAME}`)
- ✅ Environment variables work in fallback chains (e.g., `{env.USER || workspace}`)
- ✅ Can combine with existing variables (e.g., `{env.USER}@{env.HOSTNAME} | {workspace} [{branch}]`)

**Example Patterns:**
- `{env.USER}@{env.HOSTNAME} | {workspace} [{branch}]` → `username@hostname | my-project [main]`
- `{env.USER || workspace} - {repo}` → Falls back to workspace if USER not set

**Test Coverage:** All 37 tests passing ✅

## Project Setup Phase

### 2025-06-24 - Initial Extension Structure
**What Changed:** Created complete VS Code extension project structure
**Why:** Needed foundational structure for extension development with proper TypeScript, testing, and packaging setup
**Files Modified:**

- Created package.json with extension manifest
- Created src/extension.ts with basic activation
- Created .vscode/launch.json and tasks.json for debugging
- Created test infrastructure

### 2025-06-24 - Test-Driven Development Setup
**What Changed:** Preparing to implement window title customization with TDD approach
**Why:** Systematic development approach ensures code quality and prevents regressions
**Next Steps:**

- Define window title requirements through tests
- Implement window title service
- Add configuration for custom title patterns

## Feature Development Phase

### 2025-06-24 - WindowTitleService Implementation (TDD Phase 1)
**What Changed:** Created comprehensive test suite and WindowTitleService class
**Why:** TDD approach ensures we build exactly what's needed and tests verify functionality

**Files Added:**
- `src/test/suite/windowTitleService.test.ts` - Complete test suite with 14 test cases
- `src/services/WindowTitleService.ts` - Core service implementation

**Test Coverage:**
- ✅ Title component extraction (workspace, branch, filename)
- ✅ Title composition with various component combinations
- ✅ Window title update mechanisms
- ✅ Custom title pattern support
- ✅ Edge cases (missing components, special characters)

**Current Status:** All 16 tests passing ✅
**Next Steps:** ✅ Integrate service with main extension and implement actual window title updates

### 2025-06-24 - Extension Integration & Git Support
**What Changed:** Integrated WindowTitleService into main extension with git branch detection and configuration support
**Why:** Complete the core functionality and make extension functional for end users

**Files Modified:**
- `src/extension.ts` - Integrated WindowTitleService into main extension activation
- `src/services/WindowTitleService.ts` - Added git branch detection and configuration support
- `package.json` - Added configuration schema for user customization

**New Features:**
- ✅ Git branch detection using VS Code's built-in Git API
- ✅ Fallback to reading .git/HEAD directly
- ✅ User configuration for enabling/disabling custom titles
- ✅ Custom title pattern support with variables: {workspace}, {branch}, {filename}
- ✅ Automatic title updates on workspace/editor changes
- ✅ Error handling for edge cases

**Configuration Options:**
- `entitled.enableCustomTitle` (boolean) - Enable/disable custom title formatting
- `entitled.titlePattern` (string) - Custom pattern with variables

**Current Status:** Extension fully functional with all tests passing ✅

### 2025-06-24 - Enhanced Development Configuration
**What Changed:** Improved VS Code development experience with enhanced launch configurations and build tasks
**Why:** Better debugging experience and more efficient development workflow

**Configuration Improvements:**

`.vscode/launch.json` enhancements:
- ✅ Added source maps support (`"sourceMaps": true`)
- ✅ Added smart stepping (`"smartStep": true`) 
- ✅ Skip Node.js internals during debugging (`"skipFiles": ["<node_internals>/**"]`)
- ✅ Added "Run Extension (Clean Build)" configuration for fresh builds
- ✅ Added compound configuration "Extension + Tests" to run both simultaneously

`.vscode/tasks.json` enhancements:
- ✅ Added "Clean Build" task using rimraf
- ✅ Added "Full Rebuild" task (clean + compile sequence)
- ✅ Enhanced task dependencies and presentation settings

`.vscode/settings.json` (new):
- ✅ TypeScript auto-import preferences
- ✅ ESLint auto-fix on save
- ✅ Proper file exclusions for search and explorer
- ✅ Extension-specific development settings

`package.json` script improvements:
- ✅ Added `clean` script using rimraf for cross-platform file deletion
- ✅ Added rimraf as dev dependency

**Available Debug Configurations:**
1. **"Run Extension"** - Standard debug with watch mode
2. **"Extension Tests"** - Debug test suite
3. **"Run Extension (Clean Build)"** - Debug with fresh compilation
4. **"Extension + Tests"** - Run both extension and tests simultaneously

**Available Tasks:**
- `npm run clean` - Remove compiled files
- `npm run compile` - One-time compilation  
- `npm run watch` - Watch mode compilation
- `npm run test` - Full test suite
- `npm run package` - Create .vsix package
- "Full Rebuild" task - Clean + compile sequence

**Current Status:** Development environment optimized for efficient VS Code extension development ✅

### 2025-06-24 - File Exclusion & Packaging Optimization
**What Changed:** Enhanced `.gitignore` and `.vscodeignore` files for proper file exclusion and optimized packaging
**Why:** Ensure clean version control, smaller package size, and proper separation of development vs. distribution files

**File Exclusion Improvements:**

`.gitignore` enhancements:
- ✅ Comprehensive build output exclusions (`out/`, `dist/`, `build/`)
- ✅ Complete Node.js ecosystem exclusions (cache, logs, temp files)
- ✅ Environment file protection (`.env*`)
- ✅ OS-specific file exclusions (`.DS_Store`, `Thumbs.db`)
- ✅ IDE file exclusions (`.idea/`, swap files)
- ✅ Package manager lock files
- ✅ Coverage and testing artifacts

`.vscodeignore` enhancements:
- ✅ All TypeScript source files excluded from package
- ✅ Development configuration files excluded
- ✅ Test files and coverage excluded
- ✅ Documentation except README excluded
- ✅ Build artifacts and source maps excluded
- ✅ Comprehensive OS and IDE file exclusions

**Package Completeness:**
- ✅ Added `LICENSE` file (MIT License)
- ✅ Added repository field to `package.json`
- ✅ Package now builds without warnings

**Final Package Contents:**
```
entitled-0.0.1.vsix (11.35 KB)
├─ LICENSE.txt
├─ README.md
├─ package.json
└─ out/ (compiled JavaScript only)
   ├─ extension.js
   ├─ services/WindowTitleService.js
   └─ test/ (for extension testing)
```

**Benefits:**
- **Clean Git History** - No build artifacts or temporary files tracked
- **Optimized Package Size** - Only essential files in .vsix (11.35 KB)
- **Professional Structure** - Proper licensing and repository information
- **Development Efficiency** - IDE and OS files properly ignored

**Current Status:** File management and packaging fully optimized ✅

## Production & CI/CD Phase

### 2025-06-24 - Git Repository Setup & Initial Publish
**What Changed:** Initialized Git repository, committed all code, and pushed to GitHub
**Why:** Version control is essential for collaboration and provides foundation for CI/CD automation

**Repository Setup:**
- ✅ Initialized Git repository with proper .gitignore
- ✅ Created initial commit with complete codebase
- ✅ Set up GitHub remote repository at `https://github.com/ashurtech/entitled`
- ✅ Updated package.json with repository metadata (bugs, homepage)
- ✅ Pushed all code to GitHub master branch

**Package Metadata Improvements:**
- ✅ Updated publisher to "ASHURTECH.NET"
- ✅ Enhanced display name: "Entitled - Custom Window Titles"
- ✅ Improved description with feature details
- ✅ Added comprehensive keywords for discoverability

**Current Status:** Code successfully versioned and available on GitHub ✅

### 2025-06-24 - Comprehensive CI/CD Pipeline Implementation
**What Changed:** Built enterprise-grade CI/CD pipeline with GitHub Actions for automated testing, security, and publishing
**Why:** Professional development workflow ensures code quality, security, and seamless releases

**GitHub Actions Workflows Created:**

**1. PR Checks (`pr-checks.yml`)**
- ✅ Multi-Node.js testing (16.x, 18.x, 20.x)
- ✅ TypeScript compilation validation
- ✅ ESLint code quality checks
- ✅ npm security audit (moderate+ vulnerabilities)
- ✅ Automated package building verification
- ✅ Snyk security scanning integration
- ✅ CodeQL static analysis integration

**2. Build & Publish (`build-and-publish.yml`)**
- ✅ Automated VS Code Marketplace publishing on merge to main
- ✅ Open VSX Registry publishing for wider distribution
- ✅ GitHub release creation with .vsix artifacts
- ✅ Automatic version tagging and release notes

**3. Security Analysis (`codeql.yml`)**
- ✅ Weekly CodeQL security scans
- ✅ Pull request security analysis
- ✅ Extended security query suite

**4. Dependency Management (`dependency-updates.yml`)**
- ✅ Weekly automated dependency update PRs
- ✅ Safe minor/patch version updates only
- ✅ Automated testing of updates before PR creation

**5. Manual Version Control (`version-bump.yml`)**
- ✅ Workflow dispatch for manual version bumping
- ✅ Automatic CHANGELOG.md updates
- ✅ Git tagging with version numbers

**Enhanced Package Scripts:**
```json
{
  "lint:fix": "eslint src --ext ts --fix",
  "test:coverage": "nyc npm test",
  "publish": "vsce publish",
  "publish:ovsx": "ovsx publish",
  "version:patch": "npm version patch",
  "version:minor": "npm version minor", 
  "version:major": "npm version major",
  "security:audit": "npm audit --audit-level=moderate",
  "security:fix": "npm audit fix",
  "deps:check": "npm outdated",
  "deps:update": "npm update"
}
```

**New Development Dependencies:**
- ✅ `nyc` - Test coverage reporting
- ✅ `ovsx` - Open VSX Registry publishing

**GitHub Templates & Documentation:**
- ✅ Bug report template with environment details
- ✅ Feature request template with implementation ideas  
- ✅ Pull request template with comprehensive checklist
- ✅ CONTRIBUTING.md with complete development workflow
- ✅ .github/CICD_SETUP.md with detailed setup instructions
- ✅ PIPELINE_SETUP.md with quick setup guide

**Security Features:**
- ✅ Multi-layer vulnerability scanning (npm audit, Snyk, CodeQL)
- ✅ Dependency safety reviews for malicious packages
- ✅ Automated security monitoring and alerts
- ✅ Branch protection enforcement capabilities

**Current Status:** Enterprise-grade CI/CD pipeline fully implemented ✅

### 2025-06-24 - CI/CD Pipeline Refinements & Fixes
**What Changed:** Resolved GitHub Advanced Security dependency issues and simplified version management
**Why:** Free repositories don't have GitHub Advanced Security, and version checking was overly restrictive for development

**Issues Resolved:**

**1. Dependency Review Limitation**
- ❌ **Problem:** `dependency-review-action` requires GitHub Advanced Security (paid feature)
- ✅ **Solution:** Disabled dependency review job for free repositories
- ✅ **Alternative:** npm audit + CodeQL + Snyk still provide comprehensive security coverage
- ✅ **Documentation:** Updated setup guides to reflect this limitation

**2. Version Check Complexity** 
- ❌ **Problem:** Automatic version validation was confusing and overly restrictive
- ✅ **Solution:** Removed version-check job from PR requirements
- ✅ **Benefit:** More flexible development workflow
- ✅ **Alternative:** Manual version management with optional automation

**Configuration Updates:**
- ✅ Updated branch protection documentation (removed `dependency-review` requirement)
- ✅ Simplified PR template (removed mandatory version bump requirement)
- ✅ Updated CONTRIBUTING.md to reflect flexible version management
- ✅ Fixed `install-package` script to use current version (0.0.4)

**Simplified Workflow:**
- **Development:** Create features without mandatory version bumps
- **Publishing:** Version management can be done manually or via automation workflow
- **Security:** Still comprehensive with npm audit, CodeQL, and optional Snyk
- **Quality:** Full linting, testing, and compilation checks maintained

**Final Pipeline Features:**
- ✅ Multi-Node.js testing and validation
- ✅ Security scanning (npm audit + CodeQL + optional Snyk)
- ✅ Automated marketplace publishing on merge
- ✅ GitHub releases with artifacts
- ✅ Weekly dependency updates
- ✅ Manual version bump automation available
- ✅ Professional templates and documentation

**Current Status:** CI/CD pipeline refined and production-ready ✅

### Window Title Customization Feature
**Requirements:**

1. Primary: Set window title to: workspace/folder name + branch + filename + "VSCode"
2. Secondary: Allow custom title pattern composition

**Implementation Strategy:**

- ✅ Start with tests defining expected behavior
- ✅ Create WindowTitleService class
- ✅ Integrate with VS Code window API
- ✅ Add configuration options

**Current Status:** Core functionality complete, CI/CD pipeline operational ✅

## Current Version - v0.0.4

### 2025-06-24 - Added Repository Name Variable
**What Changed:** Added `{repo}` variable for git repository name extraction
**Why:** Provides distinction between workspace folder name and actual git repository name, useful when they differ
**Files Modified:**

- Updated `src/services/WindowTitleService.ts`:
  - Added `repo` to `TitleComponents` interface
  - Implemented `extractRepoName()` method with multiple extraction strategies
  - Updated `gatherTitleComponents()` to include repository name
  - Updated `composeCustomTitle()` to handle `{repo}` variable
- Updated `package.json`:
  - Added `{repo}` to configuration description
- Updated `src/test/suite/windowTitleService.test.ts`:
  - Added repo property to all test components
  - Added test for repository name extraction
  - Added test for `{repo}` variable in custom patterns

**How It Works:**
- Extracts repository name from VS Code's git API when available
- Falls back to .git directory inspection
- Parses remote origin URL to extract repository name from various formats
- Returns empty string if not a git repository

**Usage Example:**
```json
{
  "entitled.titlePattern": "{repo} [{branch}] {filename} (last: {timestamp})"
}
```

### 2025-06-24 - Added Fallback Pattern Support

**What Changed:** Implemented fallback pattern syntax with `||` operator for robust title patterns

**Why:** Provides graceful degradation when preferred variables are empty, making title patterns more flexible and reliable

**Files Modified:**

- Updated `src/services/WindowTitleService.ts`:
  - Completely rewrote `composeCustomTitle()` to handle fallback patterns
  - Added `getVariableValue()` helper method for variable resolution
  - Added regex-based pattern matching for `{variable1 || variable2 || variable3}` syntax
- Updated `package.json`:
  - Added fallback syntax documentation to configuration description
- Updated `src/test/suite/windowTitleService.test.ts`:
  - Added 8 comprehensive tests covering all fallback scenarios
  - Tests cover single fallbacks, multiple fallbacks, spaces, edge cases

**How It Works:**

- Uses `||` operator for fallback chains: `{workspace || repo || filename}`
- Evaluates variables left-to-right, using first non-empty value
- Supports multiple fallback patterns in one title
- Handles whitespace gracefully around `||` operators
- Backwards compatible with existing single-variable patterns

**Usage Examples:**

```json
{
  "entitled.titlePattern": "{workspace || repo || filename} [{branch}] (last: {timestamp})"
}
```

This pattern will:
1. Use `workspace` if available
2. Fall back to `repo` if workspace is empty
3. Fall back to `filename` if both workspace and repo are empty
4. Always show branch and timestamp if available

**Real-world Benefits:**
- No more empty brackets when branch isn't available
- Reliable project identification even when workspace names differ from repo names
- Graceful handling of non-git projects

## Version 0.1.6 - 2025-06-25

### Timestamp Format Update
**What Changed:** Changed timestamp display from relative format ("now", "2m ago") to 24-hour format (HH:MM)
**Why:** User preference for cleaner, more precise time display
**Files Modified:**
- Updated `WindowTitleService.formatTimestamp()` method
- Updated all timestamp-related tests to use 24-hour format
- Updated documentation in README.md and FALLBACK_EXAMPLES.md
- Incremented version to 0.1.6

**Impact:** The `{timestamp}` variable now shows time like "14:30" instead of "2m ago"
