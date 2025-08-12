export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MentalAI</h3>
            <p>Giải pháp chăm sóc sức khỏe tinh thần hàng đầu Việt Nam</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
            <p>Email: support@mentalai.vn</p>
            <p>Hotline: 1900 1234</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Mạng xã hội</h3>
            <div className="flex space-x-4">
              {['Facebook', 'Zalo', 'TikTok'].map((social) => (
                <a key={social} href="#" className="hover:text-blue-200 transition">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-blue-700 mt-8 pt-8 text-center">
          <p>© 2025 MentalAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
