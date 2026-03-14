import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import DailyRoutine from './DailyRoutine';
import * as ReduxHooks from '../../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

describe("DailyRoutineのテスト", () => {

    const mockDispatch = vi.fn();
    
    beforeEach(() => {
        vi.clearAllMocks();
        window.scrollTo = vi.fn();
        vi.spyOn(ReduxHooks, 'useAppSelector').mockImplementation((selector) => {
            const mockState = {
                login: { userId: 'testUser' },
                color: { color: 'blue' },
                dailyJournal: { 
                    targetDate: '2026-03-03',
                    routine: [
                        { routineId: 'r1', routineName: '朝の散歩', targetTimeHour: 0, targetTimeMin: 30, routine: [], routineTime: [] },
                        { routineId: 'r2', routineName: '夜の読書', targetTimeHour: 1, targetTimeMin: 0, routine: [], routineTime: [] }
                    ],
                    routineCheck: [false, false]
                }
            };
            // @ts-expect-error: テスト用に一部のStateのみをモックしているため
            return selector(mockState);
        });
        vi.spyOn(ReduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
        (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: [
                { routineId: 'db1', routineName: '筋トレ', targetTimeHour: 1, targetTimeMin: 0, routine: [], routineTime: [] },
                { routineId: 'db2', routineName: 'ストレッチ', targetTimeHour: 0, targetTimeMin: 15, routine: [], routineTime: [] }
            ]
        });
    });

    it("入力欄に入力 => 名前が部分一致しているルーティーンが出てくる => クリックするとそれが追加される", async () => {
        render(<DailyRoutine/>)
        // getAllRoutineのAPIが呼ばれるかどうか
        await waitFor((() => expect(axios.get).toHaveBeenCalled()))
        await new Promise((resolve) => setTimeout(resolve, 10))
        const input = screen.getByPlaceholderText("作ったルーティーン名を入力")
        // 筋トレを部分一致させる
        fireEvent.change(input, { target: { value: "筋"}})
        // 部分一致しているリストに筋トレがあるのかどうかを調べる
        expect(screen.getByText("筋トレ")).toBeInTheDocument()
        // 筋トレをクリックしたら、追加されるかどうかを調べる
        fireEvent.click(screen.getByText("筋トレ"))
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "dailyJournal/addRoutine",
                payload: expect.objectContaining({ routineName: '筋トレ' })
            })
        )
    })

    it("×ボタンを押す => 入力欄が空になって名前が部分一致しているルーティーンが消えて、候補リストが消える", async () => {
        render(<DailyRoutine />);
        await waitFor(() => expect(axios.get).toHaveBeenCalled());
        const input = screen.getByPlaceholderText('作ったルーティーン名を入力');
        fireEvent.change(input, { target: { value: '筋' } });
        // 筋トレが出ているかを確認
        expect(screen.getByText("筋トレ")).toBeInTheDocument()
        // 削除ボタンをクリック
        fireEvent.click(screen.getByTestId("clear-button"))
        // 入力欄が空になり、筋トレが消えたかどうか
        expect(input).toHaveValue("")
        expect(screen.queryByText("筋トレ")).not.toBeInTheDocument()
    })

    it("削除ボタンを押す => そのルーティーンを消すdeleteRoutineが呼ばれる", async () => {
        render(<DailyRoutine/>)
        // 今現在routine stateにある2つがちゃんと表示されるのかを確認
        expect(screen.getByText("朝の散歩")).toBeInTheDocument()
        expect(screen.getByText("夜の読書")).toBeInTheDocument()
        // i = 1である夜の読書の削除ボタンをクリックする
        fireEvent.click(screen.getByTestId("delete-button-1"))
        // deleteRoutineが呼ばれるかを確認
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "dailyJournal/deleteRoutine",
                payload: expect.objectContaining({ routineId: "r2", i: 1})
            })
        )
    })

    it("新しいルーティーンを作成を押す => 保存APIが呼ばれる => navigate先にいく", async () => {
        (axios.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: "success"})
        render(<DailyRoutine/>)
        // 作成ボタンをクリックする
        fireEvent.click(screen.getByText("新たにルーティーンを作成"))
        // 保存するAPIが呼ばれるのを待つ
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled()
        })
        // stateを初期化するdispatchが呼ばれたのかを確認
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "routine/setRoutineInit"
            })
        )
        // navigateで正しいURLに飛んだのかを確認
        expect(mockNavigate).toHaveBeenCalledWith("/createRoutine")
    })
    
})