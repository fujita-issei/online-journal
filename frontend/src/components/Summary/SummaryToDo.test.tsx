import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import SummaryToDo from './SummaryToDo';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');

vi.mock('../../constant/date', () => ({
    nowYearMonthDate: "2026-03-07"
}))
vi.mock('./Graph/ToDoDonePieChart', () => ({
    default: () => <div data-testid="mock-done-pie-chart">ダミー円グラフ</div>
}))
vi.mock('./Graph/ToDoAchieveGoalTimePieChart', () => ({
    default: ({ chartData }: { chartData: { name: string; rate: number }[] }) => (
        <div data-testid="mock-achieve-pie-chart">
            ダミー円グラフ（データ件数: {chartData.length}件）
        </div>
    )
}))
vi.mock('./Graph/ToDoTimeGraph', () => ({
    default: ({ graphData }: { graphData: { date: string; rate: number}[] }) => (
        <div data-testid="mock-time-graph">
            ダミー折れ線グラフ（データ件数: {graphData.length}件）
        </div>
    )
}))

describe("SummaryToDoのテスト", () => {
    const mockDispatch = vi.fn()
    const mockToDoData = Array.from({ length: 7 }).map((_, i) => ({
        targetDate: `2026-03-0${i + 1}`,
        toDoTimeHour: 3, toDoTimeMin: 0, toDoTimeCheck: Array(i * 2).fill(true),
        toDoListCheck: [true, true, false, false]
    }))

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
                summary: {
                    toDoNumberOfDay: 7,
                    toDoSummary: {
                        sumToDoHour: 21,
                        sumToDoMin: 0,
                        aveToDoHour: 3,
                        aveToDoMin: 0,
                        long1stDate: "2026-03-07",
                        long1stHour: 6,
                        long1stMin: 0,
                        long2ndDate: "2026-03-06",
                        long2ndHour: 5,
                        long2ndMin: 0,
                        long3rdDate: "2026-03-05",
                        long3rdHour: 4,
                        long3rdMin: 0,
                        short1stDate: "2026-03-01",
                        short1stHour: 0,
                        short1stMin: 0,
                        short2ndDate: "2026-03-02",
                        short2ndHour: 1,
                        short2ndMin: 0,
                        short3rdDate: "2026-03-03",
                        short3rdHour: 2,
                        short3rdMin: 0,
                        toDoDone: 14,
                        toDoAll: 28,
                        achieveGoalTime: 4
                    }
                }
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })
        vi.spyOn(ReduxHooks, "useAppDispatch").mockReturnValue(mockDispatch)
        vi.mocked(axios.get).mockResolvedValue({ data: mockToDoData })
    })

    it("初回レンダリング => getメソッド走る => 正しい値でdispatch呼ばれる", async () => {
        const expectedPayload = {
            sumToDoHour: 21,
            sumToDoMin: 0,
            aveToDoHour: 3,
            aveToDoMin: 0,
            long1stDate: "2026-03-07",
            long1stHour: 6,
            long1stMin: 0,
            long2ndDate: "2026-03-06",
            long2ndHour: 5,
            long2ndMin: 0,
            long3rdDate: "2026-03-05",
            long3rdHour: 4,
            long3rdMin: 0,
            short1stDate: "2026-03-01",
            short1stHour: 0,
            short1stMin: 0,
            short2ndDate: "2026-03-02",
            short2ndHour: 1,
            short2ndMin: 0,
            short3rdDate: "2026-03-03",
            short3rdHour: 2,
            short3rdMin: 0,
            toDoDone: 14,
            toDoAll: 28,
            achieveGoalTime: 4
        }
        render(<SummaryToDo/>)
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/summary/getToDoData", {
                params: {
                    userId: "testUser",
                    targetDate: "2026-03-07",
                    toDoNumberOfDay: 7
                }
            })
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "summary/setToDoSummary",
                    payload: expectedPayload
                })
            )
        })
    })

    it("プルダウンを変更 => dispatchが呼ばれる", () => {
        render(<SummaryToDo/>)
        fireEvent.change(screen.getByTestId("select-toDo-days"), { target: { value: "15" } })
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "summary/setToDoNumberOfDay",
                payload: 15
            })
        )
    })

    it("グラフが3つちゃんと正しいデータが渡されて表示される", async () => {
        render(<SummaryToDo />)
        await waitFor(() => {
            // パイチャートがちゃんと表示されるか
            expect(screen.getByTestId("mock-done-pie-chart")).toBeInTheDocument()
            expect(screen.getByTestId("mock-achieve-pie-chart")).toBeInTheDocument()
        })
        fireEvent.click(screen.getByText("グラフで見る"))
        expect(screen.getByTestId("mock-time-graph")).toBeInTheDocument()
        expect(screen.getByText("ダミー折れ線グラフ（データ件数: 7件）")).toBeInTheDocument()
        fireEvent.click(screen.getByText("閉じる"))
        expect(screen.queryByTestId("mock-time-graph")).not.toBeInTheDocument()
    })

})
