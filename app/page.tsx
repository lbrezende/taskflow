import { CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6 text-center px-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-10 w-10 text-blue-600" />
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            TaskFlow
          </h1>
        </div>
        <p className="max-w-md text-lg text-gray-600">
          Organize suas tarefas sem complicação. Em breve.
        </p>
        <div className="mt-4 rounded-full bg-blue-600 px-8 py-3 text-sm font-medium text-white">
          Em construção
        </div>
      </div>
    </div>
  );
}
