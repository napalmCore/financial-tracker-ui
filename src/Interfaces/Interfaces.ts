import { Category } from "@mui/icons-material"

export interface ICategory {
    id: number,
    name : string
}

export interface ITransaction {
    id: number,
    amount: number,
    date: string,
    category: ICategory,
    description: string,
    typeId: string
}

export interface TransactionsGroupedByCategory {
    id: number,
    amount: number,
    date: Date,
    description: string,
    category: ICategory,
    typeId: number
}