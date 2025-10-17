'use client';

import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import axiosInstance from '@/helpers/api/config';
import { useParams } from 'next/navigation';

type DiaryEntry = {
  id: string;
  entry_date: string;
  emotion: string;
  behavior: string;
  advise: string;
};

export default function EmotionDiary() {
  const { id } = useParams<{ id: string }>();
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // số dòng mỗi trang

  useEffect(() => {
    if (!id) return; // chờ có id từ router

    const fetchDiaryEntries = async () => {
      try {
        const response = await axiosInstance.get(`/clients/emotion-diaries/${id}`);
        const mappedData: DiaryEntry[] = response.data.map((entry: any) => ({
          id: entry.id,
          entry_date: entry.entry_date
            ? new Date(entry.entry_date).toLocaleDateString('vi-VN')
            : '',
          emotion: entry.emotion ?? '',
          behavior: entry.behavior ?? '',
          advise: entry.advise ?? '',
        }));
        setDiaryEntries(mappedData);
        setCurrentPage(1); // reset về trang 1 khi dữ liệu thay đổi
      } catch (error) {
        console.error('Error fetching diary entries:', error);
      }
    };

    fetchDiaryEntries();
  }, [id]);

  // Tính toán phân trang
  const totalItems = diaryEntries.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);
  const indexOfFirstItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return diaryEntries.slice(start, start + itemsPerPage);
  }, [diaryEntries, currentPage]);

  // Nếu currentPage vượt quá totalPages (sau khi dữ liệu thay đổi), đưa về trang cuối hợp lệ
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Nhật ký Cảm xúc</title>
        <meta name="description" content="Theo dõi và quản lý cảm xúc hàng ngày" />
      </Head>

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          Nhật ký Cảm xúc
        </h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-100 p-4 font-semibold text-gray-700">
            <div className="col-span-2">Ngày</div>
            <div className="col-span-4">Cảm xúc</div>
            <div className="col-span-3">Hành vi</div>
            <div className="col-span-3">Lời khuyên</div>
          </div>

          {currentItems.length > 0 ? (
            currentItems.map((entry) => {
              const [emotionTitle = entry.emotion, emotionDesc = ''] =
                (entry.emotion || '').split(' - ');
              return (
                <div
                  key={entry.id}
                  className="grid grid-cols-12 p-4 border-b border-gray-200 hover:bg-gray-50"
                >
                  <div className="col-span-2 text-gray-800 font-medium">
                    {entry.entry_date}
                  </div>
                  <div className="col-span-4">
                    <div className="font-medium text-gray-900">{emotionTitle}</div>
                    {emotionDesc && (
                      <div className="text-sm text-gray-600 mt-1">{emotionDesc}</div>
                    )}
                  </div>
                  <div className="col-span-3 text-gray-700">{entry.behavior}</div>
                  <div className="col-span-3 text-gray-600">{entry.advise}</div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500">
              Chưa có dữ liệu nhật ký nào
            </div>
          )}
        </div>

        {/* Phân trang */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">
            {totalItems > 0
              ? <>Hiển thị {indexOfFirstItem} - {indexOfLastItem} trong tổng số {totalItems} kết quả</>
              : 'Không có kết quả'}
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1 || totalItems === 0}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Trước
            </button>
            <span className="px-3 py-1">
              Trang {Math.min(currentPage, totalPages)} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage >= totalPages || totalItems === 0}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
