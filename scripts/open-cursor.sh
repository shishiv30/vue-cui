#!/bin/bash
file="$1"
if [[ "$file" != /* ]]; then
	file="$(pwd)/$file"
fi
exec /Applications/Cursor.app/Contents/Resources/app/bin/cursor -r -g "${file}:1:1"
