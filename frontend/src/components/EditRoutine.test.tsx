import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import EditRoutine from './EditRoutine';
import * as ReduxHooks from '../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe("EditRoutineのテスト", () => {
    const mockDispatch = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()

        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
                routine: {
                    routineId: "r1",
                    routineName: "モーニング",
                    targetTimeHour: 1,
                    targetTimeMin: 30,
                    routine: ["顔洗う", "朝飯食べる"],
                    routineTime: [10, 30]
                }
            }
            // @ts-expect-error: テスト用
            return selector(mockState);
        })

        vi.spyOn(ReduxHooks, "useAppDispatch").mockReturnValue(mockDispatch)

        // delete, postメソッドは成功を返すようにする
        vi.mocked(axios.post).mockResolvedValue({ data: "success" })
        vi.mocked(axios.delete).mockResolvedValue({ data: "success" })
    })

    it("保存ボタンを押す => postメソッドが走る => dispatchとnavigateが呼ばれる", async () => {
        render(<EditRoutine/>)
        fireEvent.click(screen.getByTestId("save-button"))
        // postメソッドが走るか確認
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled()
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "routine/setRoutineInit"
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/createRoutine")
        })
    })

    it("削除ボタンを押す => deleteメソッドが走る => dispatch, navigate, window.scrollがそれぞれ走る", async () => {
        render(<EditRoutine/>)
        fireEvent.click(screen.getByTestId("reset1"))
        fireEvent.click(screen.getByTestId("reset2"))
        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalled()
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "routine/setRoutineInit"
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/createRoutine")
        })
    })

    it("入力、追加ボタンなど一連のどうさができるか", () => {
        render(<EditRoutine/>)
        fireEvent.change(screen.getByPlaceholderText("ルーティーン名を入力"), { target: { value: "夜"}})
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "routine/changeRoutineName",
                payload: "夜"
            })
        )
        fireEvent.click(screen.getByTestId("before-button"))
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "routine/plusBeforeRoutine"
            })
        )
        fireEvent.click(screen.getByTestId("after-button"))
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "routine/plusAfterRoutine"
            })
        )
    })

})