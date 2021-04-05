# stone

TypeScript 实现《两周自制脚本语言》书中的 stone 语言。

## 语法

primary   : "(" expr ")" | NUMBER | IDENTIFIER | STRING
factor    : "-" primary | primary
expr      : "{" [ statement ] {(";" | EOL) [statement ]} "}"
block     : "{" [ statement ] {(";" | EOL) [ statement ]} "}"
simple    : expr
statement : "if" expr block [ "else" block ]
          | "while" expr block
          | simple
program   : [ statement ] (";" | EOL)

## License

[MIT](https://github.com/SyMind/stone/blob/main/LICENSE)
