import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import CreateRoutine from './CreateRoutine';
import * as ReduxHooks from '../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe("CreateRoutineのテスト", () => {
    const mockDispatch = vi.fn()
    const mockRoutineList = [
        { routineId: "db1", routineName: "朝のルーティーン", routine: [], routineTime: [] },
        { routineId: "db2", routineName: "夜のルーティーン", routine: [], routineTime: [] }
    ]

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"}
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })
        vi.spyOn(ReduxHooks, "useAppDispatch").mockReturnValue(mockDispatch)
        vi.mocked(axios.get).mockResolvedValue({ data: mockRoutineList })
    })

    it("初回レンダリングする => getメソッドが呼ばれる => 取得したデータが表示される", async () => {
        render(<CreateRoutine/>)
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/routine/get", {
                params: { userId: "testUser" }
            })
            expect(screen.getAllByText("朝のルーティーン")[0]).toBeInTheDocument()
            expect(screen.getAllByText("夜のルーティーン")[0]).toBeInTheDocument()
        })
    })

    it("新しいルーティーンを作成を押す => dispatchとnavigateが呼ばれる", () => {
        render(<CreateRoutine/>)
        fireEvent.click(screen.getByTestId("create-button"))
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "routine/setRoutineInit"
            })
        )
        expect(mockNavigate).toHaveBeenCalledWith("/createRoutine/edit")
    })

})