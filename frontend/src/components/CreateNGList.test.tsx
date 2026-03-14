import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import CreateNGList from './CreateNGList';
import * as ReduxHooks from '../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe("CreateNGListのテスト", () => {
    const mockDispatch = vi.fn()
    const mockNGList = [
        { listId: "db1", listName: "サンプル1", list: ["A", "B"] },
        { listId: "db2", listName: "サンプル2", list: ["C"] }
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
        vi.mocked(axios.get).mockResolvedValue({ data: mockNGList })
    })

    it("初回レンダリングする => getメソッドが呼ばれる => 取得したデータが表示される", async () => {
        render(<CreateNGList/>)
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/NGList/get", {
                params: { userId: "testUser" }
            })
            expect(screen.getAllByText("サンプル1")[0]).toBeInTheDocument()
            expect(screen.getAllByText("サンプル2")[0]).toBeInTheDocument()
        })
    })

    it("新しいルーティーンを作成を押す => dispatchとnavigateが呼ばれる", () => {
        render(<CreateNGList/>)
        fireEvent.click(screen.getByTestId("create-button"))
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "NGList/setNGInit"
            })
        )
        expect(mockNavigate).toHaveBeenCalledWith("/createNGList/edit")
    })

})