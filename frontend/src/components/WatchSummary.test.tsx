import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import WatchSummary from './WatchSummary';
import * as ReduxHooks from '../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../hooks/ReduxHooks');

vi.mock('../constant/date', () => ({
    nowYearMonthDate: "2026-03-15"
}))
vi.mock("../func/DateToYearMonthDate", () => ({
    default: vi.fn(() => ["2026", "03", "03"]) 
}));
vi.mock("../func/calcDays", () => ({
    default: vi.fn((targetDate, numOfDays, type) => {
        if (type === "-") return "2026-03-14"
        if (type === "+") {
            const date = new Date(targetDate);
            date.setDate(date.getDate() + numOfDays);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    }) 
}));
vi.mock('./Summary/SummarySleep', () => ({
    default: () => <div>ダミー睡眠データ</div>
}))
vi.mock('./Summary/SummaryRoutine', () => ({
    default: () => <div>ダミールーティーンデータ</div>
}))
vi.mock('./Summary/SummaryNG', () => ({
    default: () => <div>ダミー禁止リストデータ</div>
}))
vi.mock('./Summary/SummaryToDo', () => ({
    default: () => <div>ダミーToDoデータ</div>
}))
vi.mock('./Summary/SummaryJournal', () => ({
    default: () => <div>ダミージャーナルデータ</div>
}))
vi.mock('./Summary/SummaryMoney', () => ({
    default: () => <div>ダミーお金データ</div>
}))

describe("WatchSummaryのテスト", () => {
    const mockDispatch = vi.fn()
    const dateArray = ["15", "14", "13", "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "01"]
    const mockData = Array.from({ length: 14 }).map((_, i) => ({
        targetDate: `2026-03-${dateArray[i]}`,
    }))

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
                summary: {
                    streak: 13,
                    streakStartDay: "2026-03-03"
                }
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })
        vi.spyOn(ReduxHooks, "useAppDispatch").mockReturnValue(mockDispatch)
        vi.mocked(axios.get).mockResolvedValue({ data: mockData })
    })

    it("初回レンダリング => getメソッド走る => 正しい値でdispatch呼ばれる", async () => {
        render(<WatchSummary/>)
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/summary/getCurrentJournalStreak", {
                params: {
                    userId: "testUser",
                    targetDate: "2026-03-15",
                }
            })
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "summary/setStreak", // Action名に合わせてください
                    payload: expect.objectContaining({ streak: 13, streakStartDay: "2026-03-03"})
                })
            )
        })
    })

})
