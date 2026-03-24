import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Category from './Category.tsx';
import { Transaction } from './Transaction.tsx';
import { AddTransaction } from './AddTransaction.tsx';

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Category />} />
                <Route path="/transactions" element={<Transaction />} />
                <Route path="/add-transaction" element={<AddTransaction />} />
            </Routes>
        </BrowserRouter>
    );
}