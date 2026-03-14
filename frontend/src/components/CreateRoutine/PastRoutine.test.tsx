import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import PastRoutine from './PastRoutine';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock("../../func/formatDate", () => ({
    default: vi.fn(() => "2026-03-03")
}))

describe("PastRoutineのテスト", () => {
    const mockDispatch = vi.fn()
    const mockGetRoutineList = vi.fn()
    const mockRoutineData = {
        userId: "testUser",
        routineId: "r1",
        routineName: "テストルーティーン",
        targetTimeHour: 1,
        targetTimeMin: 30,
        routine: ["タスク1", "タスク2"],
        routineTime: [10, 20],
        createdAt: "2026-03-01",
        updatedAt: "2026-03-03"
    }

    beforeEach(() => {
        vi.clearAllMocks()
        window.scrollTo = vi.fn()
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                color: { color: "blue"},
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })

        vi.spyOn(ReduxHooks, "useAppDispatch").mockReturnValue(mockDispatch)
    })

    it("編集ボタン押す => dispatchが呼ばれる => navigate", () => {
        render(<PastRoutine _routine = {mockRoutineData} getRoutineList={mockGetRoutineList}/>)
        fireEvent.click(screen.getByTestId("edit-button"))
        // setEditStateが呼ばれるか確認
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "routine/setEditState",
                payload: expect.objectContaining({
                    routineId: "r1",
                    routineName: "テストルーティーン",
                    targetTimeHour: 1,
                    targetTimeMin: 30,
                    routine: ["タスク1", "タスク2"],
                    routineTime: [10, 20],
                    createdAt: "2026-03-01",
                    updatedAt: "2026-03-03"
                })
            })
        )
        // navigate先に飛ぶか確認
        expect(mockNavigate).toHaveBeenCalledWith("/createRoutine/edit")
    })

    it("削除ボタンを押す => deleteメソッドが走る => getRoutineListが呼ばれる => dispatch, window.scroll呼ばれる", async () => {
        vi.mocked(axios.delete).mockResolvedValue({ data: "success" })
        render(<PastRoutine _routine = {mockRoutineData} getRoutineList={mockGetRoutineList}/>)
        fireEvent.click(screen.getByTestId("delete-button1"))
        fireEvent.click(screen.getByTestId("delete-button2"))
        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalled()
            expect(mockGetRoutineList).toHaveBeenCalled()
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "routine/setRoutineInit"
                })
            )
            expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
        })
    })
})
