import lineReader from 'line-reader';

const createReader = (file: string): Promise<any> =>
    new Promise((resolve, reject) => {
        lineReader.open(file, (err, reader) => {
            if (err) {
                reject(err)
            } else {
                resolve(reader)
            }
        })
    })

const nextLine = (reader: any): Promise<string> =>
    new Promise((resolve, reject) => {
        reader.nextLine((err, line) => {
            if (err) {
                reject(err)
            } else {
                resolve(line)
            }
        })
    })

const closeReader = (reader: any): Promise<void> =>
    new Promise((resolve, reject) => {
        reader.close(err => {
            if (err)
                reject(err)
            else
                resolve()
        })
        
    })

export class LineReader {
    private readonly file: string
    private reader: any
    private lineNumber: number = -1

    constructor(file: string) {
        this.file = file
    }

    getLineNumber(): number {
        return this.lineNumber
    }

    async nextLine(): Promise<string> {
        if (!this.reader) {
            this.reader = await createReader(this.file)
        }

        if (!this.reader.hasNextLine()) {
            await closeReader(this.reader)
            return null
        }

        ++this.lineNumber
        return await nextLine(this.reader)
    }
}
