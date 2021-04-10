# stone-lang

TypeScript 实现《两周自制脚本语言》书中的 stone 语言。

## stone 语言的语法定义

> BNF 中用到的元字符
> | - | - |
> | - | - |
> | { pat } | 模式 pat 至少重复 0 次 |
> | [ pat ] | 与重复出现 0 次或 1 次的模式 pat 匹配 |
> | pat1 \| pat2 | 与 pat1 或 pat2 匹配 |
> | () | 将括号内视为一个完整的模式 |

```
primary   : "(" expr ")" | NUMBER | IDENTIFIER | STRING
factor    : "-" primary | primary
expr      : factor { OP factor }
block     : "{" [ statement ] {(";" | EOL) [ statement ]} "}"
simple    : expr
statement : "if" expr block [ "else" block ]
          | "while" expr block
          | simple
program   : [ statement ] (";" | EOL)
```

## License

[MIT](https://github.com/SyMind/stone/blob/main/LICENSE)
