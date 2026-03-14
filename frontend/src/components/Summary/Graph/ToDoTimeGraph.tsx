import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAppSelector } from '../../../hooks/ReduxHooks';

interface Props {
    graphData: {
        targetDate: string;
        toDoTime: number;
    }[]
}


const ToDoTimeGraph = ({ graphData }: Props) => {
    
    const selectedColor = useAppSelector((state) => state.color.color)

    const formatTime = (totalMinutes: number | undefined) => {
        if (totalMinutes === undefined) return ""
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        // padStart(2, '0') で、1桁の時に「0」を埋めて「05」のようにします
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }

    const chartData = [...(Array.isArray(graphData) ? graphData : [])].reverse().map((data) => {
        const dateStr = new Date(data.targetDate);
        const displayDate = `${dateStr.getFullYear()}/${dateStr.getMonth() + 1}/${dateStr.getDate()}`; // 例: "2/28"

        return {
            date: displayDate,
            toDoTime: data.toDoTime // 👈 ここは数値（分）のまま渡すのが重要！
        }
    })

    // 2. テーマカラーの決定
    let mainColor = "#f472b6"; // デフォルト（pink）
    if (selectedColor === "blue") mainColor = "#0ea5e9";
    if (selectedColor === "whiteBlack") mainColor = "#4b5563";

    return (
        <div className="w-full h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
                {/* LineChart に変更し、left マージンを大きく確保 */}
                <LineChart 
                    data={chartData} 
                    margin={{ top: 20, right: 20, left: 30, bottom: 5 }} // leftを30へ変更
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    
                    <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#6b7280', fontSize: 12 }} 
                        tickMargin={10}
                    />
                    
                    <YAxis 
                        tickFormatter={formatTime} 
                        tick={{ fill: '#6b7280' }}
                        domain={[0, 'dataMax']} // Y軸の下限を0に固定
                    />
                    
                    <Tooltip 
                        formatter={(value: number | undefined) => [formatTime(value), "作業時間"]} 
                        labelStyle={{ color: mainColor, fontWeight: 'bold' }} 
                    />
                    
                    {/* Bar から Line へ変更 */}
                    <Line 
                        type="monotone" // なめらかな曲線にする
                        dataKey="toDoTime" 
                        name="作業時間" 
                        stroke={mainColor} 
                        strokeWidth={3} // 線を少し太く
                        dot={{ r: 4, strokeWidth: 2 }} // データポイントの丸を強調
                        activeDot={{ r: 6 }} // ホバー時の丸を大きく
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ToDoTimeGraph