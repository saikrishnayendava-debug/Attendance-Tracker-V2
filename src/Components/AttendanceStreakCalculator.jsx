import { useEffect, useState } from "react";
import React from "react";
const AttendanceStreakCalculator = ({ response }) => {
  const [stats, setStats] = useState({
    max_p_streak_count: 0,
    max_a_streak_count: 0,
  });

  useEffect(() => {
    if (!response?.attendance_table) return;

    const { headers, rows } = response.attendance_table;

    const subjectIdx = headers.indexOf("Subject");
    const attedHeldIdx = headers.indexOf("Atted/Held");
    if (subjectIdx === -1 || attedHeldIdx === -1) return;

    const days = attedHeldIdx - subjectIdx - 1;
    const subjectRows = rows.filter(
      (row) => row[1] && row[1] !== "WT.R"
    );

    let curP = 0;
    let curA = 0;
    let maxP = 0;
    let maxA = 0;

    for (let d = 0; d < days; d++) {
      const col = subjectIdx + 1 + d;

      let pCount = 0;
      let aCount = 0;

      subjectRows.forEach((row) => {
        const cell = row[col] || "";
        for (const ch of cell) {
          if (ch === "A") aCount++;
          else if (ch === "P") pCount++;
        }
      });

      // ✅ A-STREAK: continues if at least ONE A exists
      if (aCount > 0) {
        curA += aCount;
        maxA = Math.max(maxA, curA);
      } else {
        curA = 0;
      }

      // ✅ P-STREAK: only if ZERO A exists
      if (aCount === 0) {
        curP += pCount;
        maxP = Math.max(maxP, curP);
      } else {
        curP = 0;
      }
    }

    setStats({
      max_p_streak_count: maxP,
      max_a_streak_count: maxA,
    });
  }, [response]);

  return (
    <div className="flex justify-evenly items-center text-sm mb-50 text-slate-200">
      <div className="rounded-lg font-bold bg-lime-300 text-black flex flex-col items-center justify-center px-3 py-2">
        <p className="text-center">Present Streak🔥</p>
        <div className="font-extrabold flex gap-1 items-center"><span className="bg-lime-500 p-1 rounded-md font-extrabold">{stats.max_p_streak_count}periods</span> <span className="bg-black text-lime-500 p-1 rounded-md font-extrabold">{Math.floor(stats.max_p_streak_count / 7)} days</span></div>
      </div>
      <div className="rounded-lg font-bold bg-orange-300 text-black flex flex-col items-center justify-center px-3 py-2">
        <p className="text-center">Absent Streak🔥 </p>
        <div className="font-extrabold flex gap-1 items-center"><span className="bg-red-500 p-1 rounded-md font-extrabold">{stats.max_a_streak_count}periods</span> <span className="bg-black text-red-500 p-1 rounded-md font-extrabold">{Math.floor(stats.max_a_streak_count / 7)} days</span></div>
      </div>
    </div>
  );
};

export default AttendanceStreakCalculator;
