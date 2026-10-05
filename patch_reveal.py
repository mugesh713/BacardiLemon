import re

js = open('src/ui/reveal.js').read()

pattern = r"""  text\.split\(' '\)\.forEach\(\(w, i, arr\) => \{
    const outer = document\.createElement\('span'\);
    outer\.className = 'word';
    const inner = document\.createElement\('span'\);
    inner\.textContent = w \+ \(i < arr\.length - 1 \? ' ' : ''\);
    outer\.appendChild\(inner\);
    frag\.appendChild\(outer\);
  \}\);"""

replacement = """  text.split(' ').forEach((w, i, arr) => {
    const outer = document.createElement('span');
    outer.className = 'word';
    const inner = document.createElement('span');
    inner.textContent = w;
    outer.appendChild(inner);
    frag.appendChild(outer);
    if (i < arr.length - 1) {
      frag.appendChild(document.createTextNode(' '));
    }
  });"""

js = re.sub(pattern, replacement, js)

open('src/ui/reveal.js', 'w').write(js)
