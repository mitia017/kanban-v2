export function syncKanbanUpdate(
  kanbans: any[],
  currentKanban: any,
  updated: any
) {
  const updatedList = kanbans.map((k: any) =>
    k.id === updated.id ? updated : k
  );

  const updatedCurrent =
    currentKanban?.id === updated.id ? updated : currentKanban;

  return { updatedList, updatedCurrent };
}
