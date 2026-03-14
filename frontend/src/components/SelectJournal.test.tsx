import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SelectJournal from './SelectJournal';
import * as ReduxHooks from '../hooks/ReduxHooks';
import axios from 'axios';

vi.mock('axios');
vi.mock('../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}))

vi.mock("../func/calcStartEndWeekDays", () => ({
    default: vi.fn(() => ["2026", "03", "02", "2026", "03", "08"])
}))
vi.mock("../func/calcPastMonth", () => ({
    default: vi.fn(() => ["2026", "03"])
}))
vi.mock("../func/calcPastYear", () => ({
    default: vi.fn(() => "2026")
}))
vi.mock("../func/YearMonthDateToDate", () => ({
    default: vi.fn((year, month, date) => `${year}-${month}-${date}`)
}))
vi.mock('../constant/date', () => {
    return {
        nowDate: "03",
        nowMonth: "03",
        nowYear: "2026",
        nowYearMonthDate: "2026-03-03"
    }
})

describe("SelectJournalのテスト", () => {
    const mockDispatch = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(Storage.prototype, "setItem")

        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
                dailyJournal: {
                    targetDate: "2026-03-03",
                    getUpHour: 7, getUpMin: 30, goBedHour: 23, goBedMin: 0,
                    routine: [], routineCheck: [],
                    toDoTimeHour: 0, toDoTimeMin: 0, startToDoHour: 0, startToDoMin: 0, endToDoHour: 0, endToDoMin: 0,
                    toDoTimeCheck: [], toDoList: [], toDoListCheck: [], toDoListImportant: [],
                    importList: [], importListCheck: [], addList: [], addListCheck: [],
                    journal: [], journalCount: [], journalLastEditTime: [],
                    moneyInvestment: 0, moneyWaste: 0, moneyConsumption: 0, moneyUseSum: 0
                },
                weekJournal: {
                    startDate: "2026-03-02", endDate: "2026-03-08",
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
                },
                monthJournal: {
                    targetDate: "2026-03",
                    toDoCheck: [], toDo: [], toDoImportant: [],
                    journal: [], journalCount: [], journalLastEditTime: [],
                    summary: {
                        getUpHour: 7, getUpMin: 30,
                        goBedHour: 23, goBedMin: 0,
                        sumSleepHour: 8, sumSleepMin: 30,
                        toDoTimeHour: 10, toDoTimeMin: 0,
                        routineDone: 5, routineAll: 7,
                        toDoDone: 10, toDoAll: 15,
                        NGDone: 14, NGAll: 14,
                        journalAllCount: 5000,
                        moneyInvestment: 10000, moneyWaste: 2000, moneyConsumption: 15000,
                        moneyUseSum: 27000
                    }
                },
                yearJournal: {
                    targetDate: "2026",
                    toDoCheck: [], toDo: [], toDoImportant: [],
                    journal: [], journalCount: [], journalLastEditTime: [],
                    summary: {
                        getUpHour: 7, getUpMin: 30,
                        goBedHour: 23, goBedMin: 0,
                        sumSleepHour: 8, sumSleepMin: 30,
                        toDoTimeHour: 10, toDoTimeMin: 0,
                        routineDone: 5, routineAll: 7,
                        toDoDone: 10, toDoAll: 15,
                        NGDone: 14, NGAll: 14,
                        journalAllCount: 5000,
                        moneyInvestment: 10000, moneyWaste: 2000, moneyConsumption: 15000,
                        moneyUseSum: 27000
                    }
                }
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })
        vi.spyOn(ReduxHooks, "useAppDispatch").mockReturnValue(mockDispatch)
    })

    it("日別ジャーナルを押す => getメソッドが走る => データがない => dispatch, localStorage, navigateちゃんと動く", async () => {
        // 空のデータを返す
        vi.mocked(axios.get).mockResolvedValue({ data: [] })
        render(<SelectJournal/>)
        expect(screen.getByText("日別 (2026年 03月 03日) の"))
        // 日別のジャーナルを作成を押す
        fireEvent.click(screen.getByTestId("daily-button"))
        await waitFor(() => {
            // getメソッドが走ったかを確認
            expect(axios.get).toHaveBeenCalled()
            // setInitが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/setInit"
                })
            )
            // ローカルストレージに保存されているか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("dailyJournalDate", "2026-03-03")
            // changeDateが呼ばれているか確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/changeDate",
                    payload: "2026-03-03"
                })
            )
            // navigate先に飛んでいるか確認
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal/daily")
        })
    })

    it("日別を作成を押す => getメソッド走る => データある => dispatch, localStorage, navigateが問題なく動く", async () => {
        // 仮のデータを返す
        const mockData = [{ targetDate: "2026-03-03", getUpHour: 7 }]
        vi.mocked(axios.get).mockResolvedValue({ data: mockData })
        render(<SelectJournal/>)
        expect(screen.getByText("日別 (2026年 03月 03日) の"))
        // 日別のジャーナルを作成を押す
        fireEvent.click(screen.getByTestId("daily-button"))
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled()
            // setCurrentDailyJournalが呼ばれたか確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/setCurrentDailyJournal",
                    payload: mockData[0]
                })
            )
            // ローカルストレージに保存されているか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("dailyJournalDate", "2026-03-03")
            // changeDateが呼ばれているか確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/changeDate",
                    payload: "2026-03-03"
                })
            )
            // navigate先に飛んでいるか確認
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal/daily")
        })
    })

    it("週別ジャーナルを押す => getメソッドが走る => データがない => dispatch, localStorage, navigateちゃんと動く", async () => {
        // 空のデータを返す
        vi.mocked(axios.get).mockResolvedValue({ data: [] })
        render(<SelectJournal/>)
        // 日別のジャーナルを作成を押す
        fireEvent.click(screen.getByTestId("week-button"))
        await waitFor(() => {
            // getメソッドが走ったかを確認
            expect(axios.get).toHaveBeenCalled()
            // setWeekInitが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/setWeekInit"
                })
            )
            // ローカルストレージに保存されているか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("weekJournalStartDate", "2026-03-02")
            expect(localStorage.setItem).toHaveBeenCalledWith("weekJournalEndDate", "2026-03-08")
            // changeWeekDateが呼ばれているか確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/changeWeekDate",
                    payload: expect.objectContaining({ startDate: "2026-03-02", endDate: "2026-03-08" })
                })
            )
            // navigate先に飛んでいるか確認
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal/week")
        })
    })

    it("週別を作成を押す => getメソッド走る => データある => dispatch, localStorage, navigateが問題なく動く", async () => {
        // 仮のデータを返す
        const mockData = [{ startDate: "2026-03-02", endDate: "2026-03-08", toDo: [] }]
        vi.mocked(axios.get).mockResolvedValue({ data: mockData })
        render(<SelectJournal/>)
        // 日別のジャーナルを作成を押す
        fireEvent.click(screen.getByTestId("week-button"))
        await waitFor(() => {
            // getメソッドが走ったかを確認
            expect(axios.get).toHaveBeenCalled()
            // setCurrentWeekが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/setCurrentWeek",
                    payload: mockData[0]
                })
            )
            // ローカルストレージに保存されているか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("weekJournalStartDate", "2026-03-02")
            expect(localStorage.setItem).toHaveBeenCalledWith("weekJournalEndDate", "2026-03-08")
            // changeWeekDateが呼ばれているか確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/changeWeekDate",
                    payload: expect.objectContaining({ startDate: "2026-03-02", endDate: "2026-03-08" })
                })
            )
            // navigate先に飛んでいるか確認
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal/week")
        })
    })

    it("月別ジャーナルを押す => getメソッドが走る => データがない => dispatch, localStorage, navigateちゃんと動く", async () => {
        // 空のデータを返す
        vi.mocked(axios.get).mockResolvedValue({ data: [] })
        render(<SelectJournal/>)
        // 月別のジャーナルを作成を押す
        fireEvent.click(screen.getByTestId("month-button"))
        await waitFor(() => {
            // getメソッドが走ったかを確認
            expect(axios.get).toHaveBeenCalled()
            // setMonthInitが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "monthJournal/setMonthInit"
                })
            )
            // ローカルストレージに保存されているか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("monthJournalDate", "2026-03")
            // changeDateが呼ばれているか確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "monthJournal/changeMonthDate",
                    payload: "2026-03"
                })
            )
            // navigate先に飛んでいるか確認
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal/month")
        })
    })

    it("月別ジャーナルを押す => getメソッドが走る => データがある => dispatch, localStorage, navigateちゃんと動く", async () => {
        // 仮のデータを返す
        const mockData = [{ targetDate: "2026-03", toDo: [] }]
        vi.mocked(axios.get).mockResolvedValue({ data: mockData })
        render(<SelectJournal/>)
        // 月別のジャーナルを作成を押す
        fireEvent.click(screen.getByTestId("month-button"))
        await waitFor(() => {
            // getメソッドが走ったかを確認
            expect(axios.get).toHaveBeenCalled()
            // setCurrentMonthが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "monthJournal/setCurrentMonth",
                    payload: mockData[0]
                })
            )
            // ローカルストレージに保存されているか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("monthJournalDate", "2026-03")
            // changeDateが呼ばれているか確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "monthJournal/changeMonthDate",
                    payload: "2026-03"
                })
            )
            // navigate先に飛んでいるか確認
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal/month")
        })
    })

    it("年別ジャーナルを押す => getメソッドが走る => データがない => dispatch, localStorage, navigateちゃんと動く", async () => {
        // 空のデータを返す
        vi.mocked(axios.get).mockResolvedValue({ data: [] })
        render(<SelectJournal/>)
        // 年別のジャーナルを作成を押す
        fireEvent.click(screen.getByTestId("year-button"))
        await waitFor(() => {
            // getメソッドが走ったかを確認
            expect(axios.get).toHaveBeenCalled()
            // setYearInitが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "yearJournal/setYearInit"
                })
            )
            // ローカルストレージに保存されているか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("yearJournalDate", "2026")
            // changeDateが呼ばれているか確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "yearJournal/changeYearDate",
                    payload: "2026"
                })
            )
            // navigate先に飛んでいるか確認
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal/year")
        })
    })

    it("年別ジャーナルを押す => getメソッドが走る => データがある => dispatch, localStorage, navigateちゃんと動く", async () => {
        // 仮のデータを返す
        const mockData = [{ targetDate: "2026", toDo: [] }]
        vi.mocked(axios.get).mockResolvedValue({ data: mockData })
        render(<SelectJournal/>)
        // 年別のジャーナルを作成を押す
        fireEvent.click(screen.getByTestId("year-button"))
        await waitFor(() => {
            // getメソッドが走ったかを確認
            expect(axios.get).toHaveBeenCalled()
            // setCurrentYearが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "yearJournal/setCurrentYear"
                })
            )
            // ローカルストレージに保存されているか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("yearJournalDate", "2026")
            // changeDateが呼ばれているか確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "yearJournal/changeYearDate",
                    payload: "2026"
                })
            )
            // navigate先に飛んでいるか確認
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal/year")
        })
    })

})