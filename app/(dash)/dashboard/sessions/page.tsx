import React from "react";
import { SessionsTable } from "../../../../components/sessions";
import { Plus } from "lucide-react";
import Link from "next/link";

type Props = {};

export default function page({}: Props) {
  return (
    <div className="pb-4">
      <div className="w-full flex items-center justify-between py-4">
        <h1 className="text-xl font-bold text-gray-100">All Sessions</h1>
        <Link
          href="/dashboard/sessions/session"
          className="bg-white hover:bg-gray-100 text-black text-sm font-bold py-2 px-4 flex items-center gap-2"
        >
          <Plus className="w-5 h-6" /> New Session
        </Link>
      </div>
      <div className="bg-gray-700 ">
        <SessionsTable />
      </div>
    </div>
  );
}
