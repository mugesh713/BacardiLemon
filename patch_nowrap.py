import re

css = open('src/styles/main.css').read()

# Replace white-space: nowrap; with white-space: normal; text-wrap: balance; for headings
# It's better to just replace `white-space: nowrap;` with `text-wrap: balance;` inside those specific blocks, 
# or just change them to `white-space: normal;`.

# Since I don't know the exact names of all selectors, I can just replace `white-space: nowrap;` globally 
# but specifically target the ones near headings. Let's do a targeted regex or just read lines.

lines = css.split('\n')
for i, line in enumerate(lines):
    if 'white-space: nowrap;' in line:
        # Check context: if it's a heading class
        # Look backwards to find the selector
        for j in range(i, max(-1, i-20), -1):
            if '{' in lines[j] or '}' in lines[j] or j == i:
                selector = lines[j].split('{')[0]
                if '.h1' in selector or '.h2' in selector or '.h3' in selector or '.h-display' in selector or '.hero__title' in selector or '.eyebrow' in selector:
                    lines[i] = line.replace('white-space: nowrap;', 'text-wrap: balance;')
                    break

open('src/styles/main.css', 'w').write('\n'.join(lines))
