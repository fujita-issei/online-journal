import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MonthSummary from './MonthSummary';
import * as ReduxHooks from '../../hooks/ReduxHooks';
import axios from 'axios';

vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');

vi.mock("../../func/checkJournalWritten", () => ({
    default: vi.fn(() => false) 
}));

describe("MonthSummaryのテスト", () => {
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser" },
                color: { color: "blue" },
                monthJournal: {
                    targetDate: "2026-03",
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
            };
            // @ts-expect-error: テスト用
            return selector(mockState);
        });
        vi.spyOn(ReduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    })

    it("初回レンダリング時、１週間分のデータ取得 => サマリーが計算されて、dispatchが呼ばれるか", async () => {
        // 1週間分のダミーデータを用意
        const dummyDailyData = Array.from({ length: 31 }).map((_, i) => ({
            targetDate: `2026-03-0${i + 1}`,
            getUpHour: 7, getUpMin: 0,
            goBedHour: 23, goBedMin: 0,
            toDoTimeCheck: [true, true],
            routine: ["A"], routineCheck: [true],
            toDoList: ["B", "C"], toDoListCheck: [true, false], 
            importListCheck: [true], addListCheck: [true], 
            journalCount: [100, 200],
            moneyInvestment: 1000, moneyWaste: 500, moneyConsumption: 2000
        }));
        // 2026-02-28の就寝時間のダミーデータを用意
        const dummyYestardaySleep = [{ goBedHour: 23, goBedMin: 0 }]
        vi.mocked(axios.get).mockImplementation(async (url) => {
            if (url.includes("getDailyDataForSummary")) {
                return { data: dummyDailyData }
            }
            if (url.includes("getYestardaySleepTime")) {
                return { data: dummyYestardaySleep}
            }
            return { data: [] }
        })
        render(<MonthSummary renderingTrigger= {0}/>)
        await waitFor(() => {
            // apiが2種類ともちゃんと呼ばれたのかを確認
            expect(axios.get).toHaveBeenCalledTimes(2)
            // setMonthSummaryが何かしらの配列で呼ばれたかを確認
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "monthJournal/setMonthSummary",
                    payload: expect.any(Array) 
                })
            )
        })
    })

    it("summaryにちゃんとデータがあるとき、ちゃんと画面に表示される", () => {
        render(<MonthSummary renderingTrigger={0}/>)
        expect(screen.getByText("平均起床時間 : 7 時 30 分")).toBeInTheDocument()
        expect(screen.getByText(/平均睡眠時間 : 8 時 30 分/i)).toBeInTheDocument()
        expect(screen.getByText(/10 時間 0 分/i)).toBeInTheDocument()
        expect(screen.getByText("5 個")).toBeInTheDocument()
        expect(screen.getByText("5000 文字")).toBeInTheDocument()
        expect(screen.getByText("合計金額 : 27000円")).toBeInTheDocument()
    })

    it("計算結果のデータがない場合、データが足りませんとちゃんと表示される", async () => {
        vi.mocked(axios.get).mockResolvedValue({ data: [] })
        render(<MonthSummary renderingTrigger={0}/>)
        await waitFor(() => {
            // データが足りませんと表示されるか
            expect(screen.getByText("データが足りません")).toBeInTheDocument()
        })
    })

})