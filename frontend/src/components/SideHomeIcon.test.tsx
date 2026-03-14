import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import SideHomeIcon from './SideHomeIcon';
import * as ReduxHooks from '../hooks/ReduxHooks';

vi.mock('axios');
vi.mock('../hooks/ReduxHooks');
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock("../func/checkJournalWritten", () => ({
    default: vi.fn(() => false)
}))
vi.mock("../func/checkWeekJournalWritten", () => ({
    default: vi.fn(() => false)
}))
vi.mock("../func/checkMonthYearJournalWritten", () => ({
    default: vi.fn(() => false)
}))
vi.mock("../constant/menuList", () => ({
    default: [
        "ホーム", "ジャーナルを作成", "ルーティーンを作成", "禁止リストを作成", "過去のジャーナルを見る", 
        "サマリーを見る", "設定", "使い方ガイド", "お問い合わせフォーム"
    ]
}))
vi.mock("../constant/menuURL", () => ({
    default: [
        { menu: "ホーム", url : "/"},
        { menu: "ジャーナルを作成", url : "/createJournal" },
        { menu: "ルーティーンを作成", url : "/createRoutine" },
        { menu: "禁止リストを作成", url : "/createNGList"},
        { menu: "過去のジャーナルを見る", url: "/watchPastJournal"},
        { menu: "サマリーを見る", url : "/watchSummary"},
        { menu: "プロフィール", url : "/profile"},
        { menu: "投稿", url: "/post"},
        { menu: "検索", url: "/search"},
        { menu: "通知", url: "/notice"},
        { menu: "フレンドリスト", url : "/friendsList"},
        { menu: "メッセージ", url : "/message"},    
        { menu: "保存した投稿", url : "/saved"},
        { menu: "設定", url: "/setting"},
        { menu: "使い方ガイド", url : "/guide"},
        { menu: "お問い合わせフォーム", url : "/form"}
    ]
}))
vi.mock("./childComp/DisplayTheme", () => ({
    default: () => <div>ダミーアイコン</div>
}))

describe("SideHomeIconのテスト", () => {

    const mockDispatch = vi.fn();
    let mockSelectedMenu = "ジャーナルを作成"
    
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(Storage.prototype, "setItem")
        vi.spyOn(ReduxHooks, 'useAppSelector').mockImplementation((selector) => {
            const mockState = {
                color: { color: 'blue' },
                Menu: { selectedMenu: mockSelectedMenu, isClickedMenu: true },
                dailyJournal: { 
                    userId: "testUser",
                    targetDate: "2026-03-07",
                    getUpHour: 7,
                    getUpMin: 0,
                    goBedHour: 23,
                    goBedMin: 0,
                    routine: [],
                    routineCheck: [],
                    toDoTimeHour: 0,
                    toDoTimeMin: 0,
                    startToDoHour: 8,
                    startToDoMin: 0,
                    endToDoHour: 12,
                    endToDoMin: 0,
                    toDoTimeCheck: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
                    toDoList: [],
                    toDoListCheck: [],
                    toDoListImportant: [],
                    importList: [],
                    importListCheck: [],
                    addList: [],
                    addListCheck: [],
                    journal: [],
                    journalCount: [0],
                    journalLastEditTime: [""],
                    moneyInvestment: 0,
                    moneyWaste: 0,
                    moneyConsumption: 0,
                    moneyUseSum: 0,
                    isWritten: true,
                    createdAt: "",
                    updatedAt: ""
                },
                weekJournal: {
                    userId: "testUser",
                    startDate: "2026-03-02",
                    endDate: "2026-03-08",
                    toDo: [],
                    toDoCheck: [],
                    toDoImportant: [],
                    journal: [],
                    journalCount: [],
                    journalLastEditTime: [""],
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
                    },
                    isWritten: true,
                    createdAt: "",
                    updatedAt: ""
                },
                monthJournal: {
                    userId: "testUser",
                    targetDate: "2026-03",
                    toDo: [],
                    toDoCheck: [],
                    toDoImportant: [],
                    journal: [],
                    journalCount: [],
                    journalLastEditTime: [""],
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
                    },
                    isWritten: true,
                    createdAt: "",
                    updatedAt: ""
                },
                yearJournal: {
                    userId: "testUser",
                    targetDate: "2026",
                    toDo: [],
                    toDoCheck: [],
                    toDoImportant: [],
                    journal: [],
                    journalCount: [],
                    journalLastEditTime: [""],
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
                    },
                    isWritten: true,
                    createdAt: "",
                    updatedAt: ""
                },
                routine: {
                    routineId: "r1",
                    userId: "testUser",
                    routineName: "サンプル",
                    targetTimeHour: 0,
                    targetTimeMin: 0,
                    routine: [""],
                    routineTime: [10],
                    createdAt: "",
                    updatedAt: ""
                },
                NGList: {
                    listId: "r1",
                    userId: "testUser",
                    listName: "サンプル",
                    list: [""],
                    createdAt: "",
                    updatedAt: ""
                }
            };
            // @ts-expect-error: テスト用に一部のStateのみをモックしているため
            return selector(mockState);
        });
        vi.spyOn(ReduxHooks, 'useAppDispatch').mockReturnValue(mockDispatch);
        vi.mocked(axios.post).mockResolvedValue({ data: "success" })
    });

    it("ジャーナルを選択 => 他のをクリック => postメソッドが走る => localStorage, dispatch, navigateが走る", async () => {
        render(<SideHomeIcon/>)
        fireEvent.click(screen.getByTestId("ホーム-button"))
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith("/api/dailyJournal/saveTodayJournal",
                expect.objectContaining({
                    userId: "testUser",
                    targetDate: "2026-03-07",
                    isWritten: true,
                    getUpHour: 7
                })
            )
            expect(axios.post).toHaveBeenCalledWith("/api/weekJournal/saveThisWeek",
                expect.objectContaining({
                    userId: "testUser",
                    startDate: "2026-03-02",
                    endDate: "2026-03-08",
                    isWritten: true,
                    toDo: []
                })
            )
            expect(axios.post).toHaveBeenCalledWith("/api/monthJournal/saveThisMonth",
                expect.objectContaining({
                    userId: "testUser",
                    targetDate: "2026-03-01",
                    isWritten: true,
                    toDo: []
                })
            )
            expect(axios.post).toHaveBeenCalledWith("/api/yearJournal/saveThisYear",
                expect.objectContaining({
                    userId: "testUser",
                    targetDate: "2026-01-01",
                    isWritten: true,
                    toDo: []
                })
            )
            expect(localStorage.setItem).toHaveBeenCalledWith("currentPage", "ホーム")
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "Menu/setSelectedMenu",
                    payload: "ホーム"
                })
            )
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "Menu/toggleIsClicked"
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/")
        })
    })

    it("ルーティーンを選択 => 他のをクリック => postメソッドが走る => localStorage, dispatch, navigateがそれぞれ呼ばれる", async () => {
        mockSelectedMenu = "ルーティーンを作成"
        render(<SideHomeIcon/>)
        fireEvent.click(screen.getByTestId("ホーム-button"))
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith("/api/routine/save", 
                expect.objectContaining({
                    userId: "testUser",
                    routineName: "サンプル"
                })
            )
            expect(localStorage.setItem).toHaveBeenCalledWith("currentPage", "ホーム")
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "Menu/setSelectedMenu",
                    payload: "ホーム"
                })
            )
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "Menu/toggleIsClicked"
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/")
        })
    })

    it("禁止リストを作成を選択 => 他のをクリック => postメソッドが走る => localStorage, dispatch, navigateがそれぞれ呼ばれる", async () => {
        mockSelectedMenu = "禁止リストを作成"
        render(<SideHomeIcon/>)
        fireEvent.click(screen.getByTestId("ホーム-button"))
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith("/api/NGList/save", 
                expect.objectContaining({
                    userId: "testUser",
                    listName: "サンプル"
                })
            )
            expect(localStorage.setItem).toHaveBeenCalledWith("currentPage", "ホーム")
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "Menu/setSelectedMenu",
                    payload: "ホーム"
                })
            )
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: "Menu/toggleIsClicked"
                })
            )
            expect(mockNavigate).toHaveBeenCalledWith("/")
        })
    })

})