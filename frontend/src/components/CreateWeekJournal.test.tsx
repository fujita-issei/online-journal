import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import CreateWeekJournal from './CreateWeekJournal';
import * as ReduxHooks from '../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe("CreateWeekJouralのテスト", () => {

    const mockDispatch = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue" },
                weekJournal: {
                    startDate: "2026-03-02", endDate: "2026-03-08",
                    toDo: [], toDoCheck: [], toDoImportant: [],
                    journal: [], journalCount: [], journalLastEditTime: [],
                    summary: {
                        getUpHour : 0,
                        getUpMin: 0,
                        goBedHour: 0,
                        goBedMin: 0,
                        sumSleepHour: 0,
                        sumSleepMin: 0,
                        toDoTimeHour: 0,
                        toDoTimeMin: 0,
                        routineDone: 0,
                        routineAll: 0,
                        toDoDone: 0,
                        toDoAll: 0,
                        NGDone: 0,
                        NGAll: 0, 
                        journalAllCount: 0,
                        moneyInvestment: 0,
                        moneyWaste: 0,
                        moneyConsumption: 0,
                        moneyUseSum: 0
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
        render(<CreateWeekJournal/>)
        // リセットボタン1を押す
        fireEvent.click(screen.getByTestId("reset-1"))
        // リセットボタン2を押す
        fireEvent.click(screen.getByTestId("reset-2"))
        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalled()
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/setWeekInit"
                })
            )
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "weekJournal/changeWeekDate",
                    payload: expect.objectContaining({ startDate: "2026-03-02", endDate: "2026-03-08"})
                })
            )
        })
    })
})