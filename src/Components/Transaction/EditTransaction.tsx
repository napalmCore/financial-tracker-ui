
import { Alert, Autocomplete, Box, Button, FormControl, MenuItem, Select, Stack, type SelectChangeEvent } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import type { ICategory, ITransaction } from '../../Interfaces/Interfaces';
import CheckIcon from '@mui/icons-material/Check';
import { useParams } from 'react-router';

export const EditTransaction = (props: { transactionId: number, onCancel: () => void, onEdit: () => void }) => {
    const params = useParams();
    const [CategoryId, setCategoryId] = useState<number | null>(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [transaction, setTransaction] = useState<ITransaction>({} as ITransaction);
    const [transactionType, settransactionType] = useState('');
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState('');
    const [transactionId, setTransactionId] = useState(props.transactionId);

    //TODO: Fetch categories from API
    const [Categories, setCategories] = useState<ICategory[]>([]);

    const GetCategories = () => {
        fetch(import.meta.env.VITE_API_BASE_URL + "/categories", {
            method: "GET",
        }).then((response: Response) => {
            var res = response.json() as Promise<ICategory[]>;
            res.then((categories) => {
                setCategories(categories);
            });
        });
    }

    const GetTransaction = () => {
        setIsLoading(true);
        if (transactionId) {
            fetch(import.meta.env.VITE_API_BASE_URL + "/transactions/GetById/" + transactionId, {
                method: "GET",
            }).then((response: Response) => {
                var res = response.json() as Promise<ITransaction>;
                res.then((transaction) => {
                    setTransaction(transaction);
                    settransactionType(transaction.typeId);
                    setAmount(transaction.amount);
                    setDescription(transaction.description);
                    setCategoryId(transaction.category?.id);
                    setIsLoading(false);
                }).catch(() => {
                    setIsLoading(false);
                    // Handle error (e.g., show an error message)
                    console.log("Error fetching transaction" + transactionId);
                });
            });
        }
    }

    useEffect(() => {
        GetCategories();
        GetTransaction();
    }, []);

    const handleChange = (event: SelectChangeEvent) => {
        settransactionType(event.target.value as string);
    };

    const handleSubmit = () => {
        if (formIsValid()) {
            setIsLoading(true);
            fetch(import.meta.env.VITE_API_BASE_URL + "/transactions/Update/" + transactionId, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: transactionId,
                    typeId: transactionType,
                    amount: amount,
                    description: description,
                    CategoryId: CategoryId
                })
            }).then((e: Response) => {
                var res = e.json() as Promise<ITransaction>;
                res.then((transaction) => {
                    setTransaction(transaction);
                    settransactionType(transaction.typeId);
                    setAmount(transaction.amount);
                    setDescription(transaction.description);
                    setCategoryId(transaction.category?.id);
                    setShowSuccessMessage(true);
                    props.onEdit();
                }).catch((error) => {
                    // Handle error (e.g., show an error message)
                    console.log("Error parsing response after updating transaction" + transactionId);
                    console.log(error);
                });
                setIsLoading(false);
            }).catch((e) => {
                setIsLoading(false);
                // Handle error (e.g., show an error message)
                console.log("Error updating transaction" + transactionId);
                console.log(e);
            });
        }


    }

    const onCancel = () => {
        // Reset form fields
        settransactionType(transaction.typeId);
        setAmount(transaction.amount);
        setDescription(transaction.description);
        setCategoryId(transaction.category?.id || null);
        props.onCancel();
    }

    const formIsValid = () => {
        return transactionType !== '' && amount > 0;
    }

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Alert icon={<CheckIcon fontSize="inherit" />} severity="success"
                sx={{ display: showSuccessMessage ? 'flex' : 'none', mb: 2 }}
                onClose={() => { setShowSuccessMessage(false) }}>
                Transaction added successfully!
            </Alert>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <Select
                    error={transactionType === ''}
                    labelId="demo-simple-select-label"
                    id="transaction-type-select"
                    value={transactionType || ''}
                    label="Type"
                    onChange={handleChange}
                    required
                >
                    <MenuItem value={1}>Debit</MenuItem>
                    <MenuItem value={2}>Credit</MenuItem>
                </Select>
                <TextField
                    error={amount <= 0}
                    onChange={e => setAmount(e.target.value as unknown as number)}
                    id="outlined-number"
                    label="Number Field"
                    type="number"
                    value={amount}
                    required
                />

                <Autocomplete
                    disablePortal
                    options={Categories}
                    sx={{ width: 300 }}
                    getOptionLabel={e => e.name}
                    renderInput={(params) => <TextField {...params} label="Category" />}
                    value={Categories.find(c => c.id === CategoryId) || null}
                    onChange={(event, value) => {
                        if (value) {
                            setCategoryId(value.id);
                        }
                    }}
                />

                <TextField
                    id="outlined-multiline-static"
                    label="Description"
                    multiline
                    rows={4}
                    onChange={e => setDescription(e.target.value)}
                    value={description}
                />

                <Stack spacing={2} direction="row">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit} // Use onClick for validation check
                        disabled={!formIsValid() || isLoading == true} // Disable button if form is not valid or loading

                    >
                        Submit
                    </Button>
                    <Button variant="outlined" onClick={() => { onCancel() }}>
                        Cancel
                    </Button>
                </Stack>

            </FormControl>
        </Box>
    );
}