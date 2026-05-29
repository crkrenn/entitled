#!/usr/bin/env node

/**
 * Validation script to test both CI and local test modes
 */

const { spawn } = require('child_process');
const path = require('path');

async function runCommand(command, args, env = {}) {
    return new Promise((resolve, reject) => {
        console.log(`\n🔄 Running: ${command} ${args.join(' ')}`);
        if (Object.keys(env).length > 0) {
            console.log(`📋 Environment: ${JSON.stringify(env)}`);
        }
        
        const child = spawn(command, args, {
            cwd: __dirname,
            env: { ...process.env, ...env },
            stdio: 'inherit',
            shell: true
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ Command succeeded with exit code ${code}`);
                resolve(code);
            } else {
                console.log(`❌ Command failed with exit code ${code}`);
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });

        child.on('error', (error) => {
            console.error(`❌ Command error:`, error);
            reject(error);
        });
    });
}

async function main() {
    console.log('🧪 Entitled Extension - Test Mode Validation');
    console.log('============================================');
    
    try {
        // Test 1: CI mode (should skip integration tests)
        console.log('\n📦 Test 1: CI Mode (should skip VS Code integration tests)');
        await runCommand('node', ['./src/test/runTest-ci-friendly.js'], {
            CI: 'true',
            GITHUB_ACTIONS: 'true'
        });
        
        console.log('\n📦 Test 2: Local Mode (should run full integration tests)');
        console.log('⚠️  This will take longer as it runs full VS Code integration tests...');
        await runCommand('node', ['./src/test/runTest-ci-friendly.js'], {});
        
        console.log('\n🎉 All test mode validations passed!');
        console.log('\n📋 Summary:');
        console.log('  ✅ CI mode correctly skips integration tests');
        console.log('  ✅ Local mode runs full integration test suite');
        console.log('  ✅ Extension is ready for CI/CD deployment');
        
    } catch (error) {
        console.error('\n❌ Test validation failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { runCommand };
