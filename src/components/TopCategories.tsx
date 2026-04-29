import { Link } from "react-router-dom"

interface TopCategory {
  id: string;
  name: string;
  image: string;
}

interface TopCategoriesProps {
  categories: TopCategory[];
}

export default function TopCategories({ categories }: TopCategoriesProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-start mb-12">
          <h2 className="text-3xl font-semibold text-[#1A74BB] mb-4">Top Categories</h2>
          <p className="text-black font-normal text-sm">Explore top trusted brands in IT products, all in one place.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={`/products?category=${category.id}`} className="group">
              <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200 h-full">
                <div className="aspect-[4/3] mb-3 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    width={300}
                    height={225}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="h-12 flex items-center justify-center">
                  <h3 className="font-semibold text-center text-gray-800 text-sm md:text-base leading-tight">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
