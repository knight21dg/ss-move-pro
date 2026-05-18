import {
  Box, Home, Building2, Car, Package, Truck, Warehouse, Bike, Plane, Ship,
  Briefcase, Building, Boxes, ShieldCheck, Clock, Award, Users, Wrench, MapPin,
  PackageOpen, PackageCheck, Forklift, Map, Globe, Phone, Mail, Star, Heart,
  Container, Caravan, type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Box, Home, Building2, Car, Package, Truck, Warehouse, Bike, Plane, Ship,
  Briefcase, Building, Boxes, ShieldCheck, Clock, Award, Users, Wrench, MapPin,
  PackageOpen, PackageCheck, Forklift, Map, Globe, Phone, Mail, Star, Heart,
  Container, Caravan,
};

export const ICON_NAMES = Object.keys(ICON_MAP).sort();

export function getIcon(name?: string | null): LucideIcon {
  if (!name) return Package;
  return ICON_MAP[name] ?? Package;
}
