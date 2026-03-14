// 日付データを整形する
const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year} / ${month} / ${day}`
}

export default formatDate