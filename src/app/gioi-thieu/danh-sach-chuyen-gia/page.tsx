import type { NextPage } from 'next';
import EmployeeGrid from '../../../components/profileList/profileList';

const Home: NextPage = () => {
  const sampleEmployees = [
    {
      id: 1,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      fullName: 'Nguyễn Văn A',
      position: 'Kỹ sư phần mềm',
      department: 'Phòng Công nghệ',
      education: 'Thạc sĩ CNTT',
      email: 'nguyen.van.a@company.com',
      phone: '0987 654 321',
    },
    {
      id: 2,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      fullName: 'Trần Thị B',
      position: 'Trưởng phòng Nhân sự',
      department: 'Phòng Nhân sự',
      education: 'Cử nhân QTKD',
      email: 'tran.thi.b@company.com',
      phone: '0912 345 678',
    },
    {
      id: 3,
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      fullName: 'Lê Văn C',
      position: 'Kế toán trưởng',
      department: 'Phòng Tài chính',
      education: 'Cử nhân Kế toán',
      email: 'le.van.c@company.com',
      phone: '0903 456 789',
    },
    {
      id: 4,
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      fullName: 'Phạm Thị D',
      position: 'Chuyên viên Marketing',
      department: 'Phòng Marketing',
      education: 'Thạc sĩ Truyền thông',
      email: 'pham.thi.d@company.com',
      phone: '0978 912 345',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <EmployeeGrid employees={sampleEmployees} />
    </div>
  );
};

export default Home;