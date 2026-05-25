/* import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge"; 

// Define the TypeScript interface for the table rows
interface Product {
  id: number; // Unique identifier for each product
  name: string; // Product name
  variants: string; // Number of variants (e.g., "1 Variant", "2 Variants")
  category: string; // Category of the product
  price: string; // Price of the product (as a string with currency symbol)
  // status: string; // Status of the product
  image: string; // URL or path to the product image
  status: "Delivered" | "Pending" | "Canceled"; // Status of the product
}

// Define the table data using the interface
const tableData: Product[] = [
  {
    id: 1,
    name: "MacBook Pro 13”",
    variants: "2 Variants",
    category: "Laptop",
    price: "$2399.00",
    status: "Delivered",
    image: "/images/product/product-01.jpg", // Replace with actual image URL
  },
  {
    id: 2,
    name: "Apple Watch Ultra",
    variants: "1 Variant",
    category: "Watch",
    price: "$879.00",
    status: "Pending",
    image: "/images/product/product-02.jpg", // Replace with actual image URL
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max",
    variants: "2 Variants",
    category: "SmartPhone",
    price: "$1869.00",
    status: "Delivered",
    image: "/images/product/product-03.jpg", // Replace with actual image URL
  },
  {
    id: 4,
    name: "iPad Pro 3rd Gen",
    variants: "2 Variants",
    category: "Electronics",
    price: "$1699.00",
    status: "Canceled",
    image: "/images/product/product-04.jpg", // Replace with actual image URL
  },
  {
    id: 5,
    name: "AirPods Pro 2nd Gen",
    variants: "1 Variant",
    category: "Accessories",
    price: "$240.00",
    status: "Delivered",
    image: "/images/product/product-05.jpg", // Replace with actual image URL
  },
]; */

export default function RecentOrders() {
  return (
    <div className="ml-auto w-fit">
      <div className="inline-block bg-gray-300 p-2 border-t-2 border-l-2 border-white border-r-2 border-b-2 border-r-gray-700 border-b-gray-700">

        <div className="flex items-center justify-between bg-blue-900 border border-black px-2 py-1 mb-4">
          <span className="text-white font-bold text-sm">
            ABOUT_ME.NFO
          </span>

          <div className="flex gap-1">
            <button className="w-5 h-5 bg-gray-300 border border-black text-xs leading-none">
              _
            </button>

            <button className="w-5 h-5 bg-gray-300 border border-black text-xs leading-none">
              □
            </button>

            <button className="w-5 h-5 bg-gray-300 border border-black text-xs leading-none">
              X
            </button>
          </div>
        </div>

        <div className="w-[320px] bg-[#c0c0c0] border-t-2 border-l-2 border-t-gray-700 border-l-gray-700 border-r-2 border-b-2 border-r-white border-b-white p-4">

          <div className="text-black text-lg leading-relaxed">
            <p className="mb-3 font-bold">
              Antoan Ignatov
            </p>

            <p className="mb-2">
              Cloud / DevOps Engineer
            </p>

            <p className="mb-2">
              Azure, AWS, Lorem, Ipsum
            </p>

            <p>
              Building lorem ipsum experiences.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
