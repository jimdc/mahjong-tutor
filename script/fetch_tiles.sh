#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="$ROOT_DIR/public/tiles"

mkdir -p "$DEST"

FILES=(
  MJ1bing.svg MJ2bing.svg MJ3bing.svg MJ4bing.svg MJ5bing.svg MJ6bing.svg MJ7bing.svg MJ8bing.svg MJ9bing.svg
  MJ1tiao.svg MJ2tiao.svg MJ3tiao.svg MJ4tiao.svg MJ5tiao.svg MJ6tiao.svg MJ7tiao.svg MJ8tiao.svg MJ9tiao.svg
  MJ1wan.svg MJ2wan.svg MJ3wan.svg MJ4wan.svg MJ5wan.svg MJ6wan.svg MJ7wan.svg MJ8wan.svg MJ9wan.svg
  MJEastwind.svg MJSouthwind.svg MJWestwind.svg MJNorthwind.svg
  MJReddragon.svg MJGreendragon.svg MJbaida.svg
)

for file in "${FILES[@]}"; do
  url="https://commons.wikimedia.org/wiki/Special:FilePath/${file}"
  echo "Downloading ${file}"
  curl -L -o "$DEST/$file" "$url"
done

echo "Done. SVG tiles saved to $DEST"
