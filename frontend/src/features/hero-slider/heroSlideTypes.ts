export type SlideStatus = 'active' | 'inactive';

export interface HeroSlide {
  id: string;
  badge?: string;
  title: string;
  highlightText?: string;
  description?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  image: string;
  imageAlt?: string;
  tag?: string;
  status: SlideStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateHeroSlidePayload {
  badge?: string;
  title: string;
  highlightText?: string;
  description?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  image?: string;
  imageAlt?: string;
  tag?: string;
  status?: SlideStatus;
}

export interface UpdateHeroSlidePayload {
  badge?: string;
  title?: string;
  highlightText?: string;
  description?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  image?: string;
  imageAlt?: string;
  tag?: string;
  status?: SlideStatus;
}