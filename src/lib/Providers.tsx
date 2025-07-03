"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { persistStore } from "redux-persist";
import { ReactNode } from "react";

// Khởi tạo persistStore
persistStore(store);

// Định nghĩa kiểu cho props của Providers
interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <Provider store={store}>{children}</Provider>;
}
