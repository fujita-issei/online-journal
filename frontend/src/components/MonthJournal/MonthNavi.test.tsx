import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import MonthNavi from './MonthNavi';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock("../../func/calcDays", () => ({
    default: vi.fn((targetDate, numOfDays, type) => {
        if(numOfDays === 1 && type === "-") return "2026-02-28"
        if(numOfDays === 32 && type === "+") return "2026-04-02"
    })
}))
vi.mock("../../func/DateToYearMonthDate", () => ({
    default: vi.fn(() => ["2026", "03", "01"])
}))
vi.mock("../../func/checkJournalWritten", () => ({
    default: vi.fn(() => true)
}))

describe("MonthNaviのテスト", () => {
    const mockDispatch = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(Storage.prototype, "setItem")

        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
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
                }
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })

        vi.spyOn(ReduxHooks, "useAppDispatch").mockReturnValue(mockDispatch)
        // postメソッドは成功を返すようにする
        vi.mocked(axios.post).mockResolvedValue({ data: "success" })
    })

    it("戻るボタンを押す => postメソッドが送られる => setInitが呼ばれる => navigate先にいく", async () => {
        render(<MonthNavi/>)
        // 戻るボタンを押す
        fireEvent.click(screen.getByTestId("save-button"))
        await waitFor(() => {
            // postメソッドが呼ばれたのかを確認
            expect(axios.post).toHaveBeenCalled()
            // setInitが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "monthJournal/setMonthInit",
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal")
        })
    })

    it("昨日へのボタンを押す => postメソッドが送られる => getメソッドが送られる => データないので、setInitが呼ばれる => ローカルストレージに保存される => changeDateが呼ばれる", async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: [] })
        render(<MonthNavi/>)
        fireEvent.click(screen.getByTestId("lastMonth-button"))
        await waitFor(() => {
            // postメソッドが呼ばれたのかを確認
            expect(axios.post).toHaveBeenCalled()
            // getメソッドが呼ばれたのかを確認
            expect(axios.get).toHaveBeenCalled()
            // データがないから、setInitが呼ばれるかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "monthJournal/setMonthInit"
                })
            )
            // ローカルストレージに昨日の日付が保存されるか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("monthJournalDate", "2026-02")
            // changeDateが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "monthJournal/changeMonthDate",
                    payload: "2026-02"
                })
            )
        })
    })

    it("昨日へのボタンを押す => postメソッドが送られる => getメソッドが送られる => データ取れた => setCurrentDailyJournalが呼ばれる => ローカルストレージに保存される => changeDateが呼ばれる", async () => {
        // getが1つのデータを返すようにする
        const mockData = { targetDate: "2026-03-01", getUpHour: 8 }
        vi.mocked(axios.get).mockResolvedValue({ data: [mockData]})
        render(<MonthNavi/>)
        fireEvent.click(screen.getByTestId("lastMonth-button"))
        await waitFor(() => {
            // postメソッドが呼ばれたのかを確認
            expect(axios.post).toHaveBeenCalled()
            // getメソッドが呼ばれたのかを確認
            expect(axios.get).toHaveBeenCalled()
            // データがあるから、setCurrentDailyJournalが呼ばれたかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "monthJournal/setCurrentMonth",
                    payload: mockData
                })
            )
            // ローカルストレージに昨日の日付が保存されるか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("monthJournalDate", "2026-02")
            // changeDateが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "monthJournal/changeMonthDate",
                    payload: "2026-02"
                })
            )
        })
    })

    it("明日へのボタンを押す => postメソッドが送られる => getメソッドが送られる => データないので、setInitが呼ばれる => ローカルストレージに保存される => changeDateが呼ばれる", async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: [] })
        render(<MonthNavi/>)
        fireEvent.click(screen.getByTestId("nextMonth-button"))
        await waitFor(() => {
            // postメソッドが呼ばれたのかを確認
            expect(axios.post).toHaveBeenCalled()
            // getメソッドが呼ばれたのかを確認
            expect(axios.get).toHaveBeenCalled()
            // データがないから、setInitが呼ばれるかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "monthJournal/setMonthInit"
                })
            )
            // ローカルストレージに明日の日付が保存されるか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("monthJournalDate", "2026-04")
            // changeDateが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "monthJournal/changeMonthDate",
                    payload: "2026-04"
                })
            )
        })
    })

    it("明日へのボタンを押す => postメソッドが送られる => getメソッドが送られる => データ取れた => setCurrentDailyJournalが呼ばれる => ローカルストレージに保存される => changeDateが呼ばれる", async () => {
        // getが1つのデータを返すようにする
        const mockData = { targetDate: "2026-03-01", getUpHour: 8 }
        vi.mocked(axios.get).mockResolvedValue({ data: [mockData]})
        render(<MonthNavi/>)
        fireEvent.click(screen.getByTestId("nextMonth-button"))
        await waitFor(() => {
            // postメソッドが呼ばれたのかを確認
            expect(axios.post).toHaveBeenCalled()
            // getメソッドが呼ばれたのかを確認
            expect(axios.get).toHaveBeenCalled()
            // データがあるから、setCurrentDailyJournalが呼ばれたかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "monthJournal/setCurrentMonth",
                    payload: mockData
                })
            )
            // ローカルストレージに明日の日付が保存されるか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("monthJournalDate", "2026-04")
            // changeDateが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "monthJournal/changeMonthDate",
                    payload: "2026-04"
                })
            )
        })
    })

})