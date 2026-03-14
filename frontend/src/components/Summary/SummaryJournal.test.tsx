import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import SummaryJournal from './SummaryJournal';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');
vi.mock('../../constant/date', () => ({
    nowYearMonthDate: "2026-03-07"
}))

vi.mock('./Graph/JournalCountGraph', () => ({
    default: ({ graphData }: { graphData: { targetDate: string; journalCount: number; }[] }) => (
        <div data-testid="mock-count-graph">
            ダミー折れ線グラフ（データ件数: {graphData.length}件）
        </div>
    )
}))

describe("SummaryJournalのテスト", () => {
    const mockDispatch = vi.fn()
    const mockJournalData = Array.from({ length: 7 }).map((_, i) => ({
        targetDate: `2026-03-0${i + 1}`,
        journalCount: [100 * i, 200 * i, 1000 - 100 * i]
    }))

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
                summary: {
                    journalNumberOfDay: 7,
                    journalSummary: {
                        sumJournalCount: 11200,
                        aveJournalCount: 1600,
                        long1stDate: "2026-03-07",
                        long1stCount: 2200,
                        long2ndDate: "2026-03-06",
                        long2ndCount: 2000,
                        long3rdDate: "2026-03-05",
                        long3rdCount: 1800,
                        short1stDate: "2026-03-01",
                        short1stCount: 1000,
                        short2ndDate: "2026-03-02",
                        short2ndCount: 1200,
                        short3rdDate: "2026-03-03",
                        short3rdCount: 1400
                    }
                }
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })
        vi.spyOn(ReduxHooks, "useAppDispatch").mockReturnValue(mockDispatch)
        vi.mocked(axios.get).mockResolvedValue({ data: mockJournalData })
    })

    it("初回レンダリング => getメソッド走る => 正しい値でdispatch呼ばれる", async () => {
        const expectedPayload = {
            sumJournalCount: 11200,
            aveJournalCount: 1600,
            long1stDate: "2026-03-07",
            long1stCount: 2200,
            long2ndDate: "2026-03-06",
            long2ndCount: 2000,
            long3rdDate: "2026-03-05",
            long3rdCount: 1800,
            short1stDate: "2026-03-01",
            short1stCount: 1000,
            short2ndDate: "2026-03-02",
            short2ndCount: 1200,
            short3rdDate: "2026-03-03",
            short3rdCount: 1400
        }
        render(<SummaryJournal />)
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/summary/getJournalData", {
                params: {
                    userId: "testUser",
                    targetDate: "2026-03-07",
                    journalNumberOfDay: 7
                }
            })
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "summary/setJournalSummary", 
                    payload: expectedPayload
                })
            )
        })
    })

    it("プルダウンを変更 => dispatchが呼ばれる", () => {
        render(<SummaryJournal/>)
        fireEvent.change(screen.getByTestId("select-journal-days"), { target: { value: "15" } })
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "summary/setJournalNumberOfDay",
                payload: 15
            })
        )
    })

    it("グラフがちゃんと正しいデータが渡されて表示される", async () => {
        render(<SummaryJournal />)
        expect(screen.queryByTestId("mock-count-graph")).not.toBeInTheDocument()
        const graphButton = await screen.findByText("グラフで見る")
        fireEvent.click(graphButton)
        expect(screen.getByTestId("mock-count-graph")).toBeInTheDocument()
        expect(screen.getByText("ダミー折れ線グラフ（データ件数: 7件）")).toBeInTheDocument()
        const closeButton = screen.getByText("閉じる")
        fireEvent.click(closeButton)
        expect(screen.queryByTestId("mock-count-graph")).not.toBeInTheDocument()
    })

})
