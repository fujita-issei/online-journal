import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import WatchPastJournal from './WatchPastJournal';
import * as ReduxHooks from '../hooks/ReduxHooks';
import type { DailyJournalInitState } from '../constant/dailyJournalInitState';
import type { WeekJournalInitState } from '../constant/weekJournalInitState';
import type { MonthJournalInitState } from '../constant/monthJournalInitState';
import type { YearJournalInitState } from '../constant/yearJournalInitState';

vi.mock('axios');
vi.mock('../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe("WatchPastJournalのテスト", () => {
    const mockDispatch = vi.fn()
    const targetMonths = [
        { month: '03', days: 31 },
        { month: '04', days: 30 },
        { month: '05', days: 31 }
    ]
    const mockDailyData = targetMonths.flatMap(({ month, days }) => 
        Array.from({ length: days }).map((_, i) => {
            const day = String(i + 1).padStart(2, '0'); 
            return {
                targetDate: `2026-${month}-${day}`,
                getUpHour: 7, getUpMin: 30, goBedHour: 23, goBedMin: 0,
                routine: [], routineCheck: [],
                toDoTimeHour: 0, toDoTimeMin: 0, startToDoHour: 0, startToDoMin: 0, endToDoHour: 0, endToDoMin: 0,
                toDoTimeCheck: [], toDoList: [], toDoListCheck: [], toDoListImportant: [],
                importList: [], importListCheck: [], addList: [], addListCheck: [],
                journal: [], journalCount: [], journalLastEditTime: [],
                moneyInvestment: 0, moneyWaste: 0, moneyConsumption: 0, moneyUseSum: 0
            };
        })
    ) as unknown as DailyJournalInitState[];

    const targetWeekMonths = [
        { month: '03', days: 25 },
        { month: '04', days: 24 },
        { month: '05', days: 25 }
    ]
    const mockWeekData = targetWeekMonths.flatMap(({ month, days }) => 
        Array.from({ length: days }).map((_, i) => {
            const startDay = String(i + 1).padStart(2, '0'); 
            const endDay = String(i + 7).padStart(2, '0'); 
            return {
                startDate: `2026-${month}-${startDay}`,
                endDate: `2026-${month}-${endDay}`,
                toDo: [], toDoCheck: [], toDoImportant: [],
                    journal: [], journalCount: [], journalLastEditTime: [],
                    summary: {
                        getUpHour : 0,
                        getUpMin: 0,
                        goBedHour: 0,
                        goBedMin: 0,
                        sumSleepHour: 0,
                        sumSleepMin: 0,
                        toDoTimeHour: 0,
                        toDoTimeMin: 0,
                        routineDone: 0,
                        routineAll: 0,
                        toDoDone: 0,
                        toDoAll: 0,
                        NGDone: 0,
                        NGAll: 0, 
                        journalAllCount: 0,
                        moneyInvestment: 0,
                        moneyWaste: 0,
                        moneyConsumption: 0,
                        moneyUseSum: 0
                    }
            }
        }
    )) as unknown as WeekJournalInitState[]

    const targetYears = [
        { year: '2024', month: 12 },
        { year: '2025', month: 12 },
        { year: '2026', month: 12 }
    ]
    const mockMonthData = targetYears.flatMap(({ year, month }) => 
        Array.from({ length: month }).map((_, i) => {
            const monthData = String(i + 1).padStart(2, '0')
            return {
                targetDate: `${year}-${monthData}`,
                toDo: [], toDoCheck: [], toDoImportant: [],
                    journal: [], journalCount: [], journalLastEditTime: [],
                    summary: {
                        getUpHour : 0,
                        getUpMin: 0,
                        goBedHour: 0,
                        goBedMin: 0,
                        sumSleepHour: 0,
                        sumSleepMin: 0,
                        toDoTimeHour: 0,
                        toDoTimeMin: 0,
                        routineDone: 0,
                        routineAll: 0,
                        toDoDone: 0,
                        toDoAll: 0,
                        NGDone: 0,
                        NGAll: 0, 
                        journalAllCount: 0,
                        moneyInvestment: 0,
                        moneyWaste: 0,
                        moneyConsumption: 0,
                        moneyUseSum: 0
                    }
            }}
        )) as unknown as MonthJournalInitState[]
    const mockYearData = Array.from({ length: 32 }).map((_, i) => ({
                targetDate: `${2000 + i}`,
                toDo: [], toDoCheck: [], toDoImportant: [],
                    journal: [], journalCount: [], journalLastEditTime: [],
                    summary: {
                        getUpHour : 0,
                        getUpMin: 0,
                        goBedHour: 0,
                        goBedMin: 0,
                        sumSleepHour: 0,
                        sumSleepMin: 0,
                        toDoTimeHour: 0,
                        toDoTimeMin: 0,
                        routineDone: 0,
                        routineAll: 0,
                        toDoDone: 0,
                        toDoAll: 0,
                        NGDone: 0,
                        NGAll: 0, 
                        journalAllCount: 0,
                        moneyInvestment: 0,
                        moneyWaste: 0,
                        moneyConsumption: 0,
                        moneyUseSum: 0
                    }
            })) as unknown as YearJournalInitState[]
    
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(Storage.prototype, "setItem")
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
                watchPastJournal: {
                    selected: "日別",
                    upOrDown: "降順",
                    dateInput: "",
                    monthInput: "",
                    yearInput: "",
                    page: 0,
                    journal: []
                }
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })
        vi.spyOn(ReduxHooks, "useAppDispatch").mockReturnValue(mockDispatch)
        vi.mocked(axios.get).mockImplementation(async (url) => {
            if (url.includes("/watchPastJournal/getDailyJournal")) {
                return { data: mockDailyData }
            }
            if (url.includes("/watchPastJournal/getWeekJournal")) {
                return { data: mockWeekData }
            }
            if (url.includes("/watchPastJournal/getMonthJournal")) {
                return { data: mockMonthData }
            }
            if (url.includes("/watchPastJournal/getYearJournal")) {
                return { data: mockYearData }
            }
        })
    })

    it("日別が選択 : レンダリング => getメソッド走る => dispatchがよばれる", async () => {
        render(<WatchPastJournal/>)
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/watchPastJournal/getDailyJournal", {
                params: {
                    userId: "testUser",
                    upOrDown: "降順",
                    date: "",
                    month: "",
                    year: "",
                }
            })
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "watchPastJournal/setJournal",
                    payload: mockDailyData.filter((_, i) => i < 20)
                })
            )
        })
    })

    it("週別が選択 : レンダリング => getメソッド走る => dispatchがよばれる", async () => {
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
                watchPastJournal: {
                    selected: "週別",
                    upOrDown: "降順",
                    dateInput: "",
                    monthInput: "",
                    yearInput: "",
                    page: 0,
                    journal: []
                }
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })
        render(<WatchPastJournal/>)
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/watchPastJournal/getWeekJournal", {
                params: {
                    userId: "testUser",
                    upOrDown: "降順",
                    date: "",
                    month: "",
                    year: "",
                }
            })
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "watchPastJournal/setJournal",
                    payload: mockWeekData.filter((_, i) => i < 20)
                })
            )
        })
    })

    it("月別が選択 : レンダリング => getメソッド走る => dispatchがよばれる", async () => {
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
                watchPastJournal: {
                    selected: "月別",
                    upOrDown: "降順",
                    dateInput: "",
                    monthInput: "",
                    yearInput: "",
                    page: 0,
                    journal: []
                }
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })
        render(<WatchPastJournal/>)
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/watchPastJournal/getMonthJournal", {
                params: {
                    userId: "testUser",
                    upOrDown: "降順",
                    month: "",
                    year: "",
                }
            })
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "watchPastJournal/setJournal",
                    payload: mockMonthData.filter((_, i) => i < 20)
                })
            )
        })
    })

    it("年別が選択 : レンダリング => getメソッド走る => dispatchがよばれる", async () => {
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
                watchPastJournal: {
                    selected: "年別",
                    upOrDown: "降順",
                    dateInput: "",
                    monthInput: "",
                    yearInput: "",
                    page: 0,
                    journal: []
                }
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })
        render(<WatchPastJournal/>)
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled()
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "watchPastJournal/setJournal",
                    payload: mockYearData.filter((_, i) => i < 20)
                })
            )
        })
    })

    it("それぞれの入力欄を変更 => dispatch走る", async () => {
        render(<WatchPastJournal/>)
        fireEvent.click(screen.getByTestId("radio-週別"))
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "watchPastJournal/setPage",
                payload: 0
            })
        )
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "watchPastJournal/setSelected",
                payload: "週別"
            })
        )
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "watchPastJournal/setJournal",
                payload: []
            })
        )
        fireEvent.change(screen.getByTestId("input-year"), { target: { value: "2025"} })
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "watchPastJournal/setPage",
                payload: 0
            })
        )
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "watchPastJournal/setYearInput",
                payload: "2025"
            })
        )
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "watchPastJournal/setJournal",
                payload: []
            })
        )
        fireEvent.change(screen.getByTestId("input-month"), { target: { value: "4"} })
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "watchPastJournal/setPage",
                payload: 0
            })
        )
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "watchPastJournal/setMonthInput",
                payload: "4"
            })
        )
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "watchPastJournal/setJournal",
                payload: []
            })
        )
        fireEvent.change(screen.getByTestId("input-date"), { target: { value: "4"} })
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "watchPastJournal/setPage",
                payload: 0
            })
        )
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "watchPastJournal/setDateInput",
                payload: "4"
            })
        )
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "watchPastJournal/setJournal",
                payload: []
            })
        )
        fireEvent.click(screen.getByTestId("radio-昇順"))
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "watchPastJournal/setPage",
                payload: 0
            })
        )
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "watchPastJournal/setUpOrDown",
                payload: "昇順"
            })
        )
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "watchPastJournal/setJournal",
                payload: []
            })
        )
    })

    it("ページ操作の挙動が正しく動く", async () => {
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
                watchPastJournal: {
                    selected: "日別",
                    upOrDown: "降順",
                    dateInput: "",
                    monthInput: "",
                    yearInput: "",
                    page: 1,
                    journal: []
                }
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })
        render(<WatchPastJournal/>)
        await waitFor(() => {
            expect(screen.getByTestId("page-next")).toBeInTheDocument()
            expect(screen.getByTestId("page-before")).toBeInTheDocument()
        })
        fireEvent.click(screen.getByTestId("page-next"))
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "watchPastJournal/setPage",
                payload: 2
            })
        )
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "watchPastJournal/setJournal",
                payload: []
            })
        )
        fireEvent.click(screen.getByTestId("page-before"))
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "watchPastJournal/setPage",
                payload: 0
            })
        )
    })

})