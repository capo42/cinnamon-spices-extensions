#!/bin/bash

set -e

EXT_DIR="/home/capo/Code/github/cinnamon-spices-extensions/gTile@shuairan"
SRC_OLD_54="$EXT_DIR/src/5_4"
SRC_NEW_6X="$EXT_DIR/src/6_x"
FILES_DIR="$EXT_DIR/../../files/gTile@shuairan"
METADATA="$FILES_DIR/metadata.json"

echo "🚀 Migration gTile@shuairan → Cinnamon 6.x beginnt..."

# Schritt 1: src/5_4 → src/6_x kopieren
echo "📁 Kopiere $SRC_OLD_54 → $SRC_NEW_6X..."
rm -rf "$SRC_NEW_6X"
cp -r "$SRC_OLD_54" "$SRC_NEW_6X"

# Schritt 2: tsconfig.json anpassen
TSCONFIG="$SRC_NEW_6X/tsconfig.json"
echo "🛠️ Schreibe tsconfig.json für src/6_x..."
cat > "$TSCONFIG" <<EOF
{
  "extends": "../../tsconfig.json",
  "include": [
    "./**/*",
    "../base/**/*"
  ],
  "compilerOptions": {
    "outDir": "./",
    "skipLibCheck": true,
    "noEmitOnError": false
  }
}
EOF

# Schritt 3: webpack.config.js kopieren und anpassen
WEBPACK_CONFIG_SRC="$SRC_OLD_54/webpack.config.js"
WEBPACK_CONFIG_NEW="$SRC_NEW_6X/webpack.config.js"

if [ ! -f "$WEBPACK_CONFIG_SRC" ]; then
  echo "❌ Konnte webpack.config.js in $SRC_OLD_54 nicht finden – Abbruch."
  exit 1
fi

echo "🔧 Kopiere und passe webpack.config.js an..."
cp "$WEBPACK_CONFIG_SRC" "$WEBPACK_CONFIG_NEW"
sed -i 's|src/5_4|src/6_x|g' "$WEBPACK_CONFIG_NEW"

# Schritt 4: metadata.json anpassen
if [ -f "$METADATA" ]; then
  echo "📦 Aktualisiere $METADATA..."
  sed -i 's|"cinnamon-version": \[[^]]*\]|"cinnamon-version": ["6.0", "6.2", "6.4", "6.8"]|' "$METADATA"
else
  echo "⚠️  metadata.json nicht gefunden unter $METADATA – bitte manuell prüfen."
fi

echo "🧹 Du kannst nun src/3_8 und src/5_4 manuell löschen, wenn du sicher bist."
echo "🏗️  Baue das Projekt mit: npx webpack --config src/6_x/webpack.config.js"
echo "✅ Fertig!"

