import os
import re

ROOT = r"c:\Users\Ibadov\Documents\E-commerce-BakuCode-Ibadov"


def strip_css_js_comments(text, lang):
    result = []
    i = 0
    string_delim = None
    escaping = False

    while i < len(text):
        ch = text[i]
        nxt = text[i + 1] if i + 1 < len(text) else ""

        if string_delim:
            result.append(ch)
            if escaping:
                escaping = False
            elif ch == "\\":
                escaping = True
            elif ch == string_delim:
                string_delim = None
            i += 1
            continue

        if ch in ('"', "'", "`"):
            string_delim = ch
            result.append(ch)
            i += 1
            continue

        if lang in ("js", "css") and ch == "/" and nxt == "*":
            i += 2
            while i + 1 < len(text) and not (text[i] == "*" and text[i + 1] == "/"):
                i += 1
            if i + 1 < len(text):
                i += 2
            continue

        if lang == "js" and ch == "/" and nxt == "/":
            i += 2
            while i < len(text) and text[i] != "\n":
                i += 1
            continue

        result.append(ch)
        i += 1

    return "".join(result)


def strip_html_comments(text):
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    pattern = re.compile(r"(?is)<(script|style)\b([^>]*)>(.*?)</\1>")

    def replace(match):
        tag = match.group(1).lower()
        attrs = match.group(2)
        inner = match.group(3)
        cleaned = strip_css_js_comments(inner, "js" if tag == "script" else "css")
        return f"<{tag}{attrs}>{cleaned}</{tag}>"

    return pattern.sub(replace, text)


def process_file(path):
    lower = path.lower()
    if lower.endswith(".py"):
        return False

    with open(path, "r", encoding="utf-8", errors="surrogateescape") as f:
        content = f.read()

    if lower.endswith(".html"):
        cleaned = strip_html_comments(content)
    elif lower.endswith(".js"):
        cleaned = strip_css_js_comments(content, "js")
    elif lower.endswith(".css"):
        cleaned = strip_css_js_comments(content, "css")
    else:
        return False

    if cleaned != content:
        with open(path, "w", encoding="utf-8", errors="surrogateescape") as f:
            f.write(cleaned)
        return True
    return False


updated = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in (".git", "__pycache__")]
    for filename in filenames:
        path = os.path.join(dirpath, filename)
        if process_file(path):
            updated.append(os.path.relpath(path, ROOT))

print("UPDATED:")
for item in updated:
    print(item)
print(f"Total files updated: {len(updated)}")
