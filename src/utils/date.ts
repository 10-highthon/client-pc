export const timeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.round((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "방금 전";
  } else if (diffInSeconds < 60 * 60) {
    return `${Math.round(diffInSeconds / 60)}분 전`;
  } else if (diffInSeconds < 60 * 60 * 24) {
    return `${Math.round(diffInSeconds / (60 * 60))}시간 전`;
  } else if (diffInSeconds < 60 * 60 * 24 * 7) {
    return `${Math.round(diffInSeconds / (60 * 60 * 24))}일 전`;
  } else if (diffInSeconds < 60 * 60 * 24 * 30) {
    return `${Math.round(diffInSeconds / (60 * 60 * 24 * 7))}주 전`;
  } else if (diffInSeconds < 60 * 60 * 24 * 365) {
    return `${Math.round(diffInSeconds / (60 * 60 * 24 * 30))}달 전`;
  } else {
    return `${Math.round(diffInSeconds / (60 * 60 * 24 * 365))}년 전`;
  }
};
