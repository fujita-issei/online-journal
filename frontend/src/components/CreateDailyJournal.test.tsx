import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import CreateDailyJournal from './CreateDailyJournal';
import * as ReduxHooks from '../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe("CreateDailyJouralのテスト", () => {

    const mockDispatch = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue" },
                dailyJournal: {
                    targetDate: "2026-03-03",
                    getUpHour: 7, getUpMin: 30, goBedHour: 23, goBedMin: 0,
                    routine: [], routineCheck: [],
                    toDoTimeHour: 0, toDoTimeMin: 0, startToDoHour: 0, startToDoMin: 0, endToDoHour: 0, endToDoMin: 0,
                    toDoTimeCheck: [], toDoList: [], toDoListCheck: [], toDoListImportant: [],
                    importList: [], importListCheck: [], addList: [], addListCheck: [],
                    journal: [], journalCount: [], journalLastEditTime: [],
                    moneyInvestment: 0, moneyWaste: 0, moneyConsumption: 0, moneyUseSum: 0
                }
            }
            // @ts-expect-error: テスト用に一部のStateのみをモックしているため
            return selector(mockState)
        })
        vi.spyOn(ReduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch)
    })

    it("リセットボタンが押される => deleteメソッドが飛ぶ => dispatchが呼ばれる", async () => {
        (axios.delete as ReturnType<typeof vi.fn>).mockResolvedValue({ data: "success"})
        render(<CreateDailyJournal/>)
        // リセットボタン1を押す
        fireEvent.click(screen.getByTestId("reset-1"))
        // リセットボタン2を押す
        fireEvent.click(screen.getByTestId("reset-2"))
        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalled()
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/setInit"
                })
            )
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "dailyJournal/changeDate",
                    payload: "2026-03-03"
                })
            )
        })
    })
})