import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import EditNGList from './EditNGList';
import * as ReduxHooks from '../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe("EditNGListのテスト", () => {
    const mockDispatch = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()

        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
                NGList: {
                    listId: "r1",
                    listName: "サンプル1",
                    list: ["A", "B"]
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
        render(<EditNGList/>)
        fireEvent.click(screen.getByTestId("save-button"))
        // postメソッドが走るか確認
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled()
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "NGList/setNGInit"
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/createNGList")
        })
    })

    it("削除ボタンを押す => deleteメソッドが走る => dispatch, navigate, window.scrollがそれぞれ走る", async () => {
        render(<EditNGList/>)
        fireEvent.click(screen.getByTestId("reset1"))
        fireEvent.click(screen.getByTestId("reset2"))
        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalled()
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "NGList/setNGInit"
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/createNGList")
        })
    })

    it("入力、追加ボタンなど一連のどうさができるか", () => {
        render(<EditNGList/>)
        fireEvent.change(screen.getByPlaceholderText("禁止リスト名を入力"), { target: { value: "サンプル2"}})
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "NGList/changeListName",
                payload: "サンプル2"
            })
        )
        fireEvent.click(screen.getByTestId("plus-button"))
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "NGList/plusList"
            })
        )
    })

})