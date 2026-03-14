import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import DispDaily from './DispDaily';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock("../../func/DateToYearMonthDate", () => ({
    default: vi.fn(() => ["2026", "03", "03"])
}))

describe("DispDailyのテスト", () => {
    const mockDispatch = vi.fn()
    const mockHandleDeleteSuccess = vi.fn()
    const mockJournal = {
        userId: "testUser", isWritten: true, createdAt: "2026-03-03", updatedAt: "2026-03-03",
        targetDate: "2026-03-03",
        getUpHour: 7, getUpMin: 30, goBedHour: 23, goBedMin: 0,
        routine: [], routineCheck: [],
        toDoTimeHour: 0, toDoTimeMin: 0, startToDoHour: 0, startToDoMin: 0, endToDoHour: 0, endToDoMin: 0,
        toDoTimeCheck: [], toDoList: [], toDoListCheck: [], toDoListImportant: [],
        importList: [], importListCheck: [], addList: [], addListCheck: [],
        journal: [], journalCount: [], journalLastEditTime: [],
        moneyInvestment: 0, moneyWaste: 0, moneyConsumption: 0, moneyUseSum: 0
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
        render(<DispDaily journal = {mockJournal} handleDeleteSuccess={mockHandleDeleteSuccess}/>)
        fireEvent.click(screen.getByTestId("edit-button"))
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "dailyJournal/setCurrentDailyJournal",
                payload: expect.objectContaining(mockJournal)
            })
        )
        expect(localStorage.setItem).toHaveBeenCalledWith("dailyJournalDate", "2026-03-03")
        expect(mockNavigate).toHaveBeenCalledWith("/createJournal/daily")
    })

    it("削除ボタンを押す => deleteメソッドが走る => 関数が呼ばれる", async () => {
        render(<DispDaily journal = {mockJournal} handleDeleteSuccess={mockHandleDeleteSuccess}/>)
        fireEvent.click(screen.getByTestId("reset1"))
        fireEvent.click(screen.getByTestId("reset2"))
        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith("/api/dailyJournal/deleteTodayJournal", {
                params: {
                    userId: "testUser",
                    targetDate: "2026-03-03"
                }
            })
            expect(mockHandleDeleteSuccess).toHaveBeenCalled()
        })
    })

})