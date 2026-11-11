# Code style 

- "  " offset, not tabs no "    "
- always {}, e.g.
```
if (...) {

}
else {

}
```
- No glueing multiple line sinto a single one, makes it harder to read for me
- No comments, self documenting code only, no hacky variable names
- No code encapsulation, everything is public. For C/C++ it means struct everywhere, no class keyword
- No relative imports
- Newline after a template header, e.g.
```
template <typename T>
struct Box {

};
```
