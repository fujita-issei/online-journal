import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import WeekNavi from './WeekNavi';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock("../../func/calcDays", () => ({
    default: vi.fn((targetDate, numOfDays, type) => {
        if (targetDate === "2026-03-02" && type === "-") return "2026-02-23"
        if (targetDate === "2026-03-02" && type === "+") return "2026-03-09"
        if (targetDate === "2026-03-08" && type === "-") return "2026-03-01"
        if (targetDate === "2026-03-08" && type === "+") return "2026-03-15"
    })
}))
vi.mock("../../func/DateToYearMonthDate", () => ({
    default: vi.fn(() => ["2026", "03", "03"])
}))
vi.mock("../../func/checkWeekJournalWritten", () => ({
    default: vi.fn(() => true)
}))

describe("WeekNaviのテスト", () => {
    const mockDispatch = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(Storage.prototype, "setItem")

        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
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
                }
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })

        vi.spyOn(ReduxHooks, "useAppDispatch").mockReturnValue(mockDispatch)

        // postメソッドは成功を返すようにする
        vi.mocked(axios.post).mockResolvedValue({ data: "success" })
    })

    it("戻るボタンを押す => postメソッドが送られる => setWeekInitが呼ばれる => navigate先にいく", async () => {
        render(<WeekNavi/>)
        // 戻るボタンを押す
        fireEvent.click(screen.getByTestId("save-button"))
        await waitFor(() => {
            // postメソッドが呼ばれたのかを確認
            expect(axios.post).toHaveBeenCalled()
            // setInitが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/setWeekInit",
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal")
        })
    })

    it("昨日へのボタンを押す => postメソッドが送られる => getメソッドが送られる => データないので、setWeekInitが呼ばれる => ローカルストレージに保存される => changeWeekDateが呼ばれる", async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: [] })
        render(<WeekNavi/>)
        fireEvent.click(screen.getByTestId("lastWeek-button"))
        await waitFor(() => {
            // postメソッドが呼ばれたのかを確認
            expect(axios.post).toHaveBeenCalled()
            // getメソッドが呼ばれたのかを確認
            expect(axios.get).toHaveBeenCalled()
            // データがないから、setInitが呼ばれるかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/setWeekInit"
                })
            )
            // ローカルストレージに昨日の日付が保存されるか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("weekJournalStartDate", "2026-02-23")
            expect(localStorage.setItem).toHaveBeenCalledWith("weekJournalEndDate", "2026-03-01")
            // changeDateが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/changeWeekDate",
                    payload: expect.objectContaining({ startDate: "2026-02-23", endDate: "2026-03-01" })
                })
            )
        })
    })

    it("昨日へのボタンを押す => postメソッドが送られる => getメソッドが送られる => データ取れた => setCurrentDailyJournalが呼ばれる => ローカルストレージに保存される => changeDateが呼ばれる", async () => {
        // getが1つのデータを返すようにする
        const mockData = { startDate: "2026-02-23", endDate: "2026-03-01", toDo: [] }
        vi.mocked(axios.get).mockResolvedValue({ data: [mockData]})
        render(<WeekNavi/>)
        fireEvent.click(screen.getByTestId("lastWeek-button"))
        await waitFor(() => {
            // postメソッドが呼ばれたのかを確認
            expect(axios.post).toHaveBeenCalled()
            // getメソッドが呼ばれたのかを確認
            expect(axios.get).toHaveBeenCalled()
            // データがあるから、setCurrentDailyJournalが呼ばれたかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/setCurrentWeek",
                    payload: mockData
                })
            )
            // ローカルストレージに昨日の日付が保存されるか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("weekJournalStartDate", "2026-02-23")
            expect(localStorage.setItem).toHaveBeenCalledWith("weekJournalEndDate", "2026-03-01")
            // changeDateが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/changeWeekDate",
                    payload: expect.objectContaining({ startDate: "2026-02-23", endDate: "2026-03-01" })
                })
            )
        })
    })

    it("明日へのボタンを押す => postメソッドが送られる => getメソッドが送られる => データないので、setInitが呼ばれる => ローカルストレージに保存される => changeDateが呼ばれる", async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: [] })
        render(<WeekNavi/>)
        fireEvent.click(screen.getByTestId("nextWeek-button"))
        await waitFor(() => {
            // postメソッドが呼ばれたのかを確認
            expect(axios.post).toHaveBeenCalled()
            // getメソッドが呼ばれたのかを確認
            expect(axios.get).toHaveBeenCalled()
            // データがないから、setInitが呼ばれるかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/setWeekInit"
                })
            )
            // ローカルストレージに明日の日付が保存されるか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("weekJournalStartDate", "2026-03-09")
            expect(localStorage.setItem).toHaveBeenCalledWith("weekJournalEndDate", "2026-03-15")
            // changeDateが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/changeWeekDate",
                    payload: expect.objectContaining({ startDate: "2026-03-09", endDate: "2026-03-15" })
                })
            )
        })
    })

    it("明日へのボタンを押す => postメソッドが送られる => getメソッドが送られる => データ取れた => setCurrentDailyJournalが呼ばれる => ローカルストレージに保存される => changeDateが呼ばれる", async () => {
        // getが1つのデータを返すようにする
        const mockData = { startDate: "2026-03-09", endDate: "2026-03-15", toDo: [] }
        vi.mocked(axios.get).mockResolvedValue({ data: [mockData]})
        render(<WeekNavi/>)
        fireEvent.click(screen.getByTestId("nextWeek-button"))
        await waitFor(() => {
            // postメソッドが呼ばれたのかを確認
            expect(axios.post).toHaveBeenCalled()
            // getメソッドが呼ばれたのかを確認
            expect(axios.get).toHaveBeenCalled()
            // データがあるから、setCurrentDailyJournalが呼ばれたかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/setCurrentWeek",
                    payload: mockData
                })
            )
            // ローカルストレージに明日の日付が保存されるか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("weekJournalStartDate", "2026-03-09")
            expect(localStorage.setItem).toHaveBeenCalledWith("weekJournalEndDate", "2026-03-15")
            // changeDateが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/changeWeekDate",
                    payload: expect.objectContaining({ startDate: "2026-03-09", endDate: "2026-03-15" })
                })
            )
        })
    })

})