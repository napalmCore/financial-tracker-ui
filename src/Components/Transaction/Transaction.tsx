import { useEffect, useState } from "react";
import { type ITransaction } from "../../Interfaces/Interfaces.ts";
import { DataGrid, GridActionsCellItem, type GridColDef, type GridRowId } from '@mui/x-data-grid';
import { Box, IconButton, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { AddCircle, Delete, Edit } from "@mui/icons-material";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import {AddTransaction} from "./AddTransaction.tsx";
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { EditTransaction } from "./EditTransaction.tsx";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const Transaction = () => {

    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    let baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [showConfirmation, setshowConfirmation] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<GridRowId | null>(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState<number>(0);
    const [showEditDialog, setShowEditDialog] = useState(false);

    const onAddTransaction = () => {
        // Refresh transactions after adding a new one
        fetch(baseUrl + "/transactions", {
            method: "GET",
        }).then((response: Response) => {
            return response.json();
        }).then((transactions: ITransaction[]) => {
            setTransactions(transactions);
            setShowAddDialog(false);
            setShowEditDialog(false);
        }).catch((err) => {
            console.log("Error parsing response");
            console.log(err);
        });
    }

    const handleClickOpen = (id: GridRowId) => {
        setshowConfirmation(true);
        setTransactionToDelete(id);
    };

    const handleClose = () => {
        setshowConfirmation(false);
        setTransactionToDelete(null);
        setShowAddDialog(false);
        setShowEditDialog(false);
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

    const handleEdit = (id: number) => {
        setTransactionToEdit(id);
        setShowEditDialog(true);
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
                    setShowAddDialog(true);
                }} />
            </IconButton>

            <Modal
                open={showAddDialog}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Add Transaction
                    </Typography>
                    <AddTransaction
                        onCancel={() => setShowAddDialog(false)}
                        onAdd={onAddTransaction}
                    />
                </Box>
            </Modal>

            <Modal
                open={showEditDialog}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >

                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Edit Transaction
                    </Typography>
                    <EditTransaction
                        onCancel={() => setShowEditDialog(false)}
                        onEdit={onAddTransaction}
                        transactionId={transactionToEdit}
                    />
                </Box>
            </Modal>


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
                    { field: 'description', headerName: 'Description', width: 200 },
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
                                onClick={() => handleEdit(params.id as number)}
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