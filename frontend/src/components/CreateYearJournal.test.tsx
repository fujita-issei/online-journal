import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import CreateYearJournal from './CreateYearJournal';
import * as ReduxHooks from '../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe("CreateYearJouralのテスト", () => {

    const mockDispatch = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue" },
                yearJournal: {
                    targetDate: "2026",
                    toDoCheck: [], toDo: [], toDoImportant: [],
                    journal: [], journalCount: [], journalLastEditTime: [],
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
            }
            // @ts-expect-error: テスト用に一部のStateのみをモックしているため
            return selector(mockState)
        })
        vi.spyOn(ReduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch)
        vi.mocked(axios.get).mockResolvedValue({ data: [] })
    })

    it("リセットボタンが押される => deleteメソッドが飛ぶ => dispatchが呼ばれる", async () => {
        (axios.delete as ReturnType<typeof vi.fn>).mockResolvedValue({ data: "success"})
        render(<CreateYearJournal/>)
        // リセットボタン1を押す
        fireEvent.click(screen.getByTestId("reset-1"))
        // リセットボタン2を押す
        fireEvent.click(screen.getByTestId("reset-2"))
        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalled()
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "yearJournal/setYearInit"
                })
            )
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "yearJournal/changeYearDate",
                    payload: "2026"
                })
            )
        })
    })
})