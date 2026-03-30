import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Category from './Category.tsx';
import { Transaction } from './Transaction/Transaction.tsx';
import { AddTransaction } from './Transaction/AddTransaction.tsx';
import { EditTransaction } from './Transaction/EditTransaction.tsx';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Category />} />
                <Route path="/transactions" element={<Transaction />} />
                <Route path="/add-transaction" element={<AddTransaction />} />
                <Route path="/transaction/:transactionId" element={<EditTransaction />} />
            </Routes>
        </BrowserRouter>
    );
}