import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import SummaryRoutine from './SummaryRoutine';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');
vi.mock('../../constant/date', () => ({
    nowYearMonthDate: "2026-03-07"
}))

vi.mock('./Graph/RoutineGraphPieChart', () => ({
    default: () => <div data-testid="mock-pie-chart">ダミー円グラフ</div>
}))
vi.mock('./Graph/RoutineGraphAchieve', () => ({
    default: ({ chartData }: { chartData: { name: string; rate: number }[] }) => (
        <div data-testid="mock-achieve-graph">
            ダミー棒グラフ（データ件数: {chartData.length}件）
        </div>
    )
}))
vi.mock('./Graph/RoutineGraphDaily', () => ({
    default: ({ chartData }: { chartData: { date: string; rate: number}[] }) => (
        <div data-testid="mock-daily-graph">
            ダミー折れ線グラフ（データ件数: {chartData.length}件）
        </div>
    )
}))

describe("SummaryRoutineのテスト", () => {
    const mockDispatch = vi.fn()
    const mockRoutineData = Array.from({ length: 7 }).map((_, i) => ({
        targetDate: `2026-03-0${i + 1}`,
        routine: [{ routineId: "r1", routineName: "朝の筋トレ" }, { routineId: "r2", routineName: "夜の読書" }],
        routineCheck: [true, false]
    }))

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
                summary: {
                    routineNumberOfDay: 7,
                    routineSummary: {
                        routineDone: 10,
                        routineAll: 20,
                        achievementHighest: "朝の筋トレ",
                        achievementLowest: "夜の読書"
                    }
                }
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })
        vi.spyOn(ReduxHooks, "useAppDispatch").mockReturnValue(mockDispatch)
        vi.mocked(axios.get).mockResolvedValue({ data: mockRoutineData })
    })

    it("初回レンダリング => getメソッド走る => 正しい値でdispatch呼ばれる", async () => {
        const expectedPayload = {
            routineDone: 7,
            routineAll: 14,
            achievementHighest: "朝の筋トレ",
            achievementLowest: "夜の読書"
        }
        render(<SummaryRoutine/>)
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/summary/getRoutineData", {
                params: {
                    userId: "testUser",
                    targetDate: "2026-03-07",
                    routineNumberOfDay: 7
                }
            })
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "summary/setRoutineSummary", // Action名に合わせてください
                    payload: expectedPayload
                })
            )
        })
    })

    it("プルダウンを変更 => dispatchが呼ばれる", () => {
        render(<SummaryRoutine/>)
        fireEvent.change(screen.getByTestId("select-routine-days"), { target: { value: "15" } })
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "summary/setRoutineNumberOfDay",
                payload: 15
            })
        )
    })

    it("グラフが3つちゃんと正しいデータが渡されて表示される", async () => {
        render(<SummaryRoutine />)
        await waitFor(() => {
            // パイチャートがちゃんと表示されるか
            expect(screen.getByTestId("mock-pie-chart")).toBeInTheDocument();
        })
        fireEvent.click(screen.getByText("グラフで見る"))
        expect(screen.getByTestId("mock-achieve-graph")).toBeInTheDocument()
        expect(screen.getByText("ダミー棒グラフ（データ件数: 2件）")).toBeInTheDocument()
        expect(screen.getByTestId("mock-daily-graph")).toBeInTheDocument()
        expect(screen.getByText("ダミー折れ線グラフ（データ件数: 7件）")).toBeInTheDocument()
        fireEvent.click(screen.getByText("閉じる"))
        expect(screen.queryByTestId("mock-achieve-graph")).not.toBeInTheDocument()
        expect(screen.queryByTestId("mock-daily-graph")).not.toBeInTheDocument()
    })

})
