#!/bin/bash
set -e

EXT_DIR="/home/capo/Code/github/cinnamon-spices-extensions/gTile@shuairan"
SRC_BUILD="$EXT_DIR/src/6_x"
FILES_DIR="$EXT_DIR/../../files/gTile@shuairan"
TARGET_VER="6.x"
FILES_TARGET="$FILES_DIR/$TARGET_VER"

echo "📁 Erstelle Zielordner $FILES_TARGET..."
mkdir -p "$FILES_TARGET"

echo "📋 Kopiere extension.js & gTile.js..."
cp "$SRC_BUILD/extension.js" "$FILES_TARGET/extension.js"
cp "$SRC_BUILD/gTile.js" "$FILES_TARGET/gTile.js"

echo "🎛️ Kopiere settings-schema.json & stylesheet.css..."
cp "$FILES_DIR/settings-schema.json" "$FILES_TARGET/settings-schema.json"
cp "$FILES_DIR/stylesheet.css" "$FILES_TARGET/stylesheet.css"

echo "🪪 Setze metadata.json auf Import '6.x'..."
sed -i 's|"import": *".*"|"import": "6.x"|' "$FILES_DIR/metadata.json"

echo "📤 Kopiere extension.js ins Root, damit Cinnamon es findet..."
cp "$SRC_BUILD/extension.js" "$FILES_DIR/extension.js"

echo "✅ Alles bereit für Cinnamon 6.x!"

