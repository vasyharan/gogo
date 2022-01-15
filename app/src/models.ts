export type NewGolink = {
  keyword: string;
  link: string;
  active: boolean;
};

export type Golink = NewGolink & {
  id: number;
};
