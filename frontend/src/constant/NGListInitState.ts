export interface NGListInitStateInterface {
    listId: string;
    userId: string;
    listName: string;
    list: string[];
    createdAt: string;
    updatedAt: string;
}

const NGListInitState: NGListInitStateInterface = {
    listId: crypto.randomUUID(),
    userId: localStorage.getItem("userId") ?? "",
    listName: "",
    list: [""],
    createdAt: "",
    updatedAt: ""
}

export default NGListInitState