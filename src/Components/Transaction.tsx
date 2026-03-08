import { useEffect, useState } from "react";
import { type ITransaction} from "../Interfaces/Interfaces.ts";
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { AddCircle } from "@mui/icons-material";

export const Transaction = () => {

    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    let baseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        fetch(baseUrl + "/transactions", {
            method : "GET",
        }).then((response : Response) => {
            var res = response.json() as Promise<ITransaction[]>;

            res.then((transactions : ITransaction[]) => {
                console.log(transactions);
                setTransactions(transactions);
            }).catch((err) => {
                console.log("Error parsing response");
                console.log(err);
            });
        });
    }, []);

    return (
        <>
        <IconButton aria-label="delete">
        <AddCircle/>
        </IconButton>
        <DataGrid
            rows={transactions}
            columns={[
                { field: 'id', headerName: 'ID', width: 70 },
                { field: 'amount', headerName: 'Amount', width: 130 },
                { field: 'date', headerName: 'Date', width: 130 },
                { field: 'categoryId', headerName: 'Category ID', width: 130 },
                { field: 'description', headerName: 'Description', width: 200 },
            ]}
        />
        </>
    );
} 