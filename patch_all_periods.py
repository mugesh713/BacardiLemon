import re
import glob

def remove_periods(match):
    tag_start = match.group(1)
    content = match.group(2)
    tag_end = match.group(3)
    
    # Replace period + space with just a space
    content = content.replace('. ', ' ')
    # Replace remaining periods with empty string
    content = content.replace('.', '')
    
    return f"{tag_start}{content}{tag_end}"

pattern = r'(<h[1-6][^>]*>)(.*?)(</h[1-6]>)'

for file in glob.glob('*.html'):
    html = open(file).read()
    new_html = re.sub(pattern, remove_periods, html, flags=re.DOTALL)
    
    # Also target span.mono.eyebrow just in case
    new_html = re.sub(r'(<span class="mono eyebrow"[^>]*>)(.*?)(</span>)', remove_periods, new_html, flags=re.DOTALL)
    
    if html != new_html:
        open(file, 'w').write(new_html)

