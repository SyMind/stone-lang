const l = require('../lib/lexer')

exports.ContentsLineReader = class ContentsLineReader {
    constructor(contents) {
        this.lines = contents.split(l.Token.EOL)
        this.lineNumber = -1
    }

    getLineNumber() {
        return this.lineNumber
    }

    async nextLine() {
        if (this.lineNumber >= this.lines.length) {
            return l.Token.EOF
        }

        ++this.lineNumber
        return this.lines[this.lineNumber]
    }
}
