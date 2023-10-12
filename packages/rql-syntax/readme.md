# Reference Query Language

Reference Query Language (RQL) is a human friendly language for fetching and annotating reference text. It is designed to mimic normal writing and avoids the complex structure found in most query and programming languages. It was originally designed for Bible study in the Obsidian plugin: Obsedian Reference Text, but it can be used to markup a variety of text sources. RQL is composed of reference and transformation statements. The reference statment selects a text range from a source and transformation statements tranform the text. 

# Examples
The quickest way to get familiar with RQL is through example. Note: RQL is just a query language, most of the functionality is provided by reference and transformation plugins. These examples may not work in all environments.

### Underline phrase reference text 

```rql
John 3:16 ["so loved the world" & underline]
```

> "16. For God <span style="text-decoration:underline">so loved the world</span> that He gave His one and only Son, that everyone who believes in Him shall not perish but have eternal life." - John 3:16

### Underline and highlight reference text

```rql
John 3:16 
["so loved the world" & underline]
["god", "son" & highlight]
["have eternal life" & highlight green]
```
> "16. For <mark>God</mark> <span style="text-decoration:underline">so loved the world</span> that He gave His one and only <mark>Son</mark>, that everyone who believes in Him shall not perish but <mark style="background-color:green; color: white">have eternal life</mark>." - John 3:16

### Side-by-side comparison
```rql
all-bibles John KJV, NIV 3:16
```
John KVJ 3:16|John NIV 3:16
---|---
"16. For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." | "16. For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."

### Side-by-side references
```rql
Psalm 22:18 ["divide my clothes among them" & highlight] 
& 
John 19:23 ["dividing them into four shares" & highlight] 
```
Psalm 22:18 | John 19:23
---|---
"18. They <mark>divide my clothes among them</mark> and cast lots for my garment."|"23. When the soldiers crucified Jesus, they took his clothes, <mark>dividing them into four shares</mark>, one for each of them, with the undergarment remaining. This garment was seamless, woven in one piece from top to bottom."

### Set default tag

`"Bible.com" #book (#?) ()`

### Deep default tag

`Bible #book (#?) ? #edition:Niv`

# Syntax
The primary syntactical elements are:
- References
- Values
    - Symbols
    - Text
    - Range
    - Span
- Tags
- Transforms
- Aliases
