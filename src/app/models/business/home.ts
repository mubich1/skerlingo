import { HomeType } from './types';
//import { Prestation } from './prestations';

export class HomeData {
  type: HomeType;
  title: string;
  salon_logo: string;
  salon_title: string;
  salon_name: string;
  description: string;
  date: Date;
  banner: string;
  giveaway: any;
  reservation_eval: any;

  approche: any;

  categories: [];
  prestations: [];
  offres: [];
}
