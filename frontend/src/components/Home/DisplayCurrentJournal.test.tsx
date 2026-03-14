import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import DisplayCurrentJournal from './DisplayCurrentJournal';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock("../../func/calcDays", () => ({
    default: vi.fn((targetDate, numOfDays, type) => {
        const date = new Date(targetDate);
        if (type === "-") {
            date.setDate(date.getDate() - numOfDays);
        } else {
            date.setDate(date.getDate() + numOfDays);
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    })
}))
vi.mock("../../func/DateToYearMonthDate", () => ({
    default: vi.fn((targetDate) => [targetDate.slice(0, 4), targetDate.slice(5, 7), targetDate.slice(8, 10)])
}))
vi.mock("../../func/calcPastMonth", () => ({
    default: vi.fn((i) => {
        if (i == 1) return ["2026", "02"]
        if (i == 2) return ["2026", "01"]
    })
}))
vi.mock("../../func/calcPastYear", () => ({
    default: vi.fn((i) => {
        if (i == 1) return "2025"
        if (i == 2) return "2024"
    })
}))
vi.mock("../../func/calcStartEndWeekDays", () => ({
    default: vi.fn((i) => {
        if (i == 1) return ["2026", "02", "23", "2026", "03", "01"]
        if (i == 2) return ["2026", "02", "16", "2026", "02", "22"]
    })
}))
vi.mock("../../func/YearMonthDateToDate", () => ({
    default: vi.fn((year, month, date) => `${year}-${month}-${date}`)
}))
vi.mock('../../constant/date', () => ({
    nowYearMonthDate: "2026-03-07"
}))

describe("DisplayCurrentJournalのテスト", () => {
    const mockDispatch = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(Storage.prototype, "setItem")
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })
        vi.spyOn(ReduxHooks, "useAppDispatch").mockReturnValue(mockDispatch)
    })

    it("最近の日別ジャーナルからどれか押す => getメソッド飛ぶ => データない => dispatch, localStorage, navigateそれぞれ呼ばれる", async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: [] })
        render(<DisplayCurrentJournal/>)
        fireEvent.click(screen.getByTestId("move-daily-button"))
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/dailyJournal/getTodayJournal", {
                params: {
                    userId: "testUser",
                    targetDate: "2026-03-06"
                }
            })
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/setInit",
                })
            )
            expect(localStorage.setItem).toHaveBeenCalledWith("dailyJournalDate", "2026-03-06")
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/changeDate",
                    payload: "2026-03-06"
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal/daily")
        })
    })

    it("最近の日別ジャーナルからどれか押す => getメソッド飛ぶ => データある => dispatch, localStorage, navigateそれぞれ呼ばれる", async () => {
        const mockData = { targetDate: "2026-03-06", getUpData: 7 }
        vi.mocked(axios.get).mockResolvedValue({ data: [mockData] })
        render(<DisplayCurrentJournal/>)
        fireEvent.click(screen.getByTestId("move-daily-button"))
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/dailyJournal/getTodayJournal", {
                params: {
                    userId: "testUser",
                    targetDate: "2026-03-06"
                }
            })
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/setCurrentDailyJournal",
                    payload: expect.objectContaining(mockData)
                })
            )
            expect(localStorage.setItem).toHaveBeenCalledWith("dailyJournalDate", "2026-03-06")
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/changeDate",
                    payload: "2026-03-06"
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal/daily")
        })
    })

    it("最近の週別ジャーナルからどれか押す => getメソッド飛ぶ => データない => dispatch, localStorage, navigateそれぞれ呼ばれる", async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: [] })
        render(<DisplayCurrentJournal/>)
        fireEvent.click(screen.getByTestId("move-week-button"))
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/weekJournal/getThisWeek", {
                params: {
                    userId: "testUser",
                    startDate: "2026-02-23",
                    endDate: "2026-03-01"
                }
            })
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/setWeekInit",
                })
            )
            expect(localStorage.setItem).toHaveBeenCalledWith("weekJournalStartDate", "2026-02-23")
            expect(localStorage.setItem).toHaveBeenCalledWith("weekJournalEndDate", "2026-03-01")
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/changeWeekDate",
                    payload: expect.objectContaining({ startDate: "2026-02-23", endDate: "2026-03-01"})
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal/week")
        })
    })

    it("最近の週別ジャーナルからどれか押す => getメソッド飛ぶ => データある => dispatch, localStorage, navigateそれぞれ呼ばれる", async () => {
        const mockData = { startDate: "2026-02-23", endDate: "2026-03-01", toDo: [] }
        vi.mocked(axios.get).mockResolvedValue({ data: [mockData] })
        render(<DisplayCurrentJournal/>)
        fireEvent.click(screen.getByTestId("move-week-button"))
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/weekJournal/getThisWeek", {
                params: {
                    userId: "testUser",
                    startDate: "2026-02-23",
                    endDate: "2026-03-01"
                }
            })
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/setCurrentWeek",
                    payload: expect.objectContaining(mockData)
                })
            )
            expect(localStorage.setItem).toHaveBeenCalledWith("weekJournalStartDate", "2026-02-23")
            expect(localStorage.setItem).toHaveBeenCalledWith("weekJournalEndDate", "2026-03-01")
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/changeWeekDate",
                    payload: expect.objectContaining({ startDate: "2026-02-23", endDate: "2026-03-01"})
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal/week")
        })
    })

    it("最近の月別ジャーナルからどれか押す => getメソッド飛ぶ => データない => dispatch, localStorage, navigateそれぞれ呼ばれる", async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: [] })
        render(<DisplayCurrentJournal/>)
        fireEvent.click(screen.getByTestId("move-month-button"))
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/monthJournal/getThisMonth", {
                params: {
                    userId: "testUser",
                    targetDate: "2026-02-01"
                }
            })
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "monthJournal/setMonthInit",
                })
            )
            expect(localStorage.setItem).toHaveBeenCalledWith("monthJournalDate", "2026-02")
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "monthJournal/changeMonthDate",
                    payload: "2026-02"
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal/month")
        })
    })

    it("最近の月別ジャーナルからどれか押す => getメソッド飛ぶ => データある => dispatch, localStorage, navigateそれぞれ呼ばれる", async () => {
        const mockData = { targetDate: "2026-02-01", toDo:[] }
        vi.mocked(axios.get).mockResolvedValue({ data: [mockData] })
        render(<DisplayCurrentJournal/>)
        fireEvent.click(screen.getByTestId("move-month-button"))
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/monthJournal/getThisMonth", {
                params: {
                    userId: "testUser",
                    targetDate: "2026-02-01"
                }
            })
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "monthJournal/setCurrentMonth",
                    payload: expect.objectContaining(mockData)
                })
            )
            expect(localStorage.setItem).toHaveBeenCalledWith("monthJournalDate", "2026-02")
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "monthJournal/changeMonthDate",
                    payload: "2026-02"
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal/month")
        })
    })

    it("最近の年別ジャーナルからどれか押す => getメソッド飛ぶ => データない => dispatch, localStorage, navigateそれぞれ呼ばれる", async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: [] })
        render(<DisplayCurrentJournal/>)
        fireEvent.click(screen.getByTestId("move-year-button"))
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/yearJournal/getThisYear", {
                params: {
                    userId: "testUser",
                    targetDate: "2025-01-01"
                }
            })
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "yearJournal/setYearInit",
                })
            )
            expect(localStorage.setItem).toHaveBeenCalledWith("yearJournalDate", "2025")
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "yearJournal/changeYearDate",
                    payload: "2025"
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal/year")
        })
    })

    it("最近の年別ジャーナルからどれか押す => getメソッド飛ぶ => データある => dispatch, localStorage, navigateそれぞれ呼ばれる", async () => {
        const mockData = { targetDate: "2025-01-01", toDo:[] }
        vi.mocked(axios.get).mockResolvedValue({ data: [mockData] })
        render(<DisplayCurrentJournal/>)
        fireEvent.click(screen.getByTestId("move-year-button"))
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/yearJournal/getThisYear", {
                params: {
                    userId: "testUser",
                    targetDate: "2025-01-01"
                }
            })
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "yearJournal/setCurrentYear",
                    payload: expect.objectContaining(mockData)
                })
            )
            expect(localStorage.setItem).toHaveBeenCalledWith("yearJournalDate", "2025")
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "yearJournal/changeYearDate",
                    payload: "2025"
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/createJournal/year")
        })
    })
})