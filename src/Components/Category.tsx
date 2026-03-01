import { useEffect, useState } from "react";
import {type Category} from "../Interfaces/Category.ts";

export default function Category() {

    const [categories, setCategories] = useState<Category[]>([]);
    let baseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        fetch(baseUrl + "/FinancialTracker", {
            method : "GET",
        }).then((response : Response) => {
            var res = response.json() as Promise<Category[]>;

            res.then((categories : Category[]) => {
                console.log(categories);
                setCategories(categories);
            }).catch((err) => {
                console.log("Error parsing response");
                console.log(err);
            });
        });
    }, []);

    return (
        <div>
        <h1>Welcome to my app</h1>
        {categories.map((category) => {
            return <div key={category.id}>
                <h2>{category.name}</h2>
            </div>
    })}
        </div>
    );
}