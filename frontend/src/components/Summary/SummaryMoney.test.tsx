import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import SummaryMoney from './SummaryMoney';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');
vi.mock('../../constant/date', () => ({
    nowYearMonthDate: "2026-03-07"
}))

vi.mock('./Graph/MoneyInvestmentGraph', () => ({
    default: ({ investmentData }: { investmentData: { targetDate: string; investment: number; }[] }) => (
        <div data-testid="mock-investment-graph">
            ダミー折れ線グラフ1（データ件数: {investmentData.length}件）
        </div>
    )
}))
vi.mock('./Graph/MoneyWasteGraph', () => ({
    default: ({ wasteData }: { wasteData: { targetDate: string; waste: number; }[] }) => (
        <div data-testid="mock-waste-graph">
            ダミー折れ線グラフ2（データ件数: {wasteData.length}件）
        </div>
    )
}))
vi.mock('./Graph/MoneyConsumptionGraph', () => ({
    default: ({ consumptionData }: { consumptionData: { targetDate: string; consumption: number; }[] }) => (
        <div data-testid="mock-consumption-graph">
            ダミー折れ線グラフ3（データ件数: {consumptionData.length}件）
        </div>
    )
}))
vi.mock('./Graph/MoneyUseSumGraph', () => ({
    default: ({ useSumData }: { useSumData: { targetDate: string; useSum: number; }[] }) => (
        <div data-testid="mock-useSum-graph">
            ダミー折れ線グラフ4（データ件数: {useSumData.length}件）
        </div>
    )
}))


describe("SummaryMoneyのテスト", () => {
    const mockDispatch = vi.fn()
    const mockMoneyData = Array.from({ length: 7 }).map((_, i) => ({
        targetDate: `2026-03-0${i + 1}`,
        moneyInvestment: 100 * i, moneyWaste: 200 * i, moneyConsumption: 300 * i,
        moneyUseSum: 600 * i
    }))

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
                summary: {
                    moneyNumberOfDay: 7,
                    moneySummary: {
                        aveInvestment: 300,
                        aveWaste: 600,
                        aveConsumption: 900,
                        maxInvestment: 600,
                        maxWaste: 1200,
                        maxConsumption: 1800,
                        minInvestment: 0,
                        minWaste: 0,
                        minConsumption: 0,
                        sumInvestment: 2100,
                        sumWaste: 4200,
                        sumConsumption: 6300,
                        sumUseMoney: 12600
                    }
                }
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })
        vi.spyOn(ReduxHooks, "useAppDispatch").mockReturnValue(mockDispatch)
        vi.mocked(axios.get).mockResolvedValue({ data: mockMoneyData })
    })

    it("初回レンダリング => getメソッド走る => 正しい値でdispatch呼ばれる", async () => {
        const expectedPayload = {
            aveInvestment: 300,
            aveWaste: 600,
            aveConsumption: 900,
            maxInvestment: 600,
            maxWaste: 1200,
            maxConsumption: 1800,
            minInvestment: 0,
            minWaste: 0,
            minConsumption: 0,
            sumInvestment: 2100,
            sumWaste: 4200,
            sumConsumption: 6300,
            sumUseMoney: 12600
        }
        render(<SummaryMoney />)
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/summary/getMoneyData", {
                params: {
                    userId: "testUser",
                    targetDate: "2026-03-07",
                    moneyNumberOfDay: 7
                }
            })
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "summary/setMoneySummary",
                    payload: expectedPayload
                })
            )
        })
    })

    it("プルダウンを変更 => dispatchが呼ばれる", () => {
        render(<SummaryMoney />)
        fireEvent.change(screen.getByTestId("select-money-days"), { target: { value: "15" } })
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "summary/setMoneyNumberOfDay",
                payload: 15
            })
        )
    })

    it("グラフが4つちゃんと正しいデータが渡されて表示される", async () => {
        render(<SummaryMoney />)
        await screen.findByText(/12600/);
        fireEvent.click(screen.getByText("グラフで見る"))
        expect(screen.getByTestId("mock-investment-graph")).toBeInTheDocument()
        expect(screen.getByText("ダミー折れ線グラフ1（データ件数: 7件）")).toBeInTheDocument()
        expect(screen.getByTestId("mock-waste-graph")).toBeInTheDocument()
        expect(screen.getByText("ダミー折れ線グラフ2（データ件数: 7件）")).toBeInTheDocument()
        expect(screen.getByTestId("mock-consumption-graph")).toBeInTheDocument()
        expect(screen.getByText("ダミー折れ線グラフ3（データ件数: 7件）")).toBeInTheDocument()
        expect(screen.getByTestId("mock-useSum-graph")).toBeInTheDocument()
        expect(screen.getByText("ダミー折れ線グラフ4（データ件数: 7件）")).toBeInTheDocument()

        fireEvent.click(screen.getByText("閉じる"))
        expect(screen.queryByTestId("mock-investment-graph")).not.toBeInTheDocument()
        expect(screen.queryByTestId("mock-waste-graph")).not.toBeInTheDocument()
        expect(screen.queryByTestId("mock-consumption-graph")).not.toBeInTheDocument()
        expect(screen.queryByTestId("mock-useSum-graph")).not.toBeInTheDocument()
    })  

})
