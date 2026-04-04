import { useEffect, useState } from "react";
import { type ITransaction } from "../../Interfaces/Interfaces.ts";
import { DataGrid, GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import { Box, IconButton } from '@mui/material';
import { AddCircle, Delete, Edit } from "@mui/icons-material";

export const Transaction = () => {

    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    let baseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        fetch(baseUrl + "/transactions", {
            method: "GET",
        }).then((response: Response) => {
            var res = response.json() as Promise<ITransaction[]>;

            res.then((transactions: ITransaction[]) => {
                console.log(transactions);
                setTransactions(transactions);
            }).catch((err) => {
                console.log("Error parsing response");
                console.log(err);
            });
        });
    }, []);

    const handleEdit = (id: number | string) => {
        window.location.href = "/transaction/" + id;
    }

    const handleDelete = (id: number | string) => {

        fetch(baseUrl + "/transactions/Delete/" + id, {
            method: "DELETE",
        }).then(() => { }).catch(() => {
            // Handle error (e.g., show an error message)
        });
        setTransactions(transactions.filter(transaction => transaction.id !== id));
    }

    return (

        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <IconButton aria-label="add transaction" color="primary">
                <AddCircle onClick={() => {
                    window.location.href = "/add-transaction";
                }} />
            </IconButton>
            <DataGrid
                rows={transactions}
                columns={[
                    { field: 'id', headerName: 'ID', width: 70 },
                    { field: 'amount', headerName: 'Amount', width: 130 },
                    { field: 'date', headerName: 'Date', width: 130 },
                    { field: 'Category', headerName: 'Category', width: 130, valueGetter: (value, row) => `${row.category?.name || ''}`, },
                    { field: 'description', headerName: 'Description', width: 500 },
                    {
                        field: 'actions',
                        type: 'actions',
                        headerName: 'Actions',
                        width: 100,
                        cellClassName: 'actions',
                        getActions: (params) => [
                            <GridActionsCellItem
                                key="edit"
                                icon={<Edit />}
                                label="Edit"
                                onClick={() => handleEdit(params.id)}
                                color="inherit"
                            />,
                            <GridActionsCellItem
                                key="delete"
                                icon={<Delete />}
                                label="Delete"
                                onClick={() => handleDelete(params.id)}
                                color="inherit"
                            />,
                        ],
                    },
                ]}
            />
        </Box>
    );
} 