import re

# Read original index.html
with open('index.html', 'r', encoding='utf-8') as f:
    orig_html = f.read()

# Read the exact flower content
with open(r'c:\tmp\flower\flower.html', 'r', encoding='utf-8') as f:
    flower_html = f.read()

# Extract the flowers div
match = re.search(r'(<div class="flowers">.*?</div>\s*)(?=<!-- Title -->)', flower_html, re.DOTALL)
if not match:
    print("Could not find flowers div in flower.html")
    exit(1)
flowers_div = match.group(1).strip()
flowers_div = flowers_div.replace('class="flowers"', 'class="flowers css-flower-container"')

# Replace in index.html
new_html = re.sub(r'<div class="flowers css-flower-container">.*?<!-- Rumput -->.*?</div>', flowers_div, orig_html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

# Update style.css (Remove old flower CSS, append new ones)
with open('style.css', 'r', encoding='utf-8') as f:
    orig_css = f.read()

# Remove old flower css block
new_css = re.sub(r'/\* Glowing CSS Flowers \(Sesuai Referensi\) \*/.*?(?=/\* Page 4 Teks Falish \*/)', '/* Glowing CSS Flowers (Sesuai Referensi) */\n', orig_css, flags=re.DOTALL)

# Append new styles from downloaded css
with open(r'c:\tmp\flower\style.css', 'r', encoding='utf-8') as f:
    new_flower_css = f.read()

new_css = new_css.replace('/* Glowing CSS Flowers (Sesuai Referensi) */\n', '/* Glowing CSS Flowers */\n' + new_flower_css + '\n')

# Fix body styles from downloaded CSS interfering with my styles
# The original CSS might have html, body { ... } we should remove generic body styles
new_flower_css = re.sub(r'(?m)^body\s*\{.*?(?=\}|^).*?\}', '', new_flower_css, flags=re.DOTALL)
new_flower_css = re.sub(r'(?m)^\*\s*\{.*?(?=\}|^).*?\}', '', new_flower_css, flags=re.DOTALL)

# Re-do append cleanly
new_css = re.sub(r'/\* Glowing CSS Flowers.*/', '/* Glowing CSS Flowers */\n' + new_flower_css + '\n', new_css, flags=re.DOTALL)

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(new_css)

print("Updated perfectly")
