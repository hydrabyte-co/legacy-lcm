export async function handleAggregateStream(
  aggregateStream: any,
): Promise<any[]> {
  const aggrResult = [];
  if (aggregateStream) {
    let aggrItem = undefined;
    do {
      aggrItem = await aggregateStream.next();
      if (aggrItem) {
        delete aggrItem._id;
        aggrResult.push(aggrItem);
      }
    } while (aggrItem != null);
  }
  return aggrResult;
}
