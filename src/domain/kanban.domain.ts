export function syncKanbanUpdate(kanbans, currentKanban, updated) {
  const updatedList = kanbans.map((k) => (k.id === updated.id ? updated : k));

  const updatedCurrent =
    currentKanban?.id === updated.id ? updated : currentKanban;

  return { updatedList, updatedCurrent };
}
