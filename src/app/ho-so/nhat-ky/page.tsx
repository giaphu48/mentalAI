'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import axiosInstance from '@/helpers/api/config';

export default function EmotionDiary() {
    const [diaryEntries, setDiaryEntries] = useState([]);

    useEffect(() => {
        const clientData = localStorage.getItem('user');
        const clientId = clientData ? JSON.parse(clientData).id : null;
        const fetchDiaryEntries = async () => {
            try {
                const response = await axiosInstance.get(`/clients/emotion-diaries/${clientId}`);
                const mappedData = response.data.map((entry:any) => ({
                    id: entry.id,
                    entry_date: entry.entry_date ? new Date(entry.entry_date).toLocaleDateString('vi-VN') : '',
                    emotion: entry.emotion,
                    behavior: entry.behavior,
                    advise: entry.advise,
                }));
                setDiaryEntries(mappedData);
            } catch (error) {
                console.error('Error fetching diary entries:', error);
            }
        };
        fetchDiaryEntries();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>Nhật ký Cảm xúc</title>
                <meta name="description" content="Theo dõi và quản lý cảm xúc hàng ngày" />
            </Head>

            <main className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold text-center text-indigo-700 mb-8">Nhật ký Cảm xúc</h1>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="grid grid-cols-12 bg-gray-100 p-4 font-semibold text-gray-700">
                        <div className="col-span-2">Ngày</div>
                        <div className="col-span-4">Cảm xúc</div>
                        <div className="col-span-3">Hành vi</div>
                        <div className="col-span-3">Lời khuyên</div>
                    </div>

                    {diaryEntries.length > 0 ? (
                        diaryEntries.map((entry) => (
                            <div key={entry.id} className="grid grid-cols-12 p-4 border-b border-gray-200 hover:bg-gray-50">
                                <div className="col-span-2 text-gray-800 font-medium">{entry.entry_date}</div>
                                <div className="col-span-4">
                                    <div className="font-medium text-gray-900">
                                        {entry.emotion.split(' - ')[0]}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {entry.emotion.split(' - ')[1]}
                                    </div>
                                </div>
                                <div className="col-span-3 text-gray-700">{entry.behavior}</div>
                                <div className="col-span-3 text-gray-600">{entry.advise}</div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">Chưa có dữ liệu nhật ký nào</div>
                    )}
                </div>
            </main>
        </div>
    );
}