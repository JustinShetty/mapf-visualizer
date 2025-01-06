import { Coordinate } from './Graph';

export enum Orientation {
    NONE,
    X_MINUS,
    X_PLUS,
    Y_MINUS,
    Y_PLUS
}

export function orientationToRotation(o: Orientation): number {
    switch (o) {
        case Orientation.NONE: return 0;
        case Orientation.X_MINUS: return Math.PI;
        case Orientation.X_PLUS: return 0;
        case Orientation.Y_MINUS: return -Math.PI / 2;
        case Orientation.Y_PLUS: return Math.PI / 2;
    }
};

function orientationFromString(s: string): Orientation {
    switch (s) {
        case "X_MINUS": return Orientation.X_MINUS;
        case "X_PLUS": return Orientation.X_PLUS;
        case "Y_MINUS": return Orientation.Y_MINUS;
        case "Y_PLUS": return Orientation.Y_PLUS;
        default: return Orientation.NONE;
    }
}

export class Pose {
    public position: Coordinate = new Coordinate(0, 0);
    public orientation: Orientation = Orientation.NONE;

    constructor(position: Coordinate = new Coordinate(0, 0), orientation: Orientation = Orientation.NONE) {
        this.position = position;
        this.orientation = orientation;
    }
}

export type Config = Pose[];
export type Solution = Config[];

export function parseSolution(text: string): Solution {
    let lines = text.trim().split("\n");
    let solution: Solution = [];

    for (let line of lines) {
        let config: Config = [];

        const pos_re = /(\((\d+),(\d+),?([XY]{1}_[A-Z]{4,5})?\),)/g;
        while (true) {
            let m = pos_re.exec(line);
            if (m === null) break;
            if (m === null || m.length !== 5) throw new Error("Invalid solution");
            let x = Number(m[2]);
            let y = Number(m[3]);
            let o = orientationFromString(m[4]);
            let pose = new Pose(new Coordinate(x, y), o);
            config.push(pose);
        }
        if (config.length === 0) throw new Error("Invalid solution");
        solution.push(config);
    }
    return solution;
}