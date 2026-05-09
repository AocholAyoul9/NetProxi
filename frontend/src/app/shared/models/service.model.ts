export interface ServiceModel {
id?: string;
name: string;
description: string;
basePrice: number;
 durationInMinutes: number;
//active: boolean;
}

export interface   ServiceUpdateModel 
 {
  id?: string;
  name: string;
  description: string;
  basePrice: number;
  durationInMinutes: number;
}
