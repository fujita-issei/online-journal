import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import DailyJournalNavi from './DailyJournalNavi';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock("../../func/calcDays", () => ({
    default: vi.fn((targetDate, numOfDays, type) => type === "-" ? "2026-03-02" : "2026-03-04")
}))
vi.mock("../../func/DateToYearMonthDate", () => ({
    default: vi.fn(() => ["2026", "03", "03"])
}))
vi.mock("../../func/checkJournalWritten", () => ({
    default: vi.fn(() => true)
}))

describe("DailyJournalNaviのテスト", () => {
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
        render(<DailyJournalNavi/>)
        // 戻るボタンを押す
        fireEvent.click(screen.getByTestId("save-button"))
        await waitFor(() => {
            // postメソッドが呼ばれたのかを確認
            expect(axios.post).toHaveBeenCalled()
            // setInitが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/setInit",
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal")
        })
    })

    it("昨日へのボタンを押す => postメソッドが送られる => getメソッドが送られる => データないので、setInitが呼ばれる => ローカルストレージに保存される => changeDateが呼ばれる", async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: [] })
        render(<DailyJournalNavi/>)
        fireEvent.click(screen.getByTestId("yestarday-button"))
        await waitFor(() => {
            // postメソッドが呼ばれたのかを確認
            expect(axios.post).toHaveBeenCalled()
            // getメソッドが呼ばれたのかを確認
            expect(axios.get).toHaveBeenCalled()
            // データがないから、setInitが呼ばれるかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/setInit"
                })
            )
            // ローカルストレージに昨日の日付が保存されるか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("dailyJournalDate", "2026-03-02")
            // changeDateが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/changeDate"
                })
            )
        })
    })

    it("昨日へのボタンを押す => postメソッドが送られる => getメソッドが送られる => データ取れた => setCurrentDailyJournalが呼ばれる => ローカルストレージに保存される => changeDateが呼ばれる", async () => {
        // getが1つのデータを返すようにする
        const mockData = { targetDate: "2026-03-02", getUpHour: 8 }
        vi.mocked(axios.get).mockResolvedValue({ data: [mockData]})
        render(<DailyJournalNavi/>)
        fireEvent.click(screen.getByTestId("yestarday-button"))
        await waitFor(() => {
            // postメソッドが呼ばれたのかを確認
            expect(axios.post).toHaveBeenCalled()
            // getメソッドが呼ばれたのかを確認
            expect(axios.get).toHaveBeenCalled()
            // データがあるから、setCurrentDailyJournalが呼ばれたかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/setCurrentDailyJournal",
                    payload: mockData
                })
            )
            // ローカルストレージに昨日の日付が保存されるか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("dailyJournalDate", "2026-03-02")
            // changeDateが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/changeDate"
                })
            )
        })
    })

    it("明日へのボタンを押す => postメソッドが送られる => getメソッドが送られる => データないので、setInitが呼ばれる => ローカルストレージに保存される => changeDateが呼ばれる", async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: [] })
        render(<DailyJournalNavi/>)
        fireEvent.click(screen.getByTestId("tomorrow-button"))
        await waitFor(() => {
            // postメソッドが呼ばれたのかを確認
            expect(axios.post).toHaveBeenCalled()
            // getメソッドが呼ばれたのかを確認
            expect(axios.get).toHaveBeenCalled()
            // データがないから、setInitが呼ばれるかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/setInit"
                })
            )
            // ローカルストレージに明日の日付が保存されるか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("dailyJournalDate", "2026-03-04")
            // changeDateが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/changeDate"
                })
            )
        })
    })

    it("明日へのボタンを押す => postメソッドが送られる => getメソッドが送られる => データ取れた => setCurrentDailyJournalが呼ばれる => ローカルストレージに保存される => changeDateが呼ばれる", async () => {
        // getが1つのデータを返すようにする
        const mockData = { targetDate: "2026-03-04", getUpHour: 8 }
        vi.mocked(axios.get).mockResolvedValue({ data: [mockData]})
        render(<DailyJournalNavi/>)
        fireEvent.click(screen.getByTestId("tomorrow-button"))
        await waitFor(() => {
            // postメソッドが呼ばれたのかを確認
            expect(axios.post).toHaveBeenCalled()
            // getメソッドが呼ばれたのかを確認
            expect(axios.get).toHaveBeenCalled()
            // データがあるから、setCurrentDailyJournalが呼ばれたかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/setCurrentDailyJournal",
                    payload: mockData
                })
            )
            // ローカルストレージに明日の日付が保存されるか確認
            expect(localStorage.setItem).toHaveBeenCalledWith("dailyJournalDate", "2026-03-04")
            // changeDateが呼ばれたのかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/changeDate"
                })
            )
        })
    })

})