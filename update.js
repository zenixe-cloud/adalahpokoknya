const fs = require('fs');

// Read original index.html
let orig_html = fs.readFileSync('index.html', 'utf-8');
const flower_html = fs.readFileSync('c:/tmp/flower/flower.html', 'utf-8');

// Extract the flowers div
const match = flower_html.match(/(<div class="flowers">[\s\S]*?<\/div>\s*)(?=<!-- Title -->)/);
if (!match) {
    console.error("Could not find flowers div in flower.html");
    process.exit(1);
}

let flowers_div = match[1].trim();
flowers_div = flowers_div.replace('class="flowers"', 'class="flowers css-flower-container"');

// Replace in index.html (find our original css-flower-container all the way down to <!-- Rumput --> block end)
// Wait, our block ends at <div class="f-grass grass5"></div>\n        </div>
orig_html = orig_html.replace(/<div class="flowers css-flower-container">[\s\S]*?<!-- Rumput -->[\s\S]*?<\/div>/, flowers_div);

fs.writeFileSync('index.html', orig_html);
console.log("Updated index.html");

// Update style.css (Remove old flower CSS, append new ones)
let orig_css = fs.readFileSync('style.css', 'utf-8');

// Remove old flower CSS
// My old css started at /* Glowing CSS Flowers (Sesuai Referensi) */ and ended right before /* Page 4 Teks Falish */
const old_flower_index = orig_css.indexOf('/* Glowing CSS Flowers (Sesuai Referensi) */');
const next_section_index = orig_css.indexOf('/* Page 4 Teks Falish */');

if (old_flower_index !== -1 && next_section_index !== -1) {
    orig_css = orig_css.substring(0, old_flower_index) + '/* Glowing CSS Flowers */\n' + orig_css.substring(next_section_index);
}

let new_flower_css = fs.readFileSync('c:/tmp/flower/style.css', 'utf-8');
// Clean up generic rules in new_flower_css that might conflict
new_flower_css = new_flower_css.replace(/body\s*\{[\s\S]*?\}/g, '');
new_flower_css = new_flower_css.replace(/^\*\s*\{[\s\S]*?\}/gm, '');
new_flower_css = new_flower_css.replace(/html\s*\{[\s\S]*?\}/g, '');

const injectIndex = orig_css.indexOf('/* Glowing CSS Flowers */') + '/* Glowing CSS Flowers */\n'.length;
orig_css = orig_css.substring(0, injectIndex) + new_flower_css + '\n' + orig_css.substring(injectIndex);

// Ensure `.night` applies well
orig_css += `
.night {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  filter: blur(0.1vmin);
  background-image: radial-gradient(ellipse at top, transparent 0%, var(--dark-color, #050505));
  z-index: -2;
}
.flowers {
  position: relative;
  transform: scale(0.9);
}
`;

fs.writeFileSync('style.css', orig_css);
console.log("Updated style.css");
