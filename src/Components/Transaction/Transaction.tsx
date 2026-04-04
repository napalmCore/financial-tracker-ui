import { useEffect, useState } from "react";
import { type ITransaction } from "../../Interfaces/Interfaces.ts";
import { DataGrid, GridActionsCellItem, type GridColDef, type GridRowId } from '@mui/x-data-grid';
import { Box, IconButton, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { AddCircle, Delete, Edit } from "@mui/icons-material";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

export const Transaction = () => {

    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    let baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [showConfirmation, setshowConfirmation] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<GridRowId | null>(null);

    const handleClickOpen = (id: GridRowId) => {
        setshowConfirmation(true);
        setTransactionToDelete(id);
    };

    const handleClose = () => {
        setshowConfirmation(false);
        setTransactionToDelete(null);
    };
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

    const handleDelete = () => {
        fetch(baseUrl + "/transactions/Delete/" + transactionToDelete, {
            method: "DELETE",
        }).then(() => { }).catch(() => {
            // Handle error (e.g., show an error message)
        });
        setTransactions(transactions.filter(transaction => transaction.id !== transactionToDelete));
        setshowConfirmation(false);
    }

    return (

        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <IconButton aria-label="add transaction" color="primary">
                <AddCircle onClick={() => {
                    window.location.href = "/add-transaction";
                }} />
            </IconButton>
            <Dialog
                open={showConfirmation}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Deletion"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this transaction?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => handleDelete()} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
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
                        getActions: (params ) => [
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
                                onClick={() => handleClickOpen(params.id)}
                                color="inherit"
                            />,
                        ],
                    },
                ]}
            />
        </Box>
    );  
} 