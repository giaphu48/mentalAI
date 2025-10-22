"use client";

import axiosInstance from "@/helpers/api/config";
import { useEffect, useMemo, useState } from "react";

type Option = { option_text: string; option_value: number | string };

export default function QuestionEditor({ id }: { id: string }) {
  const [form, setForm] = useState<{
    dimension: "EI" | "SN" | "TF" | "JP";
    text: string;
    options: Option[];
  }>({
    dimension: "EI",
    text: "",
    options: [
      { option_text: "", option_value: 1 },
      { option_text: "", option_value: -3 },
    ],
  });

  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [optionErrors, setOptionErrors] = useState<{
    [index: number]: { [k: string]: string };
  }>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const DIMENSIONS = useMemo(
    () =>
      [
        { value: "EI", label: "EI" },
        { value: "SN", label: "SN" },
        { value: "TF", label: "TF" },
        { value: "JP", label: "JP" },
      ] as const,
    []
  );

  const OPTION_VALUES = useMemo(() => [-3, 1, 3] as const, []);
  const API_BASE = "/tests";
  const onCancelHref = "/admin/trac-nghiem";

  // --------- Kiểu dữ liệu từ API & chuẩn hoá ----------
  type ApiQuestion = {
    id?: string | number;
    questionId?: string | number;
    question?: string;
    text?: string;
    dimension: "EI" | "SN" | "TF" | "JP";
    options?: Array<
      string | { text?: string; option_text?: string; value?: number; option_value?: number }
    >;
    option_values?: number[];
    choices?: { option_text?: string; text?: string; option_value?: number; value?: number }[];
  };

  const normalizeOptions = (data: ApiQuestion): Option[] => {
    if (Array.isArray(data.choices) && data.choices.length > 0) {
      return data.choices.map((c) => ({
        option_text: String(c.option_text ?? c.text ?? ""),
        option_value: Number(c.option_value ?? c.value ?? 1),
      }));
    }

    const rawOpts = data.options ?? [];
    const rawVals = data.option_values ?? [];

    if (rawOpts.length > 0) {
      if (typeof rawOpts[0] === "string") {
        return (rawOpts as string[]).map((t, i) => ({
          option_text: String(t ?? ""),
          option_value: Number(rawVals[i] ?? 1),
        }));
      }
      if (typeof rawOpts[0] === "object") {
        return (rawOpts as any[]).map((o) => ({
          option_text: String(o.option_text ?? o.text ?? ""),
          option_value: Number(o.option_value ?? o.value ?? 1),
        }));
      }
    }

    if (rawOpts.length || rawVals.length) {
      const max = Math.max(rawOpts.length, rawVals.length);
      const result: Option[] = [];
      for (let i = 0; i < max; i++) {
        const o = rawOpts[i] as any;
        const text = typeof o === "string" ? o : o?.option_text ?? o?.text ?? "";
        result.push({ option_text: String(text), option_value: Number(rawVals[i] ?? 1) });
      }
      return result;
    }

    return [
      { option_text: "", option_value: 1 },
      { option_text: "", option_value: -3 },
    ];
  };

  const mapApiToForm = (data: ApiQuestion) => ({
    dimension: data.dimension,
    text: String(data.question ?? data.text ?? ""),
    options: normalizeOptions(data),
  });

  // --------- Handlers ----------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value } as any));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleOptionChange = (idx: number, field: keyof Option, value: string) => {
    setForm((prev) => {
      const next = [...prev.options];
      const normalized = field === "option_value" ? Number(value) : value;
      next[idx] = { ...next[idx], [field]: normalized } as Option;
      return { ...prev, options: next };
    });
    setOptionErrors((prev) => ({
      ...prev,
      [idx]: { ...(prev[idx] || {}), [field]: "" },
    }));
  };

  const addOption = () => {
    setForm((prev) => ({
      ...prev,
      options: [...prev.options, { option_text: "", option_value: 1 }],
    }));
  };

  const removeOption = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== idx),
    }));
    setOptionErrors((prev) => {
      const clone = { ...prev } as any;
      delete clone[idx];
      return clone;
    });
  };

  const validate = () => {
    const e: { [k: string]: string } = {};
    const oe: { [i: number]: { [k: string]: string } } = {};

    if (!form.dimension || !["EI", "SN", "TF", "JP"].includes(form.dimension)) {
      e.dimension = "Chọn dimension hợp lệ (EI/SN/TF/JP).";
    }
    if (!form.text || form.text.trim().length < 5) {
      e.text = "Nhập nội dung câu hỏi (≥ 5 ký tự).";
    }
    if (!form.options || form.options.length < 2) {
      e.options = "Cần tối thiểu 2 lựa chọn.";
    } else {
      form.options.forEach((opt, i) => {
        const x: { [k: string]: string } = {};
        if (!opt.option_text || String(opt.option_text).trim().length < 1) {
          x.option_text = "Nhập nội dung lựa chọn.";
        }
        if (!OPTION_VALUES.includes(Number(opt.option_value) as (typeof OPTION_VALUES)[number])) {
          x.option_value = "Giá trị không hợp lệ.";
        }
        if (Object.keys(x).length) oe[i] = x;
      });
    }

    setErrors(e);
    setOptionErrors(oe);
    return Object.keys(e).length > 0 || Object.keys(oe).length > 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasError = validate();
    if (hasError) return;

    const payload = {
      question: form.text.trim(),
      dimension: form.dimension,
      options: form.options.map((o) => String(o.option_text || "").trim()).filter(Boolean),
      option_values: form.options.map((o) => Number(o.option_value)),
    };

    if (payload.options.length < 2) {
      setErrors((prev) => ({ ...prev, options: "Cần tối thiểu 2 lựa chọn hợp lệ." }));
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.put(`${API_BASE}/${id}`, payload);
      alert(`Cập nhật câu hỏi thành công! ID: ${data?.questionId ?? id}`);
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.message ?? "Có lỗi xảy ra khi cập nhật câu hỏi. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------- Fetch dữ liệu ----------
  const fetchQuestion = async () => {
    if (!id) {
      setFetchError("Thiếu id câu hỏi trong đường dẫn.");
      setInitialLoading(false);
      return;
    }
    setInitialLoading(true);
    setFetchError(null);
    try {
      const { data } = await axiosInstance.get<ApiQuestion>(`${API_BASE}/${id}`);
      setForm(mapApiToForm(data));
    } catch (err: any) {
      console.error(err);
      setFetchError(
        err?.response?.data?.message ?? "Không tải được dữ liệu câu hỏi. Vui lòng thử lại."
      );
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // --------- UI ----------
  if (initialLoading) {
    return (
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="border-b px-6 py-4">
          <h4 className="mt-2 text-lg font-bold flex items-center gap-2">
            CẬP NHẬT CÂU HỎI MBTI
            <i className="fas fa-clipboard-list text-gray-600" />
          </h4>
        </div>
        <div className="p-6">
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="border-b px-6 py-4">
          <h4 className="mt-2 text-lg font-bold flex items-center gap-2">
            CẬP NHẬT CÂU HỎI MBTI
            <i className="fas fa-clipboard-list text-gray-600" />
          </h4>
        </div>
        <div className="p-6 space-y-3">
          <p className="text-red-600">{fetchError}</p>
          <button
            onClick={fetchQuestion}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg mb-6">
      <div className="border-b px-6 py-4">
        <h4 className="mt-2 text-lg font-bold flex items-center gap-2">
          CẬP NHẬT CÂU HỎI MBTI
          <i className="fas fa-clipboard-list text-gray-600" />
        </h4>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Dimension */}
          <div>
            <label className="block text-sm font-medium mb-1">Dimension</label>
            <select
              name="dimension"
              value={form.dimension}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            >
              {DIMENSIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            {errors.dimension && (
              <p className="text-red-500 text-sm mt-1">{errors.dimension}</p>
            )}
          </div>

          {/* Question text */}
          <div>
            <label className="block text-sm font-medium mb-1">Nội dung câu hỏi</label>
            <textarea
              name="text"
              rows={3}
              value={form.text}
              onChange={handleChange}
              placeholder="Ví dụ: Tôi thấy tràn đầy năng lượng khi giao tiếp với nhiều người."
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            />
            {errors.text && <p className="text-red-500 text-sm mt-1">{errors.text}</p>}
          </div>

          {/* Options */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium mb-1">Lựa chọn trả lời</label>
              <button
                type="button"
                onClick={addOption}
                className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
              >
                + Thêm lựa chọn
              </button>
            </div>

            {errors.options && (
              <p className="text-red-500 text-sm mt-1">{errors.options}</p>
            )}

            <div className="mt-3 space-y-3">
              {form.options.map((opt, idx) => (
                <div key={idx} className="border rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Lựa chọn #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeOption(idx)}
                      disabled={form.options.length <= 2}
                      className={`text-sm px-2 py-1 rounded-md ${
                        form.options.length <= 2
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      Xoá
                    </button>
                  </div>

                  {/* option_text */}
                  <div className="mt-2">
                    <label className="block text-xs font-medium mb-1">Nội dung lựa chọn</label>
                    <input
                      type="text"
                      value={`${opt.option_text ?? ""}`}
                      onChange={(e) => handleOptionChange(idx, "option_text", e.target.value)}
                      placeholder="Ví dụ: Tôi thích giao lưu trong đám đông."
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    {optionErrors[idx]?.option_text && (
                      <p className="text-red-500 text-sm mt-1">{optionErrors[idx]?.option_text}</p>
                    )}
                  </div>

                  {/* option_value dropdown */}
                  <div className="mt-2">
                    <label className="block text-xs font-medium mb-1">Giá trị lựa chọn</label>
                    <select
                      value={Number(opt.option_value)}
                      onChange={(e) => handleOptionChange(idx, "option_value", e.target.value)}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                      {OPTION_VALUES.map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                    {optionErrors[idx]?.option_value && (
                      <p className="text-red-500 text-sm mt-1">{optionErrors[idx]?.option_value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Đang xử lý..." : "Cập nhật câu hỏi"}
            </button>
            <a
              href={onCancelHref}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md"
            >
              Quay lại
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
