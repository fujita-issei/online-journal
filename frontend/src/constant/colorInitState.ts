interface ColorInit {
    color: string
}

const colorInitState: ColorInit = {
    color: localStorage.getItem("color") ?? ""
}

export default colorInitState