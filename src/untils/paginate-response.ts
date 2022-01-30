export function paginateResponse(
  data: [any[], number],
  page: number,
  take: number,
) {
  const [result, total] = data;
  const lastPage = Math.ceil(total / take);
  const nextPage = page + 1 > lastPage ? null : page + 1;
  const prevPage = page - 1 < 1 ? null : page - 1;
  return {
    data: [...result],
    count: total,
    currentPage: page,
    nextPage: nextPage,
    prevPage: prevPage,
    lastPage: lastPage,
  };
}

export function calcPaginate(
  take: number,
  pageNumber: number,
): [take: number, page: number, skip: number] {
  const page = pageNumber || 1;
  const skip = (page - 1) * take;

  return [take, page, skip];
}
