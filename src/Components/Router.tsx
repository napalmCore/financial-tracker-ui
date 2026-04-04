import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Transaction } from './Transaction/Transaction.tsx';
import { AddTransaction } from './Transaction/AddTransaction.tsx';
import { EditTransaction } from './Transaction/EditTransaction.tsx';
import MainGrid from '../dashboard/components/MainGrid.tsx';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainGrid />} />
                <Route path="/transactions" element={<Transaction />} />
                <Route path="/add-transaction" element={<AddTransaction />} />
                <Route path="/transaction/:transactionId" element={<EditTransaction />} />

            </Routes>
        </BrowserRouter>
    );
}