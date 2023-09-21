export type ProvincesData = {
  name: string;
  code: number;
  division_type: ProvinceDivisionTypeEnum;
  codename: string;
  phone_code: number;
  districts: District[];
};

export type District = {
  name: string;
  code: number;
  division_type: DistrictDivisionTypeEnum;
  codename: string;
  province_code: number;
  wards: string[];
};

export enum DistrictDivisionTypeEnum {
  Huyện = 'huyện',
  Quận = 'quận',
  ThànhPhố = 'thành phố',
  ThịXã = 'thị xã',
}

export enum ProvinceDivisionTypeEnum {
  ThànhPhốTrungƯơng = 'thành phố trung ương',
  Tỉnh = 'tỉnh',
}

export type SearchLocationquery = {
  type?: string;
  keyword?: string;
};
