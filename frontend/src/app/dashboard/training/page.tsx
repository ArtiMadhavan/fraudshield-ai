import { Construction } from "lucide-react";

export default function TrainingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <Construction className="w-16 h-16 text-slate-400 mb-4" />
      <h1 className="text-2xl font-bold text-slate-800">Coming Soon: Training History</h1>
      <p className="text-slate-500 mt-2 text-center max-w-sm">
        This enterprise module is currently under development and will be available in a future release.
      </p>
    </div>
  );
}
