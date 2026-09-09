export function formatWon(value: number): string {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}
