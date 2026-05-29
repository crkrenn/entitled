import * as assert from 'assert';
import * as vscode from 'vscode';
import { WindowTitleService } from '../../services/WindowTitleService';

suite('WindowTitleService Tests', () => {
    let windowTitleService: WindowTitleService;

    setup(() => {
        windowTitleService = new WindowTitleService();
    });

    teardown(() => {
        // Clean up any modifications
        windowTitleService.dispose();
    });

    suite('Title Component Extraction', () => {        test('should extract workspace name when workspace is available', () => {
            const mockWorkspace = {
                name: 'my-project',
                uri: vscode.Uri.file('/path/to/my-project'),
                index: 0
            };
            
            const result = windowTitleService.extractWorkspaceName(mockWorkspace);
            assert.strictEqual(result, 'my-project');
        });        test('should extract folder name when workspace name is unavailable', () => {
            const mockWorkspace = {
                name: '',
                uri: vscode.Uri.file('/path/to/project-folder'),
                index: 0
            } as vscode.WorkspaceFolder;
            
            const result = windowTitleService.extractWorkspaceName(mockWorkspace);
            assert.strictEqual(result, 'project-folder');
        });

        test('should return empty string when no workspace is available', () => {
            const result = windowTitleService.extractWorkspaceName(undefined);
            assert.strictEqual(result, '');
        });

        test('should extract branch name from git repository', async () => {
            // This will be mocked in implementation
            const result = await windowTitleService.extractBranchName('/path/to/repo');
            assert.strictEqual(typeof result, 'string');
        });

        test('should extract repository name from git repository', async () => {
            // This will be mocked in implementation
            const result = await windowTitleService.extractRepoName('/path/to/repo');
            assert.strictEqual(typeof result, 'string');
        });

        test('should extract filename from active editor', () => {
            const mockEditor = {
                document: {
                    fileName: '/path/to/file.ts',
                    uri: vscode.Uri.file('/path/to/file.ts')
                }
            };
            
            const result = windowTitleService.extractFileName(mockEditor as any);
            assert.strictEqual(result, 'file.ts');
        });

        test('should return empty string when no active editor', () => {
            const result = windowTitleService.extractFileName(undefined);
            assert.strictEqual(result, '');
        });

        test('should extract folder name from active editor', () => {
            const mockEditor = {
                document: {
                    fileName: '/path/to/src/file.ts',
                    uri: vscode.Uri.file('/path/to/src/file.ts')
                }
            };

            const result = windowTitleService.extractFolderName(mockEditor as any);
            assert.strictEqual(result, 'src');
        });

        test('should extract nested folder name from active editor', () => {
            const mockEditor = {
                document: {
                    fileName: '/workspace/components/Button/index.tsx',
                    uri: vscode.Uri.file('/workspace/components/Button/index.tsx')
                }
            };

            const result = windowTitleService.extractFolderName(mockEditor as any);
            assert.strictEqual(result, 'Button');
        });

        test('should return empty string when no active editor for folder', () => {
            const result = windowTitleService.extractFolderName(undefined);
            assert.strictEqual(result, '');
        });
    });    suite('Title Composition', () => {        test('should compose title with all components available', () => {
            const components = {
                workspace: 'my-project',
                repo: 'my-repo',
                branch: 'feature/new-feature',
                filename: 'index.ts',
                timestamp: '14:30'
            };

            const result = windowTitleService.composeDefaultTitle(components);
            assert.strictEqual(result, 'my-project [feature/new-feature] index.ts - VSCode');
        });test('should compose title with workspace and filename only', () => {
            const components = {
                workspace: 'my-project',
                repo: 'my-repo',
                branch: '',
                filename: 'index.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeDefaultTitle(components);
            assert.strictEqual(result, 'my-project index.ts - VSCode');
        });        test('should compose title with filename only', () => {
            const components = {
                workspace: '',
                repo: '',
                branch: '',
                filename: 'index.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeDefaultTitle(components);
            assert.strictEqual(result, 'index.ts - VSCode');
        });        test('should compose title with just VSCode when no components', () => {
            const components = {
                workspace: '',
                repo: '',
                branch: '',
                filename: '',
                timestamp: 'now'
            };

            const result = windowTitleService.composeDefaultTitle(components);
            assert.strictEqual(result, 'VSCode');
        });        test('should handle branch name with special characters', () => {
            const components = {
                workspace: 'my-project',
                repo: 'my-repo',
                branch: 'feature/bug-fix-#123',
                filename: 'app.js',
                timestamp: 'now'
            };

            const result = windowTitleService.composeDefaultTitle(components);
            assert.strictEqual(result, 'my-project [feature/bug-fix-#123] app.js - VSCode');
        });
    });

    suite('Window Title Updates', () => {
        test('should update window title when workspace changes', async () => {
            let titleUpdateCalled = false;
            let updatedTitle = '';

            // Mock the title update function
            windowTitleService.onTitleUpdate((title: string) => {
                titleUpdateCalled = true;
                updatedTitle = title;
            });

            await windowTitleService.updateTitle();
            
            assert.strictEqual(titleUpdateCalled, true);
            assert.strictEqual(typeof updatedTitle, 'string');
        });

        test('should update window title when active editor changes', async () => {
            let updateCount = 0;

            windowTitleService.onTitleUpdate(() => {
                updateCount++;
            });

            // Simulate editor change
            await windowTitleService.handleActiveEditorChange();
            
            assert.strictEqual(updateCount, 1);
        });
    });    suite('Configuration', () => {        test('should respect custom title pattern when configured', () => {
            const customPattern = '{filename} | {workspace} | {branch}';
            const components = {
                workspace: 'my-project',
                repo: 'my-repo',
                branch: 'main',
                filename: 'test.ts',
                timestamp: '14:05'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'test.ts | my-project | main');
        });test('should handle missing components in custom pattern', () => {
            const customPattern = '{filename} | {workspace} | {branch}';
            const components = {
                workspace: 'my-project',
                repo: 'my-repo',
                branch: '',
                filename: 'test.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'test.ts | my-project | ');
        });        test('should include timestamp in custom pattern', () => {
            const customPattern = '{filename} ({timestamp}) - {workspace}';
            const components = {
                workspace: 'my-project',
                repo: 'my-repo',
                branch: 'main',
                filename: 'test.ts',
                timestamp: '14:30'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'test.ts (14:30) - my-project');
        });test('should include repo name in custom pattern', () => {
            const customPattern = '{repo} [{branch}] {filename}';
            const components = {
                workspace: 'my-project',
                repo: 'awesome-project',
                branch: 'feature/new-feature',
                filename: 'app.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'awesome-project [feature/new-feature] app.ts');
        });

        test('should include folder name in custom pattern', () => {
            const customPattern = '{folder}/{filename}';
            const components = {
                workspace: 'my-project',
                repo: 'my-repo',
                branch: 'main',
                filename: 'index.ts',
                folder: 'src',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'src/index.ts');
        });

        test('should combine folder with other variables', () => {
            const customPattern = '{workspace} | {folder}/{filename} [{branch}]';
            const components = {
                workspace: 'my-project',
                repo: 'my-repo',
                branch: 'feature/xyz',
                filename: 'Button.tsx',
                folder: 'components',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'my-project | components/Button.tsx [feature/xyz]');
        });

        test('should handle empty folder name gracefully', () => {
            const customPattern = '{folder}/{filename}';
            const components = {
                workspace: 'my-project',
                repo: 'my-repo',
                branch: 'main',
                filename: 'index.ts',
                folder: '',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, '/index.ts');
        });

        test('should handle fallback patterns with || syntax', () => {
            const customPattern = '{workspace || repo || filename}';
            const components = {
                workspace: '',
                repo: 'my-repo',
                branch: 'main',
                filename: 'app.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'my-repo');
        });

        test('should fall back to third option when first two are empty', () => {
            const customPattern = '{workspace || repo || filename}';
            const components = {
                workspace: '',
                repo: '',
                branch: 'main',
                filename: 'app.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'app.ts');
        });

        test('should use first non-empty value in fallback chain', () => {
            const customPattern = '{workspace || repo || filename}';
            const components = {
                workspace: 'my-workspace',
                repo: 'my-repo',
                branch: 'main',
                filename: 'app.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'my-workspace');
        });

        test('should return empty string when all fallback options are empty', () => {
            const customPattern = '{workspace || repo || branch}';
            const components = {
                workspace: '',
                repo: '',
                branch: '',
                filename: 'app.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, '');
        });

        test('should handle multiple fallback patterns in one title', () => {
            const customPattern = '{workspace || repo} - {branch || filename}';
            const components = {
                workspace: '',
                repo: 'my-repo',
                branch: '',
                filename: 'app.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'my-repo - app.ts');
        });

        test('should handle fallback with spaces around || operator', () => {
            const customPattern = '{workspace  ||  repo  ||  filename}';
            const components = {
                workspace: '',
                repo: '',
                branch: 'main',
                filename: 'app.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'app.ts');
        });

        test('should work with single variables (no fallback)', () => {
            const customPattern = '{filename} - {workspace}';
            const components = {
                workspace: 'my-project',
                repo: 'my-repo',
                branch: 'main',
                filename: 'app.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'app.ts - my-project');
        });        test('should handle complex pattern with fallbacks and regular variables', () => {
            const customPattern = '{workspace || repo} [{branch}] {filename} (last: {timestamp})';
            const components = {
                workspace: '',
                repo: 'awesome-project',
                branch: 'feature/new-stuff',
                filename: 'index.ts',
                timestamp: '15:30'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'awesome-project [feature/new-stuff] index.ts (last: 15:30)');
        });

    });

    suite('Environment Variable Support', () => {
        test('should resolve environment variables with env. prefix', () => {
            // Set a test environment variable
            process.env.TEST_VAR = 'test-value';

            const customPattern = '{env.TEST_VAR}';
            const components = {
                workspace: 'my-project',
                repo: 'my-repo',
                branch: 'main',
                filename: 'app.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'test-value');

            // Clean up
            delete process.env.TEST_VAR;
        });

        test('should return empty string for non-existent environment variable', () => {
            const customPattern = '{env.NONEXISTENT_VAR}';
            const components = {
                workspace: 'my-project',
                repo: 'my-repo',
                branch: 'main',
                filename: 'app.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, '');
        });

        test('should work with USER environment variable', () => {
            // USER should typically be set in most environments
            const customPattern = '{env.USER}@host';
            const components = {
                workspace: 'my-project',
                repo: 'my-repo',
                branch: 'main',
                filename: 'app.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            // Just check it doesn't error and produces something
            assert.strictEqual(typeof result, 'string');
            assert.ok(result.includes('@host'));
        });

        test('should support environment variables in fallback chains', () => {
            process.env.TEST_ENV = 'env-value';

            const customPattern = '{env.MISSING || env.TEST_ENV || workspace}';
            const components = {
                workspace: 'my-project',
                repo: 'my-repo',
                branch: 'main',
                filename: 'app.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'env-value');

            delete process.env.TEST_ENV;
        });

        test('should combine environment variables with other variables', () => {
            process.env.TEST_USER = 'testuser';
            process.env.TEST_HOST = 'testhost';

            const customPattern = '{env.TEST_USER}@{env.TEST_HOST} | {workspace} [{branch}]';
            const components = {
                workspace: 'my-project',
                repo: 'my-repo',
                branch: 'main',
                filename: 'app.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'testuser@testhost | my-project [main]');

            delete process.env.TEST_USER;
            delete process.env.TEST_HOST;
        });

        test('should handle environment variables with special characters', () => {
            process.env.TEST_VAR_WITH_UNDERSCORE = 'value_with_underscore';

            const customPattern = '{env.TEST_VAR_WITH_UNDERSCORE}';
            const components = {
                workspace: 'my-project',
                repo: 'my-repo',
                branch: 'main',
                filename: 'app.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'value_with_underscore');

            delete process.env.TEST_VAR_WITH_UNDERSCORE;
        });

        test('should combine env variables with folder and filename', () => {
            process.env.TEST_USER = 'john';
            process.env.TEST_HOST = 'devbox';

            const customPattern = '{env.TEST_USER}@{env.TEST_HOST} {folder}/{filename}';
            const components = {
                workspace: 'my-project',
                repo: 'my-repo',
                branch: 'main',
                filename: 'index.ts',
                folder: 'src',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'john@devbox src/index.ts');

            delete process.env.TEST_USER;
            delete process.env.TEST_HOST;
        });

        test('should handle env variables in complex patterns', () => {
            process.env.TEST_ENV_USER = 'alice';

            const customPattern = '{env.TEST_ENV_USER} | {workspace} [{branch}] {folder}/{filename}';
            const components = {
                workspace: 'api-service',
                repo: 'backend',
                branch: 'feature/auth',
                filename: 'handler.ts',
                folder: 'controllers',
                timestamp: '14:30'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'alice | api-service [feature/auth] controllers/handler.ts');

            delete process.env.TEST_ENV_USER;
        });

        test('should handle env variable as part of fallback chain', () => {
            process.env.FALLBACK_TEST = 'env-value';

            const customPattern = '{workspace || env.FALLBACK_TEST}';
            const components = {
                workspace: '',
                repo: 'my-repo',
                branch: 'main',
                filename: 'app.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'env-value');

            delete process.env.FALLBACK_TEST;
        });

        test('should prioritize regular variables over env variables in fallback', () => {
            process.env.FALLBACK_TEST2 = 'env-value';

            const customPattern = '{workspace || env.FALLBACK_TEST2}';
            const components = {
                workspace: 'workspace-value',
                repo: 'my-repo',
                branch: 'main',
                filename: 'app.ts',
                timestamp: 'now'
            };

            const result = windowTitleService.composeCustomTitle(customPattern, components);
            assert.strictEqual(result, 'workspace-value');

            delete process.env.FALLBACK_TEST2;
        });
    });

    suite('Timestamp Functionality', () => {
        test('should format timestamp in 24-hour format', () => {
            const testTime = new Date('2024-01-15T14:30:00'); // 2:30 PM
            windowTitleService.setLastModified(testTime);
            
            const result = windowTitleService.getFormattedTimestamp();
            assert.strictEqual(result, '14:30');
        });

        test('should format morning time correctly', () => {
            const morningTime = new Date('2024-01-15T09:05:00'); // 9:05 AM
            windowTitleService.setLastModified(morningTime);
            
            const result = windowTitleService.getFormattedTimestamp();
            assert.strictEqual(result, '09:05');
        });

        test('should format midnight correctly', () => {
            const midnight = new Date('2024-01-15T00:00:00'); // Midnight
            windowTitleService.setLastModified(midnight);
            
            const result = windowTitleService.getFormattedTimestamp();
            assert.strictEqual(result, '00:00');
        });

        test('should format late evening correctly', () => {
            const lateEvening = new Date('2024-01-15T23:45:00'); // 11:45 PM
            windowTitleService.setLastModified(lateEvening);
            
            const result = windowTitleService.getFormattedTimestamp();
            assert.strictEqual(result, '23:45');
        });
    });
});
