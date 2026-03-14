interface LoginInit {
    userId: string;
    googleLogin: boolean;
}

const loginInitState: LoginInit = {
    userId: localStorage.getItem("userId") ?? "",
    googleLogin: true,
}

export default loginInitState