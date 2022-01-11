export type NewGolink = {
  keyword: string;
  link: string;
};

export type Golink = NewGolink & {
  id: number;
};
