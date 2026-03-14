import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import SummaryNG from './SummaryNG';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');
vi.mock('../../constant/date', () => ({
    nowYearMonthDate: "2026-03-07"
}))

vi.mock('./Graph/ListGraphPieChart', () => ({
    default: () => <div data-testid="mock-pie-chart">ダミー円グラフ</div>
}))
vi.mock('./Graph/ListGraphAhieve', () => ({
    default: ({ chartData }: { chartData: { name: string; rate: number }[] }) => (
        <div data-testid="mock-achieve-graph">
            ダミー棒グラフ（データ件数: {chartData.length}件）
        </div>
    )
}))
vi.mock('./Graph/ListGraphDaily', () => ({
    default: ({ chartData }: { chartData: { date: string; rate: number}[] }) => (
        <div data-testid="mock-daily-graph">
            ダミー折れ線グラフ（データ件数: {chartData.length}件）
        </div>
    )
}))

describe("SummaryNGのテスト", () => {
    const mockDispatch = vi.fn()
    const mockListData = Array.from({ length: 7 }).map((_, i) => ({
        targetDate: `2026-03-0${i + 1}`,
        importList: [
            { listName: "Friday", list: ["dont watch youtube", "dont sleep in studying"] }, 
            { listName: "Sunday", list: ["dont watch youtube", "dont sleep in studying"] }
        ],
        importListCheck: [true, false],
        addList: ["dont play game", "dont check twitter"],
        addListCheck: [true, false]
    }))

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
                summary: {
                    listNumberOfDay: 7,
                    listSummary: {
                        listDone: 14,
                        listAll: 28,
                        achievementHighest: "Friday",
                        achievementLowest: "dont check twitter"
                    }
                }
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })
        vi.spyOn(ReduxHooks, "useAppDispatch").mockReturnValue(mockDispatch)
        vi.mocked(axios.get).mockResolvedValue({ data: mockListData })
    })

    it("初回レンダリング => getメソッド走る => 正しい値でdispatch呼ばれる", async () => {
        const expectedPayload = {
            listDone: 14,
            listAll: 28,
            achievementHighest: "dont play game",
            achievementLowest: "dont check twitter"
        }
        render(<SummaryNG/>)
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/summary/getListData", {
                params: {
                    userId: "testUser",
                    targetDate: "2026-03-07",
                    listNumberOfDay: 7
                }
            })
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "summary/setListSummary",
                    payload: expectedPayload
                })
            )
        })
    })

    it("プルダウンを変更 => dispatchが呼ばれる", () => {
        render(<SummaryNG/>)
        fireEvent.change(screen.getByTestId("select-list-days"), { target: { value: "15" } })
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "summary/setListNumberOfDay",
                payload: 15
            })
        )
    })

    it("グラフが3つちゃんと正しいデータが渡されて表示される", async () => {
        render(<SummaryNG />)
        await waitFor(() => {
            // パイチャートがちゃんと表示されるか
            expect(screen.getByTestId("mock-pie-chart")).toBeInTheDocument();
        })
        fireEvent.click(screen.getByText("グラフで見る"))
        expect(screen.getByTestId("mock-achieve-graph")).toBeInTheDocument()
        expect(screen.getByText("ダミー棒グラフ（データ件数: 4件）")).toBeInTheDocument()
        expect(screen.getByTestId("mock-daily-graph")).toBeInTheDocument()
        expect(screen.getByText("ダミー折れ線グラフ（データ件数: 7件）")).toBeInTheDocument()
        fireEvent.click(screen.getByText("閉じる"))
        expect(screen.queryByTestId("mock-achieve-graph")).not.toBeInTheDocument()
        expect(screen.queryByTestId("mock-daily-graph")).not.toBeInTheDocument()
    })

})
