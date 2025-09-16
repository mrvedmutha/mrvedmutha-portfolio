// Types for admin service page

export interface IServiceIcon {
  name: string;
  lucideName: string; // e.g. 'panels-top-left', 'pen-tool', 'folder-open-dot', 'square-arrow-out-up-right'
}

export interface IServiceTag {
  name: string;
}

export interface IService {
  _id: string;
  name: string;
  icon: IServiceIcon;
  description: string;
  tags: IServiceTag[];
}

export type ServiceFormValues = {
  name: string;
  icon: IServiceIcon;
  description: string;
  tags: IServiceTag[];
};

export type ServiceRequest = ServiceFormValues;

export type ServiceResponse = IService;