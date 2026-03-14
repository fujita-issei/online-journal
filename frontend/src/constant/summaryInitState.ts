export interface SleepSummary {
    aveGetUpHour: number;
    aveGetUpMin: number;
    earlyGetUpHour: number;
    earlyGetUpMin: number;
    lateGetUpHour: number;
    lateGetUpMin: number;
    aveGoBedHour: number;
    aveGoBedMin: number;
    earlyGoBedHour: number;
    earlyGoBedMin: number;
    lateGoBedHour: number;
    lateGoBedMin: number;
}

export interface RoutineSummary {
    routineDone: number;
    routineAll: number;
    achievementHighest: string;
    achievementLowest: string;
}

export interface ListSummary {
    listDone: number;
    listAll: number;
    achievementHighest: string;
    achievementLowest: string;
}

export interface ToDoSummary {
    sumToDoHour: number;
    sumToDoMin: number;
    aveToDoHour: number;
    aveToDoMin: number;
    long1stDate: string;
    long1stHour: number;
    long1stMin: number;
    long2ndDate: string;
    long2ndHour: number;
    long2ndMin: number;
    long3rdDate: string;
    long3rdHour: number;
    long3rdMin: number;
    short1stDate: string;
    short1stHour: number;
    short1stMin: number;
    short2ndDate: string;
    short2ndHour: number;
    short2ndMin: number;
    short3rdDate: string;
    short3rdHour: number;
    short3rdMin: number;
    toDoDone: number;
    toDoAll: number;
    achieveGoalTime: number;
}

export interface JournalSummary {
    sumJournalCount: number;
    aveJournalCount: number;
    long1stDate: string;
    long1stCount: number;
    long2ndDate: string;
    long2ndCount: number;
    long3rdDate: string;
    long3rdCount: number;
    short1stDate: string;
    short1stCount: number;
    short2ndDate: string;
    short2ndCount: number;
    short3rdDate: string;
    short3rdCount: number;
}

export interface MoneySummary {
    aveInvestment: number;
    aveWaste: number;
    aveConsumption: number;
    maxInvestment: number;
    maxWaste: number;
    maxConsumption: number;
    minInvestment: number;
    minWaste: number;
    minConsumption: number;
    sumInvestment: number;
    sumWaste: number;
    sumConsumption: number;
    sumUseMoney: number;
}

export interface SummaryInitState {
    streak: number;
    streakStartDay: string;
    sleepNumberOfDay: number;
    sleepSummary: SleepSummary;
    routineNumberOfDay: number;
    routineSummary: RoutineSummary;
    listNumberOfDay: number;
    listSummary: ListSummary;
    toDoNumberOfDay: number;
    toDoSummary: ToDoSummary;
    journalNumberOfDay: number;
    journalSummary: JournalSummary;
    moneyNumberOfDay: number;
    moneySummary: MoneySummary;
}

const summaryInitState: SummaryInitState = {
    streak: 0,
    streakStartDay: "",
    sleepNumberOfDay: 3,
    sleepSummary: {
        aveGetUpHour: 0,
        aveGetUpMin: 0,
        earlyGetUpHour: 0,
        earlyGetUpMin: 0,
        lateGetUpHour: 0,
        lateGetUpMin: 0,
        aveGoBedHour: 0,
        aveGoBedMin: 0,
        earlyGoBedHour: 0,
        earlyGoBedMin: 0,
        lateGoBedHour: 0,
        lateGoBedMin: 0
    },
    routineNumberOfDay: 3,
    routineSummary: {
        routineDone: 0,
        routineAll: 0,
        achievementHighest: "",
        achievementLowest: ""
    },
    listNumberOfDay: 3,
    listSummary: {
        listDone: 0,
        listAll: 0,
        achievementHighest: "",
        achievementLowest: ""
    },
    toDoNumberOfDay: 3,
    toDoSummary: {
        sumToDoHour: 0,
        sumToDoMin: 0,
        aveToDoHour: 0,
        aveToDoMin: 0,
        long1stDate: "",
        long1stHour: 0,
        long1stMin: 0,
        long2ndDate: "",
        long2ndHour: 0,
        long2ndMin: 0,
        long3rdDate: "",
        long3rdHour: 0,
        long3rdMin: 0,
        short1stDate: "",
        short1stHour: 0,
        short1stMin: 0,
        short2ndDate: "",
        short2ndHour: 0,
        short2ndMin: 0,
        short3rdDate: "",
        short3rdHour: 0,
        short3rdMin: 0,
        toDoDone: 0,
        toDoAll: 0,
        achieveGoalTime: 0
    },
    journalNumberOfDay: 3,
    journalSummary: {
        sumJournalCount: 0,
        aveJournalCount: 0,
        long1stDate: "",
        long1stCount: 0,
        long2ndDate: "",
        long2ndCount: 0,
        long3rdDate: "",
        long3rdCount: 0,
        short1stDate: "",
        short1stCount: 0,
        short2ndDate: "",
        short2ndCount: 0,
        short3rdDate: "",
        short3rdCount: 0
    },
    moneyNumberOfDay: 3,
    moneySummary: {
        aveInvestment: 0,
        aveWaste: 0,
        aveConsumption: 0,
        maxInvestment: 0,
        maxWaste: 0,
        maxConsumption: 0,
        minInvestment: 0,
        minWaste: 0,
        minConsumption: 0,
        sumInvestment: 0,
        sumWaste: 0,
        sumConsumption: 0,
        sumUseMoney: 0
    }
}

export default summaryInitState