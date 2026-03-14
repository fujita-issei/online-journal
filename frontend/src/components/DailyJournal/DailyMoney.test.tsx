import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DailyMoney from './DailyMoney';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('../../hooks/ReduxHooks');

describe("DailyMoneyのテスト", () => {

    const mockDispatch = vi.fn();
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(ReduxHooks, 'useAppSelector').mockImplementation((selector) => {
            const mockState = {
                color: { color: 'blue' },
                dailyJournal: { 
                    moneyInvestment: 100,
                    moneyWaste: 200,
                    moneyConsumption: 300,
                    moneyUseSum: 600
                }
            };
            // @ts-expect-error: テスト用に一部のStateのみをモックしているため
            return selector(mockState);
        });
        vi.spyOn(ReduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
    })

    it("どこかを変える => 合計金額が計算されるdispatchが呼ばれる", () => {
        render(<DailyMoney/>)
        // investmentを変える
        fireEvent.change(screen.getByTestId("input-investment"), { target : { value: "1000" } })
        // dispatchが呼ばれる
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "dailyJournal/changeInvestment",
                payload: "1000"
            })
        )
    })

})