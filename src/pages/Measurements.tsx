import React, { useMemo, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import NavigationHeader from "@/components/NavigationHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressChart from "@/components/ProgressChart";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuid } from "uuid";

interface Draft {
  date: string;
  weight?: string;
  chest?: string;
  waist?: string;
  arms?: string;
  thighs?: string;
  notes?: string;
  photoData?: string;
}

export default function Measurements() {
  const { measurements } = useAppContext();
  const list = measurements ?? [];          // ← never undefined

  /* drawer state */
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>({
    date: new Date().toISOString().slice(0, 10),
  });

  /* ascending order */
  const sorted = useMemo(
    () =>
      [...list].sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      ),
    [list]
  );

  /* weight chart rows */
  const weightRows = useMemo(
    () =>
      sorted
        .filter((m) => m.weight !== undefined)
        .map((m) => ({
          date: m.date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
          }),
          value: m.weight!,
        })),
    [sorted]
  );

  const latest = sorted[sorted.length - 1];

  /* … (rest of the drawer / add-measurement code unchanged) … */
}
