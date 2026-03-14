import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import DispYear from './DispYear';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock("../../func/DateToYearYearDate", () => ({
    default: vi.fn(() => ["2026", "03", "03"])
}))

describe("DispYearのテスト", () => {
    const mockDispatch = vi.fn()
    const mockHandleDeleteSuccess = vi.fn()
    const mockYearJournal = {
        userId: "testUser", isWritten: true, createdAt: "2026-03-03", updatedAt: "2026-03-03",
        targetDate: "2026",
        toDoCheck: [], toDo: [], toDoImportant: [],
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

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(Storage.prototype, "setItem")
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                color: { color: "blue"},
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })
        vi.spyOn(ReduxHooks, "useAppDispatch").mockReturnValue(mockDispatch)
        // deleteメソッドは成功を返すようにする
        vi.mocked(axios.delete).mockResolvedValue({ data: "success" })
    })

    it("編集ボタンを押す => dispatch, localStorage, navigateが正しく動作する", () => {
        render(<DispYear journal = {mockYearJournal} handleDeleteSuccess={mockHandleDeleteSuccess}/>)
        fireEvent.click(screen.getByTestId("edit-button"))
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "yearJournal/setCurrentYear",
                payload: expect.objectContaining(mockYearJournal)
            })
        )
        expect(localStorage.setItem).toHaveBeenCalledWith("yearJournalDate", "2026")
        expect(mockNavigate).toHaveBeenCalledWith("/createJournal/year")
    })

    it("削除ボタンを押す => deleteメソッドが走る => 関数が呼ばれる", async () => {
        render(<DispYear journal = {mockYearJournal} handleDeleteSuccess={mockHandleDeleteSuccess}/>)
        fireEvent.click(screen.getByTestId("reset1"))
        fireEvent.click(screen.getByTestId("reset2"))
        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith("/api/yearJournal/deleteYearJournal", {
                params: {
                    userId: "testUser",
                    targetDate: "2026-01-01"
                }
            })
            expect(mockHandleDeleteSuccess).toHaveBeenCalled()
        })
    })

})