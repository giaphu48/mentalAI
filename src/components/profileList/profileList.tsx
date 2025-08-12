import { FC } from 'react';

interface Employee {
  id: string;
  avatar: string;
  fullName: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  education: string;
}

interface EmployeeGridProps {
  employees: Employee[];
  onRequestConsultation: (expertId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const EmployeeGrid: FC<EmployeeGridProps> = ({
  employees,
  onRequestConsultation,
  currentPage,
  totalPages,
  onPageChange
}) => {
  // Hàm render danh sách số trang
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 border ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-500 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Danh Sách Chuyên Gia
      </h1>

      {/* Search */}
      <div className="relative w-full md:w-1/3 mb-8 mx-auto">
        <input
          type="text"
          placeholder="Tìm kiếm chuyên gia..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <div className="p-4 flex-grow">
              <div className="flex items-center mb-4">
                <img
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                  src={employee.avatar || '/default-avatar.png'}
                  alt={employee.fullName}
                />
                <div className="ml-4">
                  <h3 className="font-bold text-lg text-gray-800">{employee.fullName}</h3>
                  <p className="text-blue-600 text-sm">{employee.position}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm">{employee.department}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm">{employee.education}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm truncate">{employee.email}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm">{employee.phone}</span>
                </div>
              </div>
            </div>

            {/* Consultation Request Button */}
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => onRequestConsultation(employee.id)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
              >
                Yêu cầu tư vấn
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <nav className="inline-flex rounded-md shadow">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            &laquo;
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            &raquo;
          </button>
        </nav>
      </div>
    </div>
  );
};

export default EmployeeGrid;
