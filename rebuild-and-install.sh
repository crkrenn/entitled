#!/bin/bash

# Script to rebuild and reinstall the Entitled VS Code extension
# Usage: ./rebuild-and-install.sh

set -e  # Exit on any error

echo "🔨 Rebuilding Entitled extension..."
echo ""

# Step 1: Clean previous build
echo "1️⃣  Cleaning previous build..."
npm run clean 2>/dev/null || rm -rf out/

# Step 2: Compile TypeScript
echo "2️⃣  Compiling TypeScript..."
npm run compile

# Step 3: Run tests (optional - comment out if you want to skip)
# echo "3️⃣  Running tests..."
# npm test

# Step 4: Package extension
echo "3️⃣  Packaging extension..."
npm run package

# Step 5: Find the .vsix file
VSIX_FILE=$(ls -t entitled-*.vsix 2>/dev/null | head -n1)

if [ -z "$VSIX_FILE" ]; then
    echo "❌ Error: No .vsix file found!"
    exit 1
fi

echo "4️⃣  Installing $VSIX_FILE..."
code --install-extension "$VSIX_FILE" --force

echo ""
echo "✅ Extension rebuilt and installed successfully!"
echo "📝 Remember to reload VS Code window (Ctrl+Shift+P → 'Reload Window')"
echo ""
echo "Current pattern: \${dirty}{env.USER}@{env.HOSTNAME} \${activeFolderShort}/\${activeEditorShort}"
