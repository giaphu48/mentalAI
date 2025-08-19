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
  bio?: string;
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
  return (
    <div className="container mx-auto px-4 py-8">

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
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm">Bằng cấp: {employee.education}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 text-sm">Mô tả: {employee.bio}</span>
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
    </div>
  );
};

export default EmployeeGrid;
