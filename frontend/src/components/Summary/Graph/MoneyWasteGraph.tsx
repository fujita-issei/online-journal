import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppSelector } from '../../../hooks/ReduxHooks';

interface Props {
    wasteData: {
        targetDate: string;
        waste: number;
    }[]
}

const MoneyWasteGraph = ({ wasteData }: Props) => {
    
    // テーマカラーを取得
    const selectedColor = useAppSelector((state) => state.color.color);

    // 1. グラフ用にデータを整形（反復エラー防止 ＆ 日付フォーマット）
    // ※もし親コンポーネントで「新しい日付順(降順)」になっている場合は、
    // 左から右へ時系列になるよう .reverse() でひっくり返します。
    const chartData = [...(Array.isArray(wasteData) ? wasteData : [])].reverse().map((data) => {
        const dateStr = new Date(data.targetDate);
        const displayDate = `${dateStr.getFullYear()}/${dateStr.getMonth() + 1}/${dateStr.getDate()}` // 例: "2/28"

        return {
            date: displayDate,
            waste: data.waste // Y軸用のデータ（投資額）
        }
    });

    // 2. テーマカラーの決定
    let mainColor = "#f472b6"; // デフォルト（pink）
    if (selectedColor === "blue") mainColor = "#0ea5e9";
    if (selectedColor === "whiteBlack") mainColor = "#4b5563";

    return (
        <div className="w-full h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                    data={chartData} 
                    // 💡 投資額は桁が増えやすいので、左側(left)の余白を「40〜50」と広めに確保します！
                    margin={{ top: 20, right: 20, left: 10, bottom: 5 }} 
                >
                    {/* 横の補助線 */}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    
                    {/* X軸（日付） */}
                    <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#6b7280', fontSize: 12 }} 
                        tickMargin={10}
                    />
                    
                    {/* Y軸（投資額） */}
                    <YAxis 
                        tick={{ fill: '#6b7280' }}
                        domain={[0, 'auto']} // 最低値を0に固定
                        // 💡 金額を見やすくするためにカンマ区切りにする (例: 10000 -> 10,000)
                        tickFormatter={(value) => value.toLocaleString()}
                    />
                    
                    {/* ツールチップ（ホバー時の吹き出し） */}
                    <Tooltip 
                        // 💡 ここでもカンマ区切りにしつつ、単位（円など）を付けます
                        formatter={(value: number | undefined) => {
                            // もしデータがない（undefined）なら、0円にしておく等の安全対策を入れる
                            if (value === undefined) return ["", "浪費額"];
                            return [`${value.toLocaleString()} 円`, "浪費額"];
                        }}
                        labelStyle={{ color: mainColor, fontWeight: 'bold' }} 
                        cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }} 
                    />
                    
                    {/* 折れ線グラフの線 */}
                    <Line 
                        type="monotone" // なめらかな曲線
                        dataKey="waste" 
                        name="浪費額" 
                        stroke={mainColor} 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2 }} 
                        activeDot={{ r: 6 }} 
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MoneyWasteGraph;