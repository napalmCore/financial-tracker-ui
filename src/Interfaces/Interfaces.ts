export interface ICategory {
    id: number,
    name : string
}

export interface ITransaction {
    id: number,
    amount: number,
    date: string,
    categoryId: number,
    description: string
}