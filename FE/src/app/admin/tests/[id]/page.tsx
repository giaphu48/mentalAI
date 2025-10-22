// app/questions/[id]/page.tsx
import QuestionEditor from "./QuestionEditor";

type PageProps = {
  params: {
    id?: string;
  };
};

export default async function Page({ params }: PageProps) {
  const id = params?.id;

  if (!id) {
    console.error("Missing or invalid params.id");
    return (
      <div style={{ padding: "20px", color: "red" }}>
        Đã có lỗi khi lấy tham số. Vui lòng thử lại.
      </div>
    );
  }

  // Ví dụ nếu bạn cần tải dữ liệu:
  // const res = await fetch(`https://api.example.com/questions/${id}`);
  // const questionData = await res.json();

  return <QuestionEditor id={id} /* data={questionData} */ />;
}
