import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import SummarySleep from './SummarySleep';
import * as ReduxHooks from '../../hooks/ReduxHooks';
import type { SleepData } from './Graph/SleepGraph';

vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');
vi.mock('../../constant/date', () => ({
    nowYearMonthDate: "2026-03-07"
}))

describe("SummarySleepのテスト", () => {
    const mockDispatch = vi.fn()
    const mockSleepData = Array.from({ length: 7 }).map((_, i) => ({
        targetDate: `2026-03-0${i + 1}`,
        getUpHour: 7 + Math.trunc(i / 4), 
        getUpMin: i * 5,
        goBedHour: 23 + Math.trunc(i / 4), 
        goBedMin: i * 5,
    }))

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
                summary: {
                    sleepNumberOfDay: 7,
                    sleepSummary: {
                        aveGetUpHour: 23,
                        aveGetUpMin: 0,
                        earlyGetUpHour: 23,
                        earlyGetUpMin: 0,
                        lateGetUpHour: 23,
                        lateGetUpMin: 0,
                        aveGoBedHour: 23,
                        aveGoBedMin: 0,
                        earlyGoBedHour: 23,
                        earlyGoBedMin: 0,
                        lateGoBedHour: 23,
                        lateGoBedMin: 0
                    }
                }
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })
        vi.spyOn(ReduxHooks, "useAppDispatch").mockReturnValue(mockDispatch)
        vi.mocked(axios.get).mockResolvedValue({
            data: mockSleepData
        })
        vi.mock('./Graph/SleepGraph', () => {
            return {
                default: ({ data }: { data: SleepData[] }) => (
                    <div data-testid="mock-sleep-graph">
                        ダミーグラフ（データ件数: {data.length}件）
                    </div>
                )
            }
        })
    })

    it("初回レンダリング => getメソッド走る => 正しく統計データが計算されて、dispatchに入る" , async () => {
        const expectedPayload = {
            aveGetUpHour: 7,
            aveGetUpMin: 40, 
            earlyGetUpHour: 7,
            earlyGetUpMin: 0,  
            lateGetUpHour: 8,
            lateGetUpMin: 30, 
            aveGoBedHour: 23,
            aveGoBedMin: 40, 
            earlyGoBedHour: 23,
            earlyGoBedMin: 0,
            lateGoBedHour: 24,
            lateGoBedMin: 30
        }
        render(<SummarySleep/>)
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/summary/getSleepData", {
                params: {
                    userId: "testUser",
                    targetDate: "2026-03-07",
                    sleepNumberOfDay: 7
                }
            })
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "summary/setSleepSummary",
                    payload: expectedPayload
                })
            )
        })
    })

    it("プルダウンを変更 => dispatchが呼ばれる", () => {
        render(<SummarySleep/>)
        fireEvent.change(screen.getByTestId("select-sleep-days"), { target: { value: "15" } })
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "summary/setSleepNumberOfDay",
                payload: 15
            })
        )
    })

    it("グラフを見るのボタン => 正しいデータが渡されてグラフが表示される", async () => {
        render(<SummarySleep />)
        expect(screen.queryByTestId("mock-sleep-graph")).not.toBeInTheDocument()
        const graphButton = await screen.findByText("グラフで見る")
        fireEvent.click(graphButton)
        expect(screen.getByTestId("mock-sleep-graph")).toBeInTheDocument()
        expect(screen.getByText("ダミーグラフ（データ件数: 7件）")).toBeInTheDocument()
        const closeButton = screen.getByText("閉じる")
        fireEvent.click(closeButton)
        expect(screen.queryByTestId("mock-sleep-graph")).not.toBeInTheDocument()
    })

})