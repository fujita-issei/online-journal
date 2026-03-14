import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '../../../hooks/ReduxHooks';


const ToDoDonePieChart = () => {

    const { toDoSummary } = useAppSelector((state) => state.summary)
    const selectedColor = useAppSelector((state) => state.color.color)

    // 1. selectedColor に合わせて「メインの色」を決定する
    let mainColor = "#f472b6"; // デフォルト（pink）
    if (selectedColor === "blue") {
        mainColor = "#38bdf8"; // 爽やかなブルー（sky-400相当）
    } else if (selectedColor === "whiteBlack") {
        mainColor = "#4b5563"; // 落ち着いたダークグレー（gray-600相当）
    }

    // 2. COLORS配列を動的に作る（1つ目が完了色、2つ目が未完了のベース色）
    // 未完了の色（#e5e7eb）は薄いグレーにしておくと、どのテーマでも綺麗に馴染みます
    const COLORS = [mainColor, '#e5e7eb'];

    // 3. グラフ用のデータを作成
    const pieData = [
        { name: '完了', value: toDoSummary.toDoDone },
        { name: '未完了', value: toDoSummary.toDoAll - toDoSummary.toDoDone },
    ];

    return (
        <div className="w-full h-48 mt-4 relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%" // 横の中心位置
                        cy="50%" // 縦の中心位置
                        innerRadius={60} // 👈 これを設定するとドーナツ型になります！(内側の円の大きさ)
                        outerRadius={80} // 👈 外側の円の大きさ
                        startAngle={90}  // 👈 12時の位置から時計回りにスタートさせるための魔法の数字
                        endAngle={-270}  // 👈 12時の位置から時計回りにスタートさせるための魔法の数字
                        dataKey="value"
                        stroke="none" // グラフの境界線を消して綺麗にする
                    >
                        {/* データの数だけ色を割り当てる */}
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            
            {/* グラフの真ん中に文字を入れたい場合は、絶対配置(absolute)で重ねるとカッコいいです！ */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-sm text-gray-500">達成率</p>
                <p className={`text-xl font-bold 
                    ${selectedColor === "blue" ? "text-sky-500" : ""} 
                    ${selectedColor === "pink" ? "text-pink-500" : ""} 
                    ${selectedColor === "whiteBlack" ? "text-gray-700" : ""}
                `}>
                    {Math.round((toDoSummary.toDoDone / toDoSummary.toDoAll) * 100)}<span className="text-sm">%</span>
                </p>
            </div>
        </div>
    )
}

export default ToDoDonePieChart
