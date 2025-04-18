export async function fetchOrders({
  searchQuery,
  page,
  itemsPerPage,
  onlyNew,
}) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const startIndex = (page - 1) * itemsPerPage;
  const mockData = Array.from(
    { length: 4 },
    (_, i) => `Item ${i + 1} for query: ${searchQuery}`
  );
  const paginatedData = mockData.slice(startIndex, startIndex + itemsPerPage);
  const totalCount = mockData.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return { data: paginatedData, totalCount, totalPages, currentPage: page };
}
