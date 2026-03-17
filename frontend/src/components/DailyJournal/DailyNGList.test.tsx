import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import DailyNGList from './DailyNGList';
import * as ReduxHooks from '../../hooks/ReduxHooks';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));
vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');

describe("DailyNGListのテスト", () => {

    const mockDispatch = vi.fn();
    
    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(ReduxHooks, "useAppSelector").mockImplementation((selector) => {
            const mockState = {
                login: { userId: "testUser"},
                color: { color: "blue"},
                dailyJournal: {
                    importList: [
                        { listId: "r1", listName: "テスト前日", list: ["ゲームをしない", "youtubeを見ない"] },
                        { listId: "r2", listName: "日曜日", list: ["午前はスマホを見ない"] }
                    ],
                    importListCheck: [true, false],
                    addList: ["ネットサーフィンしない", "昼寝を30分以上しない"],
                    addListCheck: [false, true]
                }
            }
            // @ts-expect-error: テスト用に一部のStateのみをモックしているため.
            return selector(mockState)
        })
        vi.spyOn(ReduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch)
        vi.mocked(axios.get).mockResolvedValue({
            data: [
                { listId: "db1", listName: "テスト1週間前", list: ["ゲームは2時間までにする", "朝はyoutubeを見ない"]},
                { listId: "db2", listName: "土曜日", list: ["夜はスマホ見ない"]}
            ]
        })
    })

    it("入力欄に入力 => 名前が部分一致するものが出てきてクリックする => dispatchが呼ばれる", async () => {
        render(<DailyNGList/>)
        await waitFor(() => expect(axios.get).toHaveBeenCalled())
        await new Promise((resolve) => setTimeout(resolve, 10))
        // 入力欄に入力
        fireEvent.change(screen.getByPlaceholderText("作った禁止リストを入力"), { target: { value: "テ" } })
        // 部分一致しているものに、テスト１週間前があるか調べる
        expect(screen.getByText("テスト1週間前")).toBeInTheDocument()
        // それをクリックしたら、addImportNGが呼ばれるか調べる
        fireEvent.click(screen.getByText("テスト1週間前"))
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "dailyJournal/addImportNG",
                payload: expect.objectContaining({ listId: "db1", listName: "テスト1週間前"})
            })
        )
    })
    
    it("×ボタンを押す => 入力欄を空にする => 候補リストが消える", async () => {
        render(<DailyNGList/>)
        // getメソッドが呼ばれたかどうか
        await waitFor(() => expect(axios.get).toHaveBeenCalled())
        // 入力欄に入力
        fireEvent.change(screen.getByPlaceholderText("作った禁止リストを入力"), { target: { value : "テ"}})
        // そしたら、テスト1週間前が表示されるかを確認
        expect(screen.queryByText('テスト1週間前')).not.toBeInTheDocument();
        // ×ボタンをクリック
        fireEvent.click(screen.getByTestId("clear-button"))
        // 入力欄が空になったのかを確認
        expect(screen.getByPlaceholderText("作った禁止リストを入力")).toHaveValue("")
        // 候補リストから、テスト1週間前が消えたかを確認
        expect(screen.queryByText("筋トレ")).not.toBeInTheDocument()
    })

    it("表示されたリストの削除ボタンを押す => そのリストだけ削除するdispatchが呼ばれる", async () => {
        render(<DailyNGList/>)
        await waitFor(() => expect(axios.get).toHaveBeenCalled())
        // importListのものがちゃんと表示されているか初期状態を確認
        expect(screen.getByText("テスト前日")).toBeInTheDocument()
        expect(screen.getByText("日曜日")).toBeInTheDocument()
        // 削除ボタンを押す
        fireEvent.click(screen.getByTestId("clear-importNG-0"))
        // dispatchがちゃんと正しい引数で呼ばれたのかを確認
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "dailyJournal/deleteImportNG",
                payload: expect.objectContaining({ listId: "r1", i: 0 })
            })
        )
    })
})