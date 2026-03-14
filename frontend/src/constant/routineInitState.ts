export interface RoutineInitState {
    routineId: string;
    userId: string;
    routineName: string;
    targetTimeHour: number;
    targetTimeMin: number;
    routine: string[];
    routineTime: number[];
    createdAt: string,
    updatedAt: string
}

const routineInitState: RoutineInitState = {
    routineId: crypto.randomUUID(),
    userId: localStorage.getItem("userId") ?? "",
    routineName: "",
    targetTimeHour: 0,
    targetTimeMin: 0,
    routine: [""],
    routineTime: [10],
    createdAt: "",
    updatedAt: ""
}

export default routineInitState
