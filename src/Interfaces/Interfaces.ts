export interface ICategory {
    id: number,
    name : string
}

export interface ITransaction {
    id: number,
    amount: number,
    date: string,
    category: ICategory,
    description: string
}