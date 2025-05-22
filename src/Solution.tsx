import { Coordinate } from "./Graph";

export enum AgentState {
    PICKING,
    CARRYING,
    DELIVERED,
    IDLE,
    NONE,
}
export enum Orientation {
    NONE,
    X_MINUS,
    X_PLUS,
    Y_MINUS,
    Y_PLUS,
}

export function orientationToRotation(o: Orientation): number {
    switch (o) {
        case Orientation.NONE:
            return 0;
        case Orientation.X_MINUS:
            return Math.PI;
        case Orientation.X_PLUS:
            return 0;
        case Orientation.Y_MINUS:
            return -Math.PI / 2;
        case Orientation.Y_PLUS:
            return Math.PI / 2;
    }
}

function orientationFromString(s: string): Orientation {
    switch (s) {
        case "X_MINUS":
            return Orientation.X_MINUS;
        case "X_PLUS":
            return Orientation.X_PLUS;
        case "Y_MINUS":
            return Orientation.Y_MINUS;
        case "Y_PLUS":
            return Orientation.Y_PLUS;
        default:
            return Orientation.NONE;
    }
}

export class Pose {
    public position: Coordinate = new Coordinate(0, 0);
    public orientation: Orientation = Orientation.NONE;
    public state: AgentState = AgentState.NONE;

    constructor(
        position: Coordinate = new Coordinate(0, 0),
        orientation: Orientation = Orientation.NONE,
        state: AgentState = AgentState.NONE
    ) {
        this.position = position;
        this.orientation = orientation;
        this.state = state;
    }
}

export type Config = Pose[];
export type Solution = Config[];

export function parseSolution(text: string): Solution {
    const lines = text.trim().split("\n");
    const solution: Solution = [];

    const regex =
        /\((\d+),(\d+)(?:,([XY]_[A-Z]{4,5}))?(?:,(PICKING|CARRYING|DELIVERED|IDLE|NONE))?\)/g;

    for (const line of lines) {
        const config: Config = [];

        for (const match of line.matchAll(regex)) {
            const x = parseInt(match[1], 10);
            const y = parseInt(match[2], 10);
            const o = orientationFromString(match[3] || ""); // may be undefined
            const stateStr = match[4] || "NONE";

            console.log(stateStr);

            if (x < 0 || y < 0) {
                throw new Error(`Invalid position: (${x}, ${y})`);
            }

            const coordinate = new Coordinate(x, y);
            const agentState = AgentState[stateStr as keyof typeof AgentState];

            config.push(new Pose(coordinate, o, agentState));
        }

        if (config.length === 0) {
            throw new Error("Invalid solution: no poses found");
        }
        solution.push(config);
    }

    console.log("Parsed solution:", solution);
    return solution;
}
