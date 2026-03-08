import { useEffect, useState } from "react";
import {type ICategory} from "../Interfaces/Interfaces.ts";

export default function Category() {

    const [categories, setCategories] = useState<ICategory[]>([]);
    let baseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        fetch(baseUrl + "/categories", {
            method : "GET",
        }).then((response : Response) => {
            var res = response.json() as Promise<ICategory[]>;

            res.then((categories : ICategory[]) => {
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