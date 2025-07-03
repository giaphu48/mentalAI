'use client';

import emailjs from 'emailjs-com';
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface OTPModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
}

const RESEND_TIMEOUT = 30;

const OTPModal: React.FC<OTPModalProps> = ({ isOpen, onClose, email }) => {
    const [otp, setOtp] = useState('');
    const [sentOtp, setSentOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendMessage, setResendMessage] = useState('');
    const [countdown, setCountdown] = useState(RESEND_TIMEOUT);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            setCountdown(RESEND_TIMEOUT);
            setResendMessage('');
            setError('');
            setOtp('');
            sendEmailOTP();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, isOpen]);

    // OTP expires after 5 minutes (300 seconds)
    const OTP_EXPIRE_TIME = 300; // seconds (5 minutes)

    const [otpExpireTime, setOtpExpireTime] = useState<number>(OTP_EXPIRE_TIME);

    // Reset OTP expiration timer when modal opens or OTP is resent
    useEffect(() => {
        if (isOpen) {
            setOtpExpireTime(OTP_EXPIRE_TIME);
        }
    }, [isOpen, sentOtp]);

    // Countdown OTP expiration
    useEffect(() => {
        if (isOpen && otpExpireTime > 0) {
            const timer = setTimeout(() => setOtpExpireTime(otpExpireTime - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [otpExpireTime, isOpen]);

    // Show error and invalidate OTP if OTP expired
    useEffect(() => {
        if (otpExpireTime === 0 && isOpen) {
            setError('Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.');
            setSentOtp(''); // Invalidate OTP
        }
    }, [otpExpireTime, isOpen]);

    const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

    const sendEmailOTP = async () => {
        const otpCode = generateOTP();
        setSentOtp(otpCode);

        const templateParams = {
            to_email: email,
            otp: otpCode,
        };

        try {
            await emailjs.send(
                'service_8q2ifa8',
                'template_wzu3bms',
                templateParams,
                'l6Cj9d45u7P2gf31c'
            );
        } catch (error) {
            console.error('Gửi email thất bại:', error);
            setError('Gửi email OTP thất bại');
        }
    };

    const getUserIdByEmail = async (email: string): Promise<string | null> => {
        try {
            const res = await axios.get(`http://localhost:3025/clients/email/${email}`);
            return res.data.id;
        } catch (err) {
            console.error('Không lấy được ID từ email');
            return null;
        }
    };

    // Fetch user data by email when modal opens
    useEffect(() => {
        if (isOpen && email) {
            getUserIdByEmail(email);
        }
    }, [isOpen, email]);

    const handleVerify = async () => {
        setLoading(true);
        setError('');

        if (otp === sentOtp) {
            const userId = await getUserIdByEmail(email);
            if (!userId) {
                setError('Không tìm thấy người dùng!');
                setLoading(false);
                return;
            }

            try {
                await axios.put(`http://localhost:3025/clients/verify/${userId}`);
                alert('Xác thực OTP thành công!');
                setOtp('');
                setSentOtp('');
                onClose();
                router.push('/taikhoan/dangnhap'); // Chuyển hướng đến trang đăng nhập
            } catch (err) {
                setError('Lỗi khi cập nhật trạng thái xác thực!');
            }
        } else {
            setError('Mã OTP không đúng!');
        }

        setLoading(false);
    };

    const handleResend = async () => {
        setResending(true);
        setResendMessage('');
        setError('');
        try {
            await sendEmailOTP();
            setResendMessage('Đã gửi lại mã OTP!');
            setCountdown(RESEND_TIMEOUT);
        } catch (err) {
            setError('Không thể gửi lại OTP');
        } finally {
            setResending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-transparent flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-center text-blue-700">Xác thực OTP</h3>
                <p className="text-sm text-gray-600 mb-4 text-center">
                    Mã OTP đã được gửi đến email: <strong>{email}</strong>
                </p>
                <input
                    type="text"
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
                />
                {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
                {resendMessage && <p className="text-sm text-green-600 mb-2">{resendMessage}</p>}

                <div className="flex justify-between gap-2 mb-2">
                    <button
                        onClick={handleResend}
                        disabled={resending || countdown > 0}
                        className="px-3 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 disabled:opacity-60"
                    >
                        {resending
                            ? 'Đang gửi lại...'
                            : countdown > 0
                                ? `Gửi lại (${countdown}s)`
                                : 'Gửi lại'}
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleVerify}
                            disabled={loading}
                            // Chuyển hướng đến trang đăng nhập sau khi xác thực thành công
                            // (nên dùng router của Next.js)
                            // import { useRouter } from 'next/navigation' ở đầu file
                            // const router = useRouter();
                            // và trong handleVerify: router.push('/login');
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {loading ? 'Đang xác thực...' : 'Xác thực'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPModal;
