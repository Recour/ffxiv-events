export const isHousingDistrict = (map: string) => {
  return ["The Lavender Beds", "Mist", "The Goblet", "Shirogane", "Empyreum"].includes(map)
    || ["Private Cottage", "Private House", "Private Mansion", "Private Chambers", "Company Workshop", "Apartment"].some(substring => map.includes(substring));
}
