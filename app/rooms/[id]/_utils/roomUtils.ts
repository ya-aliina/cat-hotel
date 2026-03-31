export const formatArea = (area: number) => {
  return area.toString().replace('.', ',');
};

export const formatRoomCode = (slug: string) => {
  return slug.toUpperCase().replaceAll('-', ' ');
};
