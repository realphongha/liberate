VERSION=$(python3 -c \
'import json;print(json.load(open("manifest.json"))["version"])')

zip -r "liberate-v${VERSION}.zip" \
    manifest.json src icons
