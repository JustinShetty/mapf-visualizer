export class Coordinate {
    public x: number = 0;
    public y: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}

export class Graph {
    public width: number = 0;
    public height: number = 0;
    public obstacles: Map<string, boolean> = new Map();

    constructor(fileContent: string) {
        this.parseGraph(fileContent);
    }

    private parseGraph(fileContent: string) {
        const lines = fileContent.trim().split("\n");
        if (lines.length < 4) {
            throw new Error("Invalid map file");
        }
        const height = Number(lines[1].split(" ")[1]);
        if (height !== lines.length - 4) {
            throw new Error("Invalid map file, check height");
        }
        this.height = height;
        const width = Number(lines[2].split(" ")[1]);
        this.width = width;
        const graph = lines.slice(4);
        for (let y = 0; y < graph.length; y++) {
            if (graph[y].length !== width) {
                throw new Error("Invalid map file, check width");
            }
            for (let x = 0; x < this.width; x++) {
                if (graph[y][x] !== ".") {
                    this.obstacles.set(new Coordinate(x, y).toString(), true);
                }
            }
        }
    }
}
