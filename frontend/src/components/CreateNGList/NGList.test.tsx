import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import NGList from './NGList';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe("NGListのテスト", () => {
    const mockDispatch = vi.fn()
    const mockGetNGList = vi.fn()
    const mockList = {
        listId: "r1",
        userId: "testUser",
        listName: "テスト前",
        list: ["スマホ見ない", "ゲームしない"],
        createdAt: "2026-03-03",
        updatedAt: "2026-03-03"
    }

    beforeEach(() => {
        vi.clearAllMocks()
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

    it("編集ボタンを押す => dispatch, navigateが飛ぶ", () => {
        render(<NGList _list = {mockList} getNGList = {mockGetNGList}/>)
        fireEvent.click(screen.getByTestId("edit-button"))
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "NGList/setList",
                payload: expect.objectContaining({
                    listId: "r1",
                    listName: "テスト前",
                    list: ["スマホ見ない", "ゲームしない"],
                    createdAt: "2026-03-03",
                    updatedAt: "2026-03-03"
                })
            })
        )
        expect(mockNavigate).toHaveBeenCalledWith("/createNGList/edit")
    })

    it("削除ボタンを押す => deleteメソッドが飛ぶ => dispatchが飛ぶ", async () => {
        render(<NGList _list = {mockList} getNGList = {mockGetNGList}/>)
        fireEvent.click(screen.getByTestId("reset1"))
        fireEvent.click(screen.getByTestId("reset2"))
        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalled()
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "NGList/setNGInit"
                })
            )
        })
    })

})