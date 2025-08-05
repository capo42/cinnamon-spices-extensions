#!/bin/bash

# Projektverzeichnis – dort wo das Skript liegt
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🧹 Bereinige Projektordner: $DIR"

# Liste der zu entfernenden Verzeichnisse und Dateien
CLEAN_TARGETS=(
  "$DIR/node_modules"
  "$DIR/.bin"
  "$DIR/package-lock.json"
)

# Durchgehen und entfernen
for target in "${CLEAN_TARGETS[@]}"; do
  if [ -e "$target" ]; then
    echo "🗑️  Entferne: $target"
    rm -rf "$target"
  else
    echo "✅ Kein Eintrag: $target (übersprungen)"
  fi
done

echo "🎉 Aufräumen abgeschlossen!"

