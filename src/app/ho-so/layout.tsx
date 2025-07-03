import React from 'react';
import ProfileMenu from '@/components/profileMenu/page';

export default function HoSoLayout({ children }: { children: React.ReactNode }) {
    return (
        <section style={{ display: 'flex', gap: '24px' }}>
            <aside style={{ minWidth: '220px' }}>
            <ProfileMenu />
            </aside>
            <main style={{ flex: 1 }}>
            {children}
            </main>
        </section>
    );
}