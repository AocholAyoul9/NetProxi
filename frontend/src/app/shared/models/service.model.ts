export interface ServiceModel {
id: string;
name: string;
description: string;
basePrice: number;
 durationInMinutes: number;
companyId: string;
//active: boolean;
}

export interface   ServiceUpdateModel 
 {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  durationInMinutes: number;
  companyId: string;
}
