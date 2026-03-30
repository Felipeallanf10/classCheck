"""
Test harness for the kata-style solution.

The hidden function `raises_once()` raises an exception on first call
and returns a magic value on second call. The solution must:
  - be a single line (no actual newlines in source)
  - not contain: def, lambda, return, ;, class, import, eval
  - not contain more than one '=' sign
  - call raises_once() twice, silence the first exception, assign
    the returned magic value to the variable `magic`
"""
import unittest

# ---------- hidden function definition ----------
_state = {"calls": 0, "value": 42}


def raises_once():
    _state["calls"] += 1
    if _state["calls"] == 1:
        raise ValueError("First call raises an exception!")
    return _state["value"]


# ---------- load solution source ----------
with open("solution.py", "r") as _f:
    _source = _f.read()

# ---------- execute solution ----------
_ns = {"raises_once": raises_once, "__builtins__": __builtins__}
exec(_source, _ns)

# ---------- restriction constants ----------
# Kata enforces "one line" only; 58 chars gives headroom above the 53-char
# solution while keeping typical kata character-limit expectations.
MAX_LENGTH = 58
FORBIDDEN = ["def", "lambda", "return", ";", "class", "import", "eval"]


class TestRestrictions(unittest.TestCase):
    def test_single_line(self):
        stripped = _source.strip()
        self.assertFalse(
            "\n" in stripped,
            "Solution must be a single line (no newlines allowed).",
        )

    def test_length(self):
        stripped = _source.strip()
        self.assertLessEqual(
            len(stripped),
            MAX_LENGTH,
            f"Too long! Solution is {len(stripped)} chars; limit is {MAX_LENGTH}.",
        )

    def test_no_def(self):
        self.assertNotIn("def", _source.lower(), "Must not contain 'def'.")

    def test_no_lambda(self):
        self.assertNotIn("lambda", _source.lower(), "Must not contain 'lambda'.")

    def test_no_return(self):
        self.assertNotIn("return", _source.lower(), "Must not contain 'return'.")

    def test_no_semicolon(self):
        self.assertNotIn(";", _source, "Must not contain ';'.")

    def test_no_class(self):
        self.assertNotIn("class", _source.lower(), "Must not contain 'class'.")

    def test_no_import(self):
        self.assertNotIn("import", _source.lower(), "Must not contain 'import'.")

    def test_no_eval(self):
        self.assertNotIn("eval", _source.lower(), "Must not contain 'eval'.")

    def test_single_equals(self):
        self.assertLessEqual(
            _source.count("="),
            1,
            "Must not contain more than one '=' sign.",
        )


class TestLogic(unittest.TestCase):
    def test_raises_once_called_twice(self):
        self.assertEqual(
            _state["calls"],
            2,
            "'raises_once' must be called exactly twice.",
        )

    def test_magic_has_correct_value(self):
        self.assertIn("magic", _ns, "'magic' variable must be defined.")
        self.assertEqual(
            _ns["magic"],
            _state["value"],
            "'magic' must equal the value returned by raises_once().",
        )


if __name__ == "__main__":
    unittest.main(verbosity=2)
