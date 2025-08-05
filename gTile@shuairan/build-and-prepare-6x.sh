#!/bin/bash

EXT_DIR="/home/capo/Code/github/cinnamon-spices-extensions/gTile@shuairan"
SRC_DIR="$EXT_DIR/src/6_x"

echo "🧱 Starte Build für Cinnamon 6.x..."

cd "$SRC_DIR" || {
  echo "❌ Konnte nicht nach $SRC_DIR wechseln!"
  exit 1
}

npx webpack
BUILD_STATUS=$?

if [ $BUILD_STATUS -ne 0 ]; then
  echo "❌ Build fehlgeschlagen. Abbruch."
  exit 1
fi

echo "✅ Build erfolgreich. Kopiere Dateien ins files-Verzeichnis..."
cd "$EXT_DIR" || exit 1
./prepare-files-dir-6x.sh

