_count = 0
MAGIC = 42

def raises_once():
    global _count
    _count += 1
    if _count == 1:
        raise Exception("first call")
    return MAGIC

try:
    with open("solution.py") as _f:
        _code = _f.read().strip()
except FileNotFoundError:
    raise SystemExit("solution.py not found. Please create the solution file.")

assert len(_code) <= 60, f"Restrictions -> Length: {len(_code)} chars (max 60)"
for _w in ("def", "lambda", "return", ";", "class", "import", "eval"):
    assert _w not in _code.lower(), f"Restrictions -> Forbidden: '{_w}'"
assert _code.count("=") <= 1, "Restrictions -> Maximum one = character allowed"

_ns = {'raises_once': raises_once}
exec(_code, _ns)
assert "magic" in _ns, "Solution must define variable 'magic'"
magic = _ns["magic"]
assert magic == MAGIC, f"Expected magic={MAGIC}, got magic={magic}"
print("All tests passed!")
